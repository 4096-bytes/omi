import "server-only";

import { type EmailSender, type SendEmailInput } from "./sender";

export class ConsoleEmailSender implements EmailSender {
  public async send(input: SendEmailInput): Promise<void> {
    console.warn(
      "[email] RESEND_API_KEY is not set; email will not be sent. Content:",
      {
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      }
    );
  }
}

