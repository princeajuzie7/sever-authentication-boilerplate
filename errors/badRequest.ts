import CustomError from "./customError";
import httpStatus from "http-status";

/**
 * Custom error class for handling bad request errors.
 *
 * @extends {CustomError} - Extends the CustomError class.
 */
export class BadRequestError extends CustomError {
    /**
     * The HTTP status code for this error.
     *
     * @type {number}
     */
  statusCode: number;
  /**
   * Constructor for the BadRequestError class.
   *
   * @param {string} message - The error message to be displayed.
   */
  constructor(message: string) {
    // Calling super constructor of CustomError class
    super(message);
    // Setting the HTTP status code for this error
    this.statusCode = httpStatus.BAD_REQUEST;
  }
}

export default BadRequestError;