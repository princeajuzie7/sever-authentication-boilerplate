
import { Document } from "mongoose"

/**
 * Interface representing a user in the system.
 * Extends the Mongoose Document interface to include additional user-specific fields.
 */
interface Users extends Document {
    /**
     * The username of the user.
     */
    username: string;
    /**
     * The unique identifier of the user.
     */
    _id: string;
    /**
     * The email address of the user.
     */
    email: string;
}

/**
 * Function that creates a token user object from a Mongoose User document.
 * @param {Users} user - The Mongoose User document to create a token user object from.
 * @returns {Object} - An object containing the username, _id, and email of the user.
 */
export  function createTokenUser(user: Users): Object {
    return {
        username: user.username,
        _id: user._id,
        email: user.email,
    };
}

export default createTokenUser;