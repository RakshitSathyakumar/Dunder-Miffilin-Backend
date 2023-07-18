const express = require("express");
const productModel = require("../models/productSchema");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const errorHandler = require("../utils/errorHandler");
const userModel = require('../models/userSchema');
const { compare } = require("bcryptjs");
const getJWTDetails = require("../utils/getJWT");

exports.registerUser = asyncErrorHandler(async(req,res,next)=>{
    const {name,email,password} = req.body;

    const userData = await userModel.create({
        name,
        email,
        password,
        avtar:{
            public_id:"This is for sample",
            url:"This is for sample"
        }
    });
    // token = userData.getJWTToken();
    // res.status(201).json({
    //     success:true,
    //     userData,
    //     token
    // })
    getJWTDetails(userData,201,res);
        
});

exports.loginUser = asyncErrorHandler(async(req,res,next)=>{
    const {email,password} = req.body;

    // No email or No Password
    if(!email || !password){
        return next(new errorHandler("Enter both email and Password",400));
    }
    //
    const emailUser = await userModel.findOne({email}).select("+password");
    
    if(!emailUser){
        return next(new errorHandler("Email or Password is wrong",401));
    }
    // console.log(emailUser);

    const comaprePasscode = await emailUser.comparePassword(password);
    console.log(comaprePasscode);
    if(!comaprePasscode){
        return next(new errorHandler("Email or Password is wrong",401));
    }

    // token = emailUser.getJWTToken();
    // res.status(201).json({
    //     success:true,
    //     emailUser,
    //     token
    // })
    getJWTDetails(emailUser,201,res);


});
