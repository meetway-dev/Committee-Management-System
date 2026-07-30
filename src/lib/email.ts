const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

export async function sendInvitationEmail(
  email: string,
  inviteUrl: string,
  committeeName: string
): Promise<boolean> {
  if (!SENDGRID_API_KEY || !EMAIL_FROM) {
    return false;
  }

  try {
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email }],
            subject: `Invitation to join ${committeeName}`,
          },
        ],
        from: { email: EMAIL_FROM },
        content: [
          {
            type: "text/html",
            value: `<p>You have been invited to join the <strong>${committeeName}</strong> committee.</p><p><a href="${inviteUrl}">Click here to accept the invitation</a></p><p>If you can&apos;t click the link, copy and paste this URL into your browser:</p><p>${inviteUrl}</p>`,
          },
        ],
      }),
    });

    return true;
  } catch {
    return false;
  }
}
