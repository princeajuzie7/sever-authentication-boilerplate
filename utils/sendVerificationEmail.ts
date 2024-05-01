import { SendMail } from "./sendMail";
import SMTPTransport from "nodemailer/lib/smtp-transport";
/**
 * Sends a verification email to the specified user.
 *
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} verificationToken - The token used to verify the user's email.
 * @param {string} origin - The origin URL of the application.
 *
 * @returns {Promise<SMTPTransport.SentMessageInfo>} - A promise that resolves when the email has been sent.
 */
export default async function sendVerificationEmail({
  name,
  email,
  verificationToken,
  origin,
}: {
  name: string;
  email: string;
  verificationToken: string;
  origin: string;
}): Promise<SMTPTransport.SentMessageInfo> {
  // Construct the URL for the verification link.
  const verifyEmail = `${origin}/auth/verifyemail?token=${verificationToken}&email=${email}`;

  // Construct the HTML message for the email.
  const message = `<p>Please confirm your email by clicking on the following link:</p>
    <a href="${verifyEmail}">Verify Email</a>`;

  // Send the email using the SendMail function.
  return SendMail({
    to: email,
    subject: "Email verification",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
}