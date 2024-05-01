import { isTokenValid, attachCookiesToResponse } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";
import TokenSchema from "../models/TokenModel";
import { BadRequestError, UnAuthorized } from "../errors";

/**
 * Authenticates the user by checking the validity of the access token or refresh token.
 * If the access token is valid, it sets the user object in the request and returns.
 * If the refresh token is valid, it updates the refresh token in the database and sets the user object in the request.
 * If neither token is valid, it throws an UnAuthorized error.
 *
 * @param req - The Express request object containing the signed cookies.
 * @param res - The Express response object.
 * @param next - The Express next middleware function.
 * @returns void
 * @throws UnAuthorized - If authentication is invalid.
 */
export async function authenticated(req: Request | any, res: Response, next: NextFunction): Promise<void> {
    const { refreshToken, accessToken }: { refreshToken: string, accessToken: string } = req.signedCookies;

    try {
        if (accessToken) {
            const payload = isTokenValid(accessToken);
            req.user = payload.user;
            return next();
        }

        const payload = isTokenValid(refreshToken);

        const existingToken = await TokenSchema.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken,
        });

        if (!existingToken || !existingToken.$isValid) {
            throw new UnAuthorized('Authentication invalid');
        }

        attachCookiesToResponse({
            res,
            user: payload.user,
            refreshToken: existingToken.refreshToken,
        });
        req.user = payload.user;

    } catch (error) {
        throw new UnAuthorized("Authentication invalid");
    }
}