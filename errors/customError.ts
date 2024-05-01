/**
 * CustomError is a custom error class that extends the built-in Error class.
 * It allows for creating custom errors with a specific message.
 */
export class CustomError extends Error {
    /**
     * Constructor for CustomError.
     * @param {string} message - The error message to be displayed when the error is thrown.
     */
    constructor(message: string) {
        // Call the superclass constructor with the provided error message.
        super(message);
    }
}

/**
 * The default export is the CustomError class.
 */
export default CustomError;