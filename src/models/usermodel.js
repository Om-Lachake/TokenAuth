const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 0,
  },
  photoUrl: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    required: true,
  },
});

// 👇 pre-save hook to assign photo URL based on gender
userSchema.pre("save", function (next) {
  if (!this.photoUrl || this.photoUrl.trim() === "") {
    if (this.gender === "male") {
      this.photoUrl =
        "https://freepngimg.com/download/icon/thoughts/2570-default-profile-picture-grey-male.png";
    } else if (this.gender === "female") {
      this.photoUrl =
        "https://static.vecteezy.com/system/resources/previews/042/332/066/original/person-photo-placeholder-woman-default-avatar-profile-icon-grey-photo-placeholder-female-no-photo-images-for-unfilled-user-profile-greyscale-illustration-for-social-media-free-vector.jpg";
    } else {
      this.photoUrl =
        "https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg";
    }
  }
  next();
});

userSchema.methods.validatePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
