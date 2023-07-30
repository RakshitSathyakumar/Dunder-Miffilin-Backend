const express = require("express");
const {
  registerUser,
  loginUser,
  logOut,
  forgetPassword,
  resetUserPassword,
  getUserDeatails,
  updateUserPassword,
  updateUserProfile,
  getAllUserDetails,
  detailsSingleUser,
  updateSingleUserProfile,
  deleteSingleUser,
  getOnlyUserDetails,
  getOnlyAdminDetails,
} = require("../controllers/userController");
const { isAuthUser, authRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetUserPassword);

router.route("/me").get(isAuthUser, getUserDeatails);
router.route("/me/update-password").post(isAuthUser, updateUserPassword);
router.route("/me/update-profile").put(isAuthUser, updateUserProfile);

router.route("/login").post(loginUser);
router.route("/logout").get(logOut);

router
  .route("/admin/users")
  .get(isAuthUser, authRoles("admin"), getAllUserDetails);

router
  .route("/admin/get/users")
  .get(isAuthUser, authRoles("admin"), getOnlyUserDetails);
router
  .route("/admin/get/admin")
  .get(isAuthUser, authRoles("admin"), getOnlyAdminDetails);

router
  .route("/admin/users/:id")
  .get(isAuthUser, authRoles("admin"), detailsSingleUser)
  .put(isAuthUser, authRoles("admin"), updateSingleUserProfile)
  .delete(isAuthUser, authRoles("admin"), deleteSingleUser);

module.exports = router;
