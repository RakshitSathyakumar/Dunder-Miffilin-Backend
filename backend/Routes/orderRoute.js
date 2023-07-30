const express = require("express");
const {
  newOrder,
  myOrders,
  getSingleOrder,
  deleteSingleOrder,
  getAllOrders,
  updateOrderDetails,
} = require("../controllers/orderControoller");
const { isAuthUser, authRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(isAuthUser, newOrder);
router.route("/order/me").get(isAuthUser, myOrders);

router.route("/admin/orders").get(isAuthUser, authRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .get(isAuthUser, authRoles("admin"), getSingleOrder)
  .delete(isAuthUser, authRoles("admin"), deleteSingleOrder)
  .put(isAuthUser,authRoles('admin'),updateOrderDetails);

module.exports = router;
