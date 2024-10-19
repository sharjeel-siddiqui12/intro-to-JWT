# Introduction to JWT

This project gives an overview of implementation of JSON Web Tokens (JWT) for authentication and the use of Context API for state management in a React application.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [JWT Authentication](#jwt-authentication)
- [Context API](#context-api)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication using JWT
- State management using Context API
- Secure routes based on user authentication
- Simple and clean UI

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/intro-to-JWT.git
    ```
2. Navigate to the project directory:
    ```bash
    cd intro-to-JWT
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Usage
1. Start the development server:
    ```bash
    npm run dev
    ```
2. Start the react application:
    ```bash
    npm run dev
    ```
3. Open your browser and navigate to `http://localhost:5173`.

## JWT Authentication
JSON Web Tokens (JWT) are used to securely transmit information between the client and the server. In this project, JWT is used for user authentication. Upon successful login, a token is generated and sent to the client. This token is then stored in local storage and included in the headers of subsequent requests to access protected routes.

### Key Points:
- **Token Generation**: The server generates a JWT upon successful login.
- **Token Storage**: The client stores the JWT in local storage.
- **Token Validation**: The server validates the JWT on each request to protected routes.

## Context API
The Context API is used for state management in this project. It allows us to share state across the entire application without having to pass props down manually at every level.

### Key Points:
- **Global State**: The Context API provides a way to create global state that can be accessed by any component.
- **Provider Component**: A provider component is used to wrap the part of the application that needs access to the global state.
- **Consumer Component**: Any component that needs access to the global state can use the `useContext` hook to consume the context.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License
This project is licensed under the MIT License.
