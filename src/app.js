const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const connectDb = require("./config/db");
const { validateEmail, validateData } = require("./utils/validator");
const { generateToken, userAuth } = require("./auth/userMiddleware");
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
      throw new Error("Invalid Credentials");
    }

    const { password } = req.body;

    const isPasswordValid = await req_user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const { accessToken, refreshToken } = generateToken({ _id: req_user._id });

    res.cookie("token", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });


    return res.status(200).json({
      success: true,
      message: "User login successful",
      user: req_user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error finding user",
      error: err.message,
    });
  }
});

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