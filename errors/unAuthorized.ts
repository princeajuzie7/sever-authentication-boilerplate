import { UNAUTHORIZED } from "http-status";
import CustomError from "./customError";

/**
 * Represents an unauthorized error.
 *
 * @extends {CustomError} - The base error class.
 */
export class UnAuthorized extends CustomError {
    /**
     * The HTTP status code for this error.
     *
     * @type {number}
     */
    statusCode: number;
    /**
     * Initializes an instance of the UnAuthorized class.
     *
     * @param {string} message - The error message.
     */
    constructor(message: string) {
        // Calling super constructor of the base class
        super(message);
        // Setting the HTTP status code for this error
        this.statusCode = UNAUTHORIZED;
    }
}

export default UnAuthorized;