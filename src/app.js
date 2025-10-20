const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const connectDb = require("./config/db");
const { validateEmail, validateData } = require("./utils/validator");
const { userAuth } = require("./auth/userMiddleware");
const { signAccessToken, signRefreshToken, saveRefreshToken, verifyRefreshToken, hashToken, revokeRefreshTokenByHash} = require("./utils/tokenService");
const User = require("./models/usermodel");
require("dotenv").config();
const app = express();

app.use(express.json()); 
app.use(cookieParser());


app.post("/signup", async (req, res) => {
  try {
    validateData(req);
    const { firstName, lastName, emailId, password, age, gender } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender,
    });

    const savedUser = await newUser.save();

    return res.status(200).json({
      message: "User Saved Successfully",
      user: savedUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error saving user",
      error: err.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const userEmail = req.body.emailId;

    validateEmail(userEmail);

    const req_user = await User.findOne({ emailId: userEmail });

    if (!req_user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { password } = req.body;

    const isPasswordValid = await req_user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { _id: req_user._id };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await saveRefreshToken(req_user._id, refreshToken);

    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    }); 

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Logged in" });

  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
});

app.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = await verifyRefreshToken(refreshToken);

    const newRefreshToken = signRefreshToken({ _id: decoded._id });
    const newAccessToken = signAccessToken({ _id: decoded._id });

    await saveRefreshToken(decoded._id, newRefreshToken);

    const oldHash = hashToken(refreshToken);
    const newHash = hashToken(newRefreshToken);

    await revokeRefreshTokenByHash(oldHash, newHash);

    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
    };

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Tokens refreshed" });
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ message: "Invalid refresh token", error: err.message });
  }

})

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile accessed successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
});

app.post("/logout", async (req, res) => {
  try {
    const {refreshToken} = req.cookies;

    if(refreshToken){
      await revokeRefreshTokenByHash(hashToken(refreshToken));
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.json({ message: "Logged out" });

  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Logout failed", error: err.message });
  }
})

const port = process.env.PORT || 3000;

connectDb()
  .then(() => {
    console.log("DataBase Connection establish");
    app.listen(port, () => {
      console.log("Server started on port "+port);
    });
  })
  .catch((err) => {
    console.log("DB connection error :- ", err);
  });
