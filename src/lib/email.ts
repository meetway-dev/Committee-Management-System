import nodemailer from "nodemailer";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.GMAIL_USER || process.env.SMTP_USER;
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || process.env.GMAIL_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD;

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

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<boolean> {
  if (!EMAIL_FROM || !SMTP_USER || !SMTP_PASSWORD) {
    console.info("Password reset email is mocked because SMTP is not configured.", {
      email,
      resetUrl,
    });
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: "Reset your password",
      html: `
        <p>You requested a password reset.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>If the link does not work, copy this URL into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link expires in 30 minutes.</p>
      `,
    });

    return true;
  } catch (error) {
    console.error("Password reset email failed:", error);
    return false;
  }
}
