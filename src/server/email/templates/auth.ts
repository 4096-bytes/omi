import "server-only";

export function buildVerifyEmail(params: {
  verifyUrl: string;
  appName: string;
}) {
  const subject = `Verify your email for ${params.appName}`;
  const text = `Verify your email for ${params.appName}:\n\n${params.verifyUrl}\n`;
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;">
      <h2 style="margin: 0 0 12px;">Verify your email</h2>
      <p style="margin: 0 0 12px;">Click the link below to verify your email for ${params.appName}:</p>
      <p style="margin: 0 0 12px;">
        <a href="${params.verifyUrl}" target="_blank" rel="noreferrer noopener">
          Verify email
        </a>
      </p>
      <p style="margin: 0; color: #666; font-size: 12px;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
  `.trim();

  return { subject, html, text };
}

