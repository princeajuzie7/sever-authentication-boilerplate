import express, { Express } from "express";
import {
  Signup,
  Signin,
  verifyEmail,
  forgotPassword,
  updatePassword,
  verifyPasswordResetToken,
} from "../../controllers/auth";

/**
 * AuthRouter is a module that contains routes for user authentication.
 */
const AuthRouter = express.Router();

/**
 * Signs up a new user.
 *
 * @route POST /signup
 * @param {express.Request} req - The request object containing the user data.
 * @param {express.Response} res - The response object to send the success or error message.
 * @param {express.NextFunction} next - The next middleware function in the chain.
 * @returns {void} - No response is returned, instead the user data is processed and stored.
 */
AuthRouter.route('/signup').post(Signup);

/**
 * Signs in an existing user.
 *
 * @route POST /signin
 * @param {express.Request} req - The request object containing the user credentials.
 * @param {express.Response} res - The response object to send the success or error message.
 * @param {express.NextFunction} next - The next middleware function in the chain.
 * @returns {void} - No response is returned, instead the user credentials are processed and authenticated.
 */
AuthRouter.route('/signin').post(Signin);

/**
 * Verifies the user's email address.
 *
 * @route POST /verifyemail
 * @param {express.Request} req - The request object containing the user's email.
 * @param {express.Response} res - The response object to send the success or error message.
 * @param {express.NextFunction} next - The next middleware function in the chain.
 * @returns {void} - No response is returned, instead the user's email is verified.
 */
AuthRouter.route('/verifyemail').post(verifyEmail);

/**
 * Initiates the process of resetting the user's password.
 *
 * @route POST /forgotpassword
 * @param {express.Request} req - The request object containing the user's email.
 * @param {express.Response} res - The response object to send the success or error message.
 * @param {express.NextFunction} next - The next middleware function in the chain.
 * @returns {void} - No response is returned, instead an email with a reset token is sent to the user.
 */
AuthRouter.route("/forgotpassword").post(forgotPassword);

/**
 * Updates the user's password.
 *
 * @route POST /updatepassword
 * @param {express.Request} req - The request object containing the user's new password and reset token.
 * @param {express.Response} res - The response object to send the success or error message.
 * @param {express.NextFunction} next - The next middleware function in the chain.
 * @returns {void} - No response is returned, instead the user's password is updated.
 */
AuthRouter.route('/updatepassword').post(updatePassword);

/**
 * Verifies the user's password reset token.
 *
 * @route POST /verifypasswordresetoken/
 * @param {express.Request} req - The request object containing the user's reset token.
 * @param {express.Response} res - The response object to send the success or error message.
 * @param {express.NextFunction} next - The next middleware function in the chain.
 * @returns {void} - No response is returned, instead the user's reset token is verified.
 */
AuthRouter.route("/verifypasswordresetoken/").post(
  verifyPasswordResetToken
);





export default AuthRouter;
