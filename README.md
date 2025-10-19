# 🛡️ Token-Based Authentication (Express + MongoDB)

This project implements a basic **JWT authentication system** using **Express**, **MongoDB (Mongoose)**, and **bcrypt** for password hashing.  
It demonstrates how to securely register users, log them in, protect routes using middleware, and access a profile endpoint only after authentication.

---

## 🚀 Features

- 🔐 **User Registration** — creates a new user with hashed password  
- 🔑 **User Login** — validates credentials and generates JWT token  
- 🍪 **HTTP-Only Cookie Storage** — stores tokens securely in cookies  
- 👤 **Protected Profile Route** — accessible only with valid token  
- 🧱 **Auth Middleware** — verifies JWT and protects endpoints  

---

## 🚀 Future Features

- 🔑 **User Logout** — On logout, the refresh token hash is removed from the user’s record, effectively invalidating the session. 
- 🔁 **Token Rotation** — On each refresh, a new refresh token is issued — this prevents token reuse (mitigates replay attacks).
- 🔒 **Hashed Refresh Tokens** - Refresh tokens are hashed before being stored in the database, similar to how passwords are hashed with bcrypt.

---

## 🧰 Tech Stack

| Tool | Purpose |
|------|----------|
| **Node.js / Express.js** | Server framework |
| **MongoDB / Mongoose** | Database + ORM |
| **bcryptjs** | Password hashing |
| **jsonwebtoken (JWT)** | Token generation & verification |
| **cookie-parser** | Accessing cookies from requests |
| **dotenv** | Managing environment variables |
