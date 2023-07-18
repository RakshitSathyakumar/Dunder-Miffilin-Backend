const express = require("express");
const productModel = require("../models/productSchema");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const errorHandler = require("../utils/errorHandler");
const APIFeatures = require("../utils/apiFeature");
// Creating Product -- Admin (C)
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await productModel.create(req.body);

  res.status(201).json({
    message: "Successful",
    product,
  });
});

// to get all products (R)l
exports.getAllProducts = asyncErrorHandler(async (req, res) => {
  // console.log(apiFeature);
  const resultPerPage = 10000;
  const productCount = await productModel.countDocuments();
  const apiFeature = new APIFeatures(productModel.find(), req.query)
    .search()
    .sortBy()
    .pagination(resultPerPage);
  const product = await apiFeature.query;
  res.status(200).json({
    sucees: true,
    productCount,
    product,
  });
});

// Updating Prodcut --Admin (U)

exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);
  // console.log(product);
  if (!product) {
    return next(new errorHandler("Product not found", 500));
  }

  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    message: "done",
    product,
  });
});

// Delete --Admin
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await productModel.findByIdAndRemove(req.params.id);
  // if (!product) {
  //   return res.status(404).json({
  //     message: "Not Found",
  //   });
  // }

  if (!product) {
    return next(new errorHandler("Product not found", 500));
  }

  res.status(200).json({
    message: "Deleted",
  });
});

//product details
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  // if (!product) {
  //   return res.status(404).json({
  //     message: "Not Found",
  //   });
  // }
  if (!product) {
    return next(new errorHandler("Product not found", 500));
  }
  res.status(200).json({
    data: "found",
    product,
  });
});
