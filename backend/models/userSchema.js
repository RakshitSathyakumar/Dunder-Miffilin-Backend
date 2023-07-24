const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: true,
    maxLen: [100, "Max Length exceeded"],
    minLen: [3, "Min len Required"],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, "Pls enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLen: [8, "enter a min size of 8"],
  },
  avtar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },

  resetPassword: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

// userSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.resetPasswordToken = function () {
  const resetPassToken = crypto.randomBytes(20).toString("hex");
  this.resetPassword = crypto
    .createHash("sha256")
    .update(resetPassToken)
    .digest("Hex");
  // hashed string milega
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetPassToken;
};

module.exports = mongoose.model("user", userSchema);
