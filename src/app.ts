import express, { Express, Request, Response,NextFunction } from "express";
import AuthRouter from "../routes/auth/AuthRoutes";
import Dbconnection from "../database/dbConnection";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
config()

/**
 * Initializes the Express application.
 * @param none
 * @returns Express application instance.
 */
const app: Express = express();

/**
 * Sets the origins allowed to send requests to the Express application.
 * @param none
 * @returns none
 */
const origin = ["http://localhost:3001", "http://localhost:3000"];

/**
 * Configures CORS settings for the Express application.
 * @param none
 * @returns none
 */
app.use(cors({ origin: origin , credentials: true, methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"] }));



/**
 * Parses cookies for the Express application.
 * @param none
 * @returns none
 */
app.use(cookieParser(process.env.JWT_SECRET_KEY));

/**
 * Parses JSON data for the Express application.
 * @param none
 * @returns none
 */
app.use(express.json());

/**
 * Mounts the AuthRouter to the specified path.
 * @param none
 * @returns none
 */
app.use("/client/api/auth", AuthRouter);

/**
 * Connects the Express application to the database.
 * @param app Express application instance.
 * @returns none
 */
Dbconnection(app);


/**
 * Exports the Express application instance.
 * @param none
 * @returns Express application instance.
 */
export default app;