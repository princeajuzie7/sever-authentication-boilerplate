# Server Authentication Boilerplate

This is an advanced server authentication boilerplate created by Prince Ajuzie. It provides a robust authentication system with features like account creation, login, logout, password recovery, password updating, and email verification. The boilerplate is built using Express.js, MongoDB, TypeScript for type safety, Nodemailer for email handling, and JWT for token generation.

## Getting Started

To use this boilerplate, follow these steps:

### Prerequisites

Ensure you have Node.js and npm installed on your system.

### Installation

Clone this repository and navigate into the project directory.

```bash
git clone https://github.com/princeajuzie7/sever-authentication-boilerplate
cd sever-authentication-boilerplate
```

Install dependencies using `pnpm`.

```bash
pnpm i
```

### Environment Configuration

Create a `.env` file in the root directory and add the following configuration variables:

```dotenv
PORT=          # The server port
CLIENT_URL=    # The URL of the client application
MONGO_URL=     # MongoDB connection URL
MAILING_USER=  # Email address for sending mails
MAILING_PASSWORD=  # Password for the mailing user
JWT_SECRET_KEY=   # Secret key for JWT token generation
```

### Build

Build the project using the following command:

```bash
pnpm run build
```

### Usage

Start the server using:

```bash
pnpm start
```

## Features

- **Account Creation:** Users can create new accounts securely.
- **Login:** Registered users can log in with their credentials.
- **Logout:** Users can log out of their accounts.
- **Password Recovery:** Users can recover their passwords through email verification.
- **Password Update:** Users can update their passwords securely.
- **Email Verification:** Email addresses are verified during account creation and password recovery processes.

## Technologies Used

- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB:** A NoSQL database for storing user information securely.
- **TypeScript:** A superset of JavaScript that adds static typing and other features.
- **Nodemailer:** Module for sending emails from Node.js applications.
- **JWT (JSON Web Tokens):** Standard method for representing claims securely between two parties.

## Author

This boilerplate was created by Prince Ajuzie.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the creators and maintainers of the libraries and frameworks used in this project.

Feel free to contribute to this boilerplate by submitting pull requests or reporting issues!