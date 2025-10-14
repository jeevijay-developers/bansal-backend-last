const express = require("express");
const router = express.Router();
const { setupStorage } = require("../storage");
const multer = require("multer");
const adminauthenticateCustomer = require("../middlewares/adminauthenticateCustomer");

const FileUploadPath = "public/uploads/users/";
const storage = setupStorage(FileUploadPath);
const upload = multer({ storage });

const controller = require("../controllers/Admin/userController");

// List
router.get(
  "/admin/user-list",
  adminauthenticateCustomer,
  controller.List
);

// Create form
router.get(
  "/admin/user-create",
  adminauthenticateCustomer,
  controller.Create
);

// Edit form
router.get(
  "/admin/user-edit/:postId",
  adminauthenticateCustomer,
  controller.Edit
);

// Update or Create post
router.post(
  "/admin/user-update/:postId?",
  adminauthenticateCustomer,
  upload.fields([{ name: "profile_image", maxCount: 1 }]),
  controller.Update
);

// Soft Delete
router.get(
  "/admin/user-delete/:postId",
  adminauthenticateCustomer,
  controller.Delete
);

// Restore (undo soft delete)
router.get(
  "/admin/user-restore/:postId",
  adminauthenticateCustomer,
  controller.Restore
);

// Permanent Delete (hard delete)
router.get(
  "/admin/user-permanent-delete/:postId",
  adminauthenticateCustomer,
  controller.PermanentDelete
);

// Show details
router.get(
  "/admin/user-show/:postId",
  adminauthenticateCustomer,
  controller.Show
);

module.exports = router;
