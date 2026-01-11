import "server-only";

import { env } from "~/env";

import { ConsoleEmailSender } from "./console";
import { ResendEmailSender } from "./resend";
import { type EmailSender } from "./sender";
import { buildVerifyEmail } from "./templates/auth";

const appName = "OMI";

export const emailSender: EmailSender = env.RESEND_API_KEY
  ? new ResendEmailSender({
      apiKey: env.RESEND_API_KEY,
      fromEmail: env.RESEND_FROM_EMAIL,
    })
  : new ConsoleEmailSender();

export async function sendVerifyEmail(params: { to: string; verifyUrl: string }) {
  const { subject, html, text } = buildVerifyEmail({
    verifyUrl: params.verifyUrl,
    appName,
  });

  await emailSender.send({
    to: params.to,
    subject,
    html,
    text,
  });
}

