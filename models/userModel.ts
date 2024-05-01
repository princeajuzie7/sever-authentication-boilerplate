import mongoose, { Document, Model } from "mongoose";
// import bycrpt from "bcryptjs";
import bcrypt from "bcrypt";
import validator from "validator";

/**
 * Represents a user document in the database.
 *
 * @typedef {mongoose.Document<UserDocument, UserModel>} UserDocument
 * @property {string} username - The username of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} verificationToken - A token used for email verification.
 * @property {boolean} isVerified - Indicates whether the user's email is verified.
 * @property {Date} verified - The date when the user's email was verified.
 * @property {string} [passwordToken] - A token used for password reset.
 * @property {Date | string} passwordTokenExpiration - The expiration date or time of the password reset token.
 * @property {function(): Promise<boolean>} comparePassword - A method to compare the user's password with a provided password.
 */
interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  verificationToken: string;
  isVerified: boolean;
  verified: Date;
  passwordToken?: string;
  passwordTokenExpiration: Date | string;
  comparePassword(userpassword: string): Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {
  // You can add static methods here if needed
}

const emailValidator = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

/**
 * Represents a schema for a user document in the database.
 *
 * @param {mongoose.Schema<UserDocument, UserModel>} UserSchema - A Mongoose schema for the user document.
 * @returns {mongoose.Model<UserDocument, UserModel>} - A Mongoose model for the user document.
 */
const UserSchema = new mongoose.Schema<UserDocument, UserModel>(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: [true, "please provide email"],
      validate: {
        validator: emailValidator,
        message: "please provide valid email",
      },
    },
    password: {
      type: String,
      require: [true, "please provide a password"],
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },

    verified: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpiration: {
      type: Date,
    },
  },
  { timestamps: true }
);

/**
 * Pre-save middleware to hash the password before saving the user document.
 *
 * @param {import("mongoose").HookNextFunction} next - Mongoose's built-in `next` function to pass control to the next middleware.
 */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // If password is not modified, proceed to the next middleware
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});



/**
 * Compares the provided password with the stored password hash.
 *
 * @param {string} userPassword - The password to compare with the stored hash.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean value indicating whether the passwords match.
 */
UserSchema.methods.comparePassword = async function (userPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};


/**
 * Represents a schema for a user document in the database.
 *
 * @param {mongoose.Schema<UserDocument, UserModel>} UserSchema - A Mongoose schema for the user document.
 * @returns {mongoose.Model<UserDocument, UserModel>} - A Mongoose model for the user document.
 */
export default mongoose.model<UserDocument, UserModel>("usermodel", UserSchema);
