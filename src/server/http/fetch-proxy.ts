import "server-only";

import { createRequire } from "node:module";

type GlobalWithProxy = typeof globalThis & {
  __omiFetchProxyInitialized?: boolean;
  __omiFetchProxyDispatcher?: unknown;
  __omiFetchProxyOriginalFetch?: typeof fetch;
};

function normalizeProxyUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (trimmed.includes("://")) return trimmed;
  return `http://${trimmed}`;
}

function shouldProxyFetchInput(input: RequestInfo | URL): boolean {
  try {
    const url =
      typeof input === "string"
        ? new URL(input, "http://localhost")
        : input instanceof URL
          ? input
          : new URL(input.url);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    const hostname = url.hostname.toLowerCase();
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function setupFetchProxyFromEnv() {
  const globalForProxy = globalThis as GlobalWithProxy;
  if (globalForProxy.__omiFetchProxyInitialized) {
    return;
  }

  const proxyUrlRaw = process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY;
  if (!proxyUrlRaw) {
    globalForProxy.__omiFetchProxyInitialized = true;
    return;
  }

  const proxyUrl = normalizeProxyUrl(proxyUrlRaw);
  if (!proxyUrl) {
    globalForProxy.__omiFetchProxyInitialized = true;
    return;
  }

  const originalFetch = globalThis.fetch;
  if (typeof originalFetch !== "function") {
    globalForProxy.__omiFetchProxyInitialized = true;
    return;
  }

  globalForProxy.__omiFetchProxyOriginalFetch = originalFetch;

  try {
    const require = createRequire(import.meta.url);
    // Lazy import so production environments without proxy don't pay the cost.
    // This also keeps the integration minimal: only when HTTPS_PROXY/HTTP_PROXY
    // is present we initialize undici's ProxyAgent and attach it as dispatcher.
    const { ProxyAgent } = require("undici") as {
      ProxyAgent: new (url: string) => unknown;
    };

    const dispatcher = new ProxyAgent(proxyUrl);
    globalForProxy.__omiFetchProxyDispatcher = dispatcher;

    globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const nextInit = (init ?? {}) as Record<string, unknown>;
      if (nextInit.dispatcher) {
        return originalFetch(input, init);
      }
      if (!shouldProxyFetchInput(input)) {
        return originalFetch(input, init);
      }
      return originalFetch(input, { ...nextInit, dispatcher } as RequestInit);
    };
  } catch (error) {
    console.warn(
      "[omi] Failed to init fetch proxy. Outbound requests may time out.",
      error
    );
  } finally {
    globalForProxy.__omiFetchProxyInitialized = true;
  }
}
