import { SendMail } from "./sendMail";
import SMTPTransport from "nodemailer/lib/smtp-transport";


/**
 * Sends a password reset token to the user's email.
 *
 * @param {string} username - The username of the user.
 * @param {string} email - The email address of the user.
 * @param {string} origin - The origin URL of the application.
 * @param {string} passwordResetToken - The token to be used for password reset.
 *
 * @returns {Promise<SMTPTransport.SentMessageInfo>} - A promise that resolves when the email is sent.
 */
export function sendPasswordResetToken({
  username,
  email,
  origin,
  passwordResetToken,
}: {
  username: string;
  email: string;
  origin: string;
  passwordResetToken: string;
}): Promise<SMTPTransport.SentMessageInfo> {
  const resetlink = `${origin}/auth/verifypasswordresetoken/?token=${passwordResetToken}`;
  const message = `<p> Hey ${username} please click on this link to reset your email <a href="${resetlink}"> reset password</a></p>`;

  return SendMail({
    to: email,
    subject: "password reset",
    html: message,
  });
}

export default sendPasswordResetToken;