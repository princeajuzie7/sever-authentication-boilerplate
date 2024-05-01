import { config } from "dotenv"

config()
/**
 * Represents the configuration for sending emails using Gmail SMTP server.
 *
 * @property {string} host - The hostname of the SMTP server.
 * @property {number} port - The port number to connect to the SMTP server.
 * @property {object} auth - The authentication details for the SMTP server.
 * @property {string} auth.user - The username for the Gmail account.
 * @property {string} auth.pass - The password for the Gmail account.
 */
export default {
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: process.env.MAILING_USER,
        pass: process.env.MAILING_PASSWORD,
    },
};



