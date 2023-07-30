const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  reviewByUsers,
  getAllReviews,
  deleteProductReviews,
} = require("../controllers/productController");
const { isAuthUser, authRoles } = require("../middleware/auth");
const { getAllUserDetails } = require("../controllers/userController");
const router = express.Router();

//get Route :-

router.route("/products").get(getAllProducts);

//post
router
  .route("/admin/product/new")
  .post(isAuthUser, authRoles("admin"), createProduct);

//Update delete
router
  .route("/admin/product/:id")
  .put(isAuthUser, authRoles("admin"), updateProduct)
  .delete(isAuthUser, authRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthUser, reviewByUsers);

router
  .route("/reviews")
  .get(getAllReviews)
  .delete(isAuthUser, deleteProductReviews);

module.exports = router;
