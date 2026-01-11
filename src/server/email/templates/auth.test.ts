import { describe, expect, it } from "vitest";

import { buildVerifyEmail } from "./auth";

describe("buildVerifyEmail", () => {
  it("includes appName and verifyUrl in outputs", () => {
    const verifyUrl = "http://localhost:3000/api/auth/verify-email?token=test";
    const { subject, html, text } = buildVerifyEmail({ verifyUrl, appName: "OMI" });

    expect(subject).toContain("OMI");
    expect(text).toContain(verifyUrl);
    expect(html).toContain(verifyUrl);
  });
});

