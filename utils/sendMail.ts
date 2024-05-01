import nodemailer from "nodemailer";
import nodemailerConfig from "./nodemailerConfig";
import SMTPTransport from "nodemailer/lib/smtp-transport";
/**
 * Interface for sending mail parameters.
 */
interface SendMails {
    /**
     * Recipient's email address.
     */
    to: string;
    /**
     * Email subject.
     */
    subject: string;
    /**
     * HTML content of the email.
     */
    html: string;
}

/**
 * Sends an email using Nodemailer.
 *
 * @param {SendMails} options - Object containing the email parameters.
 * @returns {Promise<SMTPTransport.SentMessageInfo>} - Resolves when the email is sent.
 */
export async function SendMail({
  to,
  subject,
  html,
}: SendMails): Promise<SMTPTransport.SentMessageInfo> {
  // Create a Nodemailer transporter using the configuration from nodemailerConfig.
  const transporter = nodemailer.createTransport(nodemailerConfig);

  // Send the email.
  return transporter.sendMail({
    from: '"efficsync" <efficsync@gmail.com>',
    to,
    subject,
    html,
  });
}