const express = require("express");
const productModel = require("../models/productSchema");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const errorHandler = require("../utils/errorHandler");
const userModel = require("../models/userSchema");
const { compare } = require("bcryptjs");
const getJWTDetails = require("../utils/getJWT");
const sendEMail = require("../utils/sendEMail");
const crypto = require("crypto");
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const userData = await userModel.create({
    name,
    email,
    password,
    role,
    avtar: {
      public_id: "This is for sample",
      url: "This is for sample",
    },
  });
  // token = userData.getJWTToken();
  // res.status(201).json({
  //     success:true,
  //     userData,
  //     token
  // })
  getJWTDetails(userData, 201, res);
});

exports.loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  // No email or No Password
  if (!email || !password) {
    return next(new errorHandler("Enter both email and Password", 400));
  }
  //
  const emailUser = await userModel.findOne({ email }).select("+password");

  if (!emailUser) {
    return next(new errorHandler("Email or Password is wrong", 401));
  }
  // console.log(emailUser);

  const comaprePasscode = await emailUser.comparePassword(password);
  console.log(comaprePasscode);
  if (!comaprePasscode) {
    return next(new errorHandler("Email or Password is wrong", 401));
  }

  // token = emailUser.getJWTToken();
  // res.status(201).json({
  //     success:true,
  //     emailUser,
  //     token
  // })
  // console.log(req.cookies);
  getJWTDetails(emailUser, 201, res);
});

exports.logOut = asyncErrorHandler(async function (req, res, next) {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: "true",
    logout: "True",
  });
});
// forget passowrd
exports.forgetPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new errorHandler("The user doesnt exists", 404));
  }

  const resetToken = user.resetPasswordToken();
  // console.log(resetToken);

  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  // console.log(resetPasswordURL);
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;

  const message = `Click on the link to reset the password \n\n ${resetPasswordUrl} \n\n If  not requested please ignore this mail`;

  try {
    await sendEMail({
      email: user.email,
      subject: "Dunder Mithilin Password Recovery",
      message,
    });
    // console.log("yes");
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (err) {
    user.resetPassword = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new errorHandler(err, 500));
  }
});

// Reset password Controller
exports.resetUserPassword = asyncErrorHandler(async (req, res, next) => {
  const resetUserPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    resetPassword: resetUserPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  // console.log(user);
  if (!user) {
    return next(
      errorHandler("The token is expired/user not Found pls try again", 400)
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(errorHandler("The password entered is doesnt match", 400));
  }

  user.password = req.body.password;
  user.resetPassword = undefined;
  user.resetPasswordExpire = undefined;
  // console.log(user);

  await user.save();

  getJWTDetails(user, 200, res);
});

exports.getUserDeatails = asyncErrorHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  console.log(user);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUserPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");
  // console.log(user);
  const isMatchedPassword = await user.comparePassword(req.body.oldPassword);

  if (!isMatchedPassword) {
    return next(new errorHandler("The entered password doesn't match", 400));
  }

  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  // console.log(newPassword);
  if (newPassword !== confirmPassword) {
    return next(new errorHandler("The password dosent match", 401));
  }

  if (newPassword === req.body.oldPassword) {
    return next(
      new errorHandler("New Password cannot be same as previous ones", 400)
    );
  }
  user.password = newPassword;
  await user.save();

  getJWTDetails(user, 200, res);
});

// Update user
exports.updateUserProfile = asyncErrorHandler(async (req, res, next) => {
  // const user = await userModel.findById(req.user.id);

  const updatedUserData = {
    name: req.body.name,
    email: req.body.email,
    role:req.body.role
  };
  const user = await userModel.findByIdAndUpdate(req.user.id, updatedUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    success:true,
    user
  });
});
// get all users -- admin route
exports.getAllUserDetails = asyncErrorHandler(async(req,res,next)=>{
  const users = await userModel.find();
  const userCount =  await userModel.countDocuments();
  // console.log(userCount);
  res.status(400).json({
    success:true,
    userCount,
    users
  });
});

// get all users not admins -- admin route
exports.getOnlyUserDetails = asyncErrorHandler(async(req,res,next)=>{
  const users = await userModel.find({"role":"user"});
  const userCount =  await userModel.countDocuments({"role":"user"});
  // console.log(userCount);
  res.status(400).json({
    success:true,
    userCount,
    users
  });
});

// get all admins -- admin route
exports.getOnlyAdminDetails = asyncErrorHandler(async(req,res,next)=>{
  const users = await userModel.find({"role":"admin"});
  const userCount =  await userModel.countDocuments({"role":"admin"});
  // console.log(userCount);
  res.status(400).json({
    success:true,
    userCount,
    users
  });
});

// delete one Single User

exports.detailsSingleUser = asyncErrorHandler(async(req,res,next)=>{
  const user = await userModel.findById(req.params.id);
  res.status(400).json({
    success:true,
    user
  });
});

exports.updateSingleUserProfile = asyncErrorHandler(async(req,res,next)=>{
  const updatedUserData = {
    name: req.body.name,
    email: req.body.email,
    role:req.body.role
  };

  const user = await userModel.findByIdAndUpdate(req.user.id, updatedUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    success:true,
    user
  });

});

exports.deleteSingleUser = asyncErrorHandler(async(req,res,next)=>{
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});