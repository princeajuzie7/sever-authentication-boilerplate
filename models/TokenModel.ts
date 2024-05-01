import mongoose from "mongoose";

/**
 * TokenSchema is a Mongoose schema for storing token data.
 * It includes fields for refreshToken, ip, and user.
 * @typedef {mongoose.Schema} TokenSchema
 */
const TokenSchema = new mongoose.Schema({
    /**
     * refreshToken is a string field that represents the refresh token for a user.
     * It is required, read-only, and unique.
     * @type {string}
     * @memberof TokenSchema
     */
    refreshToken: {
        type: String,
        required: true,
        readOnly: true,
        unique: true
    },
    /**
     * ip is a string field that represents the IP address of the user.
     * It is required, read-only, and unique.
     * @type {string}
     * @memberof TokenSchema
     */
    ip: {
        type: String,
        required: true,
        readOnly: true,
        unique: true
    },
    /**
     * user is a reference to the User model.
     * It is required, read-only, and unique.
     * @type {mongoose.Types.ObjectId}
     * @memberof TokenSchema
     */
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        readOnly: true,
        unique: true,
        ref: 'usermodel'
    }
});

/**
 * Tokenmodel is a Mongoose model that uses the TokenSchema.
 * It is used to store token data in the database.
 * @type {mongoose.Model<TokenSchema>}
 * @memberof TokenSchema
 */
export default mongoose.model('Tokenmodel', TokenSchema);