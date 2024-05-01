import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

/**
 * Represents a server instance that can listen on a specified port.
 */
interface Server {
  /**
   * Listens on the specified port and starts the server.
   *
   * @param port - The port number on which the server is listening.
   * @param callback - A function to be called when the server starts listening.
   */
  listen: (port: string | number, callback: () => void) => void;
}

const port = process.env.PORT || 7000;
/**
 * Connects to the MongoDB database and starts the server.
 *
 * @param server - The server instance to listen on the specified port.
 */
async function Dbconnection(server: Server): Promise<void> {
  if (process.env.MONGO_URL) {
    try {
      /**
       * Connects to the MongoDB database using the provided URL.
       *
       * @param url - The URL of the MongoDB database to connect to.
       */
      await mongoose.connect(process.env.MONGO_URL);

      /**
       * Starts the server and logs a message when it's listening on the specified port.
       *
       * @param port - The port number on which the server is listening.
       * @param callback - A function to be called when the server starts listening.
       */
      server.listen(port, function () {
        console.log(`db is connected & server is listening on ${port}🔥`);
      });
    } catch (error: Error | any) {
      /**
       * Logs an error message when there's an issue connecting to the MongoDB database.
       *
       * @param error - The error that occurred during the database connection.
       */
      console.error(`Mongo URL Error: ${error}`);
    }
  }
}

export default Dbconnection;
