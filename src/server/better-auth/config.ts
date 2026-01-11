import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { env } from "~/env";
import { setupFetchProxyFromEnv } from "~/server/http/fetch-proxy";
import { db } from "~/server/db";
import { sendVerifyEmail } from "~/server/email";

setupFetchProxyFromEnv();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendVerifyEmail({ to: user.email, verifyUrl: url });
      } catch (error) {
        console.error("[auth] Failed to send verification email", {
          email: user.email,
          verifyUrl: url,
          error,
        });
      }
    },
  },
  socialProviders: {
    google: {
      clientId: env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
      redirectURI: "http://localhost:3000/api/auth/callback/google",
      mapProfileToUser: async (profile) => {
        const email = typeof profile.email === "string" ? profile.email : null;
        const name = typeof profile.name === "string" ? profile.name.trim() : "";

        if (name) {
          return {};
        }

        if (email) {
          const localPart = email.split("@")[0]?.trim();
          if (localPart) {
            return { name: localPart };
          }
        }

        return { name: "User" };
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
