# Store Builder App Backend

## Overview

Store Builder App is a backend application designed to support a store building platform similar to Shopify. The backend provides APIs for user registration and login, creating a unique directory for each user upon signup, and handling authentication with JWT tokens. The project is built using Node.js, Express.js, and MySQL.

## Features

- **User Registration**: Sign up new users and create a unique directory for each user.
- **User Login**: Authenticate users and provide a JWT token for authorization.
- **File Management**: Unzip a pre-existing file into the user's directory upon signup.

## Project Structure

The project is organized into the following structure:

```
store-builder-backend/
│
│
├── users/
│   ├── user_site_name/
│   └── ...
│
│
├── .env
├── .gitignore
├── package.json
├── app.http
├── README.md
├── index.js
├── wordpress.zip
└── ...
```

## Getting Started

### Prerequisites

- Node.js (>= v20.13.1)
- npm (>= 10.5.2)
- MySQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zishanverse/store-builder-backend.git
   cd store-builder-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following environment variables:
   ```
    PORT=4000
    MYSQLDATABASE=database_name
    MYSQLHOST=host_name
    MYSQLPASSWORD=password
    MYSQLPORT=port_no
    MYSQLUSER=user_name
   ```

### Running the App

To start the development server, run:
```bash
npm start
```

The server will start on [http://localhost:4000](http://localhost:4000).

## API Endpoints

### User Authentication

- **User Signup**
  - **Endpoint**: `POST /api/signup`
  - **Description**: Registers a new user, creates a unique directory, and unzips the template file into it.
  - **Request Body**: `{ "email_phone": "string", "password": "string", "created_at": "date", "site_name": "string", "category": "string"}`
  - **Response**: `{ "email_phone": "string", "password": "string", "created_at": "date", "site_name": "string", "category": "string"}`

- **User Login**
  - **Endpoint**: `POST /login/`
  - **Description**: Authenticates a user and returns a JWT token and user data.
  - **Request Body**: `{ "username": "string", "password": "string" }`
  - **Response**: `{ "jwtToken": "string", "user": { "email_phone": "string", "password": "string", "created_at": "date", "site_name": "string", "category": "string"} } }`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to reach out if you have any questions or need further assistance.

Happy coding!
