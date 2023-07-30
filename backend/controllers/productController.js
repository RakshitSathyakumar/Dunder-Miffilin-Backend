const express = require("express");
const productModel = require("../models/productSchema");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const errorHandler = require("../utils/errorHandler");
const APIFeatures = require("../utils/apiFeature");
// Creating Product -- Admin (C)
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  req.body.user = req.user.id;
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
// Reviews:-

exports.reviewByUsers = asyncErrorHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await productModel.findById(productId);
  // const isReviewed = product.reviews.find(
  //   (rev) => rev.user.toString() === req.user._id.toString()
  // );
  // console.log(product)
  let isReviewed = 0;
  for (let i = 0; i < product.reviews.length; i++) {
    let token =
      JSON.stringify(product.reviews[i].user) === JSON.stringify(req.user._id);
    if (token === true) {
      isReviewed = 1;
      break;
    }
  }
  // console.log(isReviewed);/

  if (isReviewed === 1) {
    product.reviews.forEach((rev) => {
      let token = JSON.stringify(rev.user) === JSON.stringify(req.user._id);
      if (token === true) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    review,
  });
});

// get all reviews of a single product

exports.getAllReviews = asyncErrorHandler(async (req, res, next) => {
  const productToFind = await productModel.findById(req.query.id);
  if (!productToFind) {
    return next(new errorHandler("The product doesn't exists", 404));
  }

  const allReviews = productToFind.reviews;

  res.status(200).json({
    success: true,
    allReviews,
  });
});

// delete reviews of a user
exports.deleteProductReviews = asyncErrorHandler(async (req, res, next) => {
  const productToFind = await productModel.findById(req.query.productId);
  if (!productToFind) {
    return next(new errorHandler("The product doesn't exists", 404));
  }

  const reviews = productToFind.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await productModel.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews,
  });

  res.status(200).json({
    success: true,
  });
});
