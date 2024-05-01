import express, { Express, Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import userModel from "../../models/userModel";
import * as jwt from "jsonwebtoken";
import { log } from "console";
import { BadRequestError, UnAuthorized } from "../../errors";
import crypto from "crypto";
import sendVerificationEmail from "../../utils/sendVerificationEmail";
import httpStatus, { BAD_REQUEST, OK } from "http-status";
import createTokenUser from "../../utils/createTokenUser";
import TokenModel from "../../models/TokenModel";
import { attachCookiesToResponse } from "../../utils/jwt";
import sendPasswordResetToken from "../../utils/sendPasswordResetToken";
import createHash from "../../utils/createHash";
interface Userbody {
  username: string;
  password: string;
  email: string;
}
const origin = "http://localhost:3000";
    
    const serveorigin = "http://localhost:8000/client/api";
/**
 * Signs up a new user.
 * @param req - Express request object containing the username, email, and password.
 * @param res - Express response object used to send the success message or error response.
 * @param next - Express next function used to handle errors.
 * @returns A response with a success message and a status code of 201 (Created) if the user is created successfully, otherwise an error response.
 * @throws BadRequestError if the email already exists.
 * @throws UnAuthorized if the provided credentials are invalid.
 */
async function Signup(req: Request, res: Response, next: NextFunction) {
  console.log("auth controller hit successfully");
  const { username, email, password }: Userbody = req.body;
 
  const EmailAlreadyExist = await userModel.findOne({ email });

  if (EmailAlreadyExist) {
    return res.status(BAD_REQUEST).json({ message: "Email already exist" });
    // throw new BadRequestError('Email already exist')
  }


  const verificationToken = crypto.randomBytes(40).toString("hex");
  try {
    const newUser = await userModel.create({
      username,
      email,
      password,
      verificationToken,
    });



    await sendVerificationEmail({
      name: newUser?.username,
      email: newUser?.email,
      verificationToken: newUser?.verificationToken,
      origin,
    });
    
   
    const user = await userModel.findOne({ email });
    
      if (!user) {
        console.log("incorrect email ");
        throw new UnAuthorized("invalid credentials");
      }
    
    const ispasswordCorrect = await user.comparePassword(password);
    console.log(ispasswordCorrect, "ispasswordCorrect");
    if (!ispasswordCorrect) {
      console.log("password incorrect");
      throw new UnAuthorized("invalid credentials");
    }

    
     const tokenUser = createTokenUser(user);
     let refreshToken = "";
     const existingToken = await TokenModel.findOne({ user: user._id });

     if (existingToken) {
       const { $isValid } = existingToken;
       console.log("token existing");

       if (!$isValid) {
         throw new UnAuthorized("invalid credentials");
       }
       refreshToken = existingToken.refreshToken;

       attachCookiesToResponse({ res, user: tokenUser, refreshToken });
       res.status(OK).json({ user: tokenUser });
       return;
     }

     refreshToken = crypto.randomBytes(40).toString("hex");
     const userAgent = req.headers["user-agent"];
     const ip = req.ip;
     const userToken = { refreshToken, ip, userAgent, user: user._id };
     await TokenModel.create(userToken);
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    
    res.status(httpStatus.CREATED).json({
      message: "Success! Please check your mail to verify your account",
    });
    



    log(newUser, "newUser");
  } catch (error: Error | any) {
    console.log(error);
    next(error);
  }
}

/**
 * Verifies an email address by comparing the provided verification token with the stored token for the given email address.
 * If the tokens match, the user's email address is marked as verified and the function returns a response indicating success.
 * If the tokens do not match, or if the email address is not found, the function returns an error response.
 * @param req - Express request object
 * @param res - Express response object
 */

async function verifyEmail(req: Request, res: Response) {
  try {
    const {
      verificationToken,
      email,
    }: { verificationToken: string; email: string } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new UnAuthorized("verification failed");
    }

    if (user.verificationToken !== verificationToken) {
      throw new UnAuthorized("verification failed");
    }

    user.isVerified = true;
    user.verified = new Date();
    user.verificationToken = "";
    await user.save();

    const tokenUser = createTokenUser(user);
    let refreshToken = "";
    const existingToken = await TokenModel.findOne({ user: user._id });

    if (existingToken) {
      const { $isValid } = existingToken;
      console.log("token existing");

      if (!$isValid) {
        throw new UnAuthorized("invalid credentials");
      }
      refreshToken = existingToken.refreshToken;

      attachCookiesToResponse({ res, user: tokenUser, refreshToken });
      return res.status(httpStatus.OK).json({
        message: "Email verified",
        isverified: user.isVerified,
        email: user.email,
      });
    }

    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: user._id };
    await TokenModel.create(userToken);
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    return res.status(httpStatus.CREATED).json({
      message: "Email verified",
      isverified: user.isVerified,
      email: user.email,
    });
  } catch (error: Error | any) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
}



/**
 * Signs in a user.
 * @param req - Express request object containing the email and password.
 * @param res - Express response object used to send the success message or error response.
 * @param next - Express next function used to handle errors.
 * @returns A response with a success message and a status code of 200 (OK) if the user is authenticated successfully, otherwise an error response.
 * @throws BadRequestError if the email or password is missing.
 * @throws UnAuthorized if the provided credentials are invalid.
 */
async function Signin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.body.email || !req.body.password) {
      throw new BadRequestError("Please provide email and password");
    }

    const { email, password }: { email: string; password: string } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("incorrect email ");
      throw new UnAuthorized("invalid credentials");
    }

    const ispasswordCorrect = await user.comparePassword(password);
    console.log(ispasswordCorrect, "ispasswordCorrect");
    if (!ispasswordCorrect) {
      console.log("password incorrect");
      throw new UnAuthorized("invalid credentials");
    }

    // if (!user.isVerified) {
    //   throw new UnAuthorized("Please verify your email first");
    // }

    const tokenUser = createTokenUser(user);
    let refreshToken = "";
    const existingToken = await TokenModel.findOne({ user: user._id });

    if (existingToken) {
      const { $isValid } = existingToken;
      console.log("token existing");

      if (!$isValid) {
        throw new UnAuthorized("invalid credentials");
      }
      refreshToken = existingToken.refreshToken;

      attachCookiesToResponse({ res, user: tokenUser, refreshToken });
      res.status(OK).json({ user: tokenUser });
      return;
    }

    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: user._id };
    await TokenModel.create(userToken);
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(OK).json({ user: tokenUser, message: "logged in successfully" });
  } catch (error) {
    next(error);
  }
}

/**
 * ForgotPassword function is used to send a password reset token to the user's email address.
 * @param req - Express request object containing the user's email address.
 * @param res - Express response object used to send the success message.
 * @param next - Express next function used to handle errors.
 * @returns A response with a success message and a status code of 200 (OK).
 * @throws BadRequestError if the email does not exist.
 */
async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  
  try {
    
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new BadRequestError("Email does not exist");
    }

    const passwordResetToken = crypto.randomBytes(70).toString('hex')
    await sendPasswordResetToken({
      passwordResetToken,
      username: user.username,
      email: user.email,
      origin: origin,
    });   
    const tenminutes = 1000 * 60 * 10;
    const passwordRestTokenExipiry = new Date(Date.now() + tenminutes)
     user.passwordToken = createHash(passwordResetToken);
    user.passwordTokenExpiration = passwordRestTokenExipiry;
    await user.save();
    res.status(httpStatus.OK).json({
      message: "Please check your email to reset your password",
    });
  } catch(error) {
    next(error) 
  }


    
   
}

/**
 * Verifies a password reset token.
 * @param req - Express request object containing the token.
 * @param res - Express response object used to send the success message.
 * @param next - Express next function used to handle errors.
 * @returns A response with a success message and a status code of 200 (OK) if the token is valid, otherwise an error response.
 * @throws UnAuthorized if the token is invalid or has expired.
 */
async function verifyPasswordResetToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { token } = req.body;
  const encryptedToken = createHash(token);
  const currentDate = Date.now();
  try {
    const user = await userModel.findOne({
      passwordToken: encryptedToken,
      passwordTokenExpiration: { $gt: currentDate },
    });

    if (!user || !token) {
      throw new UnAuthorized('invalid token or token expired');
    }

    res.status(httpStatus.OK).json({ message: "valid token" });
  } catch (error: Error | any) {
    throw new Error(error);
  }
}
 


/**
 * Updates the user's password.
 * @param req - Express request object containing the new password, confirmation of the new password, and the token.
 * @param res - Express response object used to send the success message.
 * @param next - Express next function used to handle errors.
 * @returns A response with a success message and a status code of 200 (OK) if the password is updated successfully, otherwise an error response.
 * @throws BadRequestError if the new password is not provided.
 * @throws BadRequestError if the confirmation of the new password is not provided.
 * @throws BadRequestError if the token is invalid or expired.
 * @throws Error if there is an error updating the password.
 */
async function updatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body.password || !req.body.confirmpassword) {
      throw new BadRequestError("New password is required");
    }

    const { password, confirmpassword, token } = req.body;

    const currentDate = new Date();

    const encryptedToken = createHash(token);

    const user = await userModel.findOne({
      passwordToken: encryptedToken,
      passwordTokenExpiration: { $gt: currentDate },
    });

    if (!user) {
      throw new BadRequestError("Token is invalid or expired");
    }

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpiration > currentDate
    ) {
      user.password = password;
      user.passwordToken = "";
      user.passwordTokenExpiration = "";
      console.log("updated successfully");
      await user.save();
      return res.status(httpStatus.OK).json({
        message: "Password updated successfully",
      });
    }
  } catch (error: Error | any) {
    throw new Error(error);
  }
}

export {
  Signup,
  Signin,
  verifyEmail,
  forgotPassword,
  updatePassword,
  verifyPasswordResetToken,
};
