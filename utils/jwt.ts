import  Jwt  from "jsonwebtoken";
require('dotenv').config()
import { Response } from "express";
/**
 * @env {}
 */
const secretKey = process.env.JWT_SECRET_KEY;

/**
 * Interface for the payload of a JSON Web Token.
 * @property {any} user - The user data to be included in the JWT token.
 * @property {string} [refreshToken] - The refresh token to be included in the JWT token.
 */
interface Payload {
  user: any;
  refreshToken?: string;
}

/**
 * Creates a JSON Web Token using the provided payload and secret key.
 * @param {Object} params - An object containing the payload and secret key.
 * @param {any} params.payload - The payload to be included in the JWT token.
 * @param {string} [params.secretKey] - The secret key used to sign the JWT token.
 * @returns {string} - The created JSON Web Token.
 * @throws {Error} - If the secret key is not defined in environment variables.
 */

export const createJWT = ({payload}: {payload:any})=>{
    if (!secretKey) {
        throw new Error("JWT secret key is not defined in environment variables");
    }
    const token = Jwt.sign(payload,secretKey)
    return token;
}


/**
 * Verifies a JSON Web Token and returns the payload if the token is valid.
 * @param {string} token - The JSON Web Token to be verified.
 * @returns {Payload} - The payload of the verified JWT token.
 * @throws {Error} - If the token is invalid.
 */
export function isTokenValid(token: string): Payload {
  if (!secretKey) {
    throw new Error("JWT secret key is not defined in environment variables.");
  }
  try {
    const payload: Payload = Jwt.verify(token, secretKey) as Payload;
    return payload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}



export const attachCookiesToResponse = ({res, user, refreshToken}: {res: Response, user:any, refreshToken:string})=>{
    const acccessTokenJWT = createJWT({payload: {user}})
    const refreshTokenJWT = createJWT({payload: {user, refreshToken}})
    
    const oneDay = 1000 * 60 *60 *24;
    const longerEXP = 1000 *60 *60 *24 *30;

    res.cookie('accessToken', acccessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        expires: new Date(Date.now() + oneDay),
    })

    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        expires: new Date(Date.now() + longerEXP)
    })

}

