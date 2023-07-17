const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');
const router = express.Router();

//get Route :-

router.route("/products").get(getAllProducts);

//post
router.route("/product/new").post(createProduct);

//Update delete
router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails)



module.exports = router