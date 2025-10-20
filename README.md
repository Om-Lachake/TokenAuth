# 🛡️ Token-Based Authentication (Express + MongoDB)

Project Description

TokenAuth is a secure authentication system built with Express.js, MongoDB, and JWT that implements user registration, login, profile access, and token-based authentication. It leverages modern security practices such as:

Password hashing using bcrypt

Access tokens for short-lived API authentication

Refresh tokens for session continuity and token rotation

Token revocation and logout to prevent reuse of stolen tokens

Secure cookie storage with HttpOnly and SameSite flags

This project demonstrates a robust backend authentication workflow, including refresh token rotation, JWT verification, and session management, making it a solid foundation for building secure web applications.

---

## 🚀 Features

- 🔐 **User Registration** — creates a new user with hashed password  
- 🔑 **User Login** — validates credentials and generates JWT token  
- 🍪 **HTTP-Only Cookie Storage** — stores tokens securely in cookies  
- 👤 **Protected Profile Route** — accessible only with valid token  
- 🧱 **Auth Middleware** — verifies JWT and protects endpoints  
- 🔑 **User Logout** — On logout, the refresh token hash is removed from the user’s record, effectively invalidating the session. 
- 🔁 **Token Rotation** — On each refresh, a new refresh token is issued — this prevents token reuse (mitigates replay attacks).
- 🔒 **Hashed Refresh Tokens** - Refresh tokens are hashed before being stored in the database, similar to how passwords are hashed with bcrypt.

