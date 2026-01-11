import "server-only";

import { Resend } from "resend";

import { type EmailSender, type SendEmailInput } from "./sender";

export class ResendEmailSender implements EmailSender {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  public constructor(params: { apiKey: string; fromEmail: string }) {
    this.resend = new Resend(params.apiKey);
    this.fromEmail = params.fromEmail;
  }

  public async send(input: SendEmailInput): Promise<void> {
    const base = {
      from: this.fromEmail,
      to: input.to,
      subject: input.subject,
    };

    const payload = (() => {
      if (input.html && input.text) {
        return { ...base, html: input.html, text: input.text };
      }

      if (input.html) {
        return { ...base, html: input.html };
      }

      if (input.text) {
        return { ...base, text: input.text };
      }

      throw new Error("Resend send failed: missing html/text body");
    })();

    const { data, error } = await this.resend.emails.send(payload);

    if (error) {
      throw new Error(`Resend send failed: ${error.name}: ${error.message}`);
    }

    if (!data?.id) {
      throw new Error("Resend send failed: missing email id");
    }
  }
}
