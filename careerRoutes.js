const express = require("express");
const router = express.Router();
const { setupStorage } = require("../storage");
const multer = require("multer");
const adminauthenticateCustomer = require("../middlewares/adminauthenticateCustomer");

const FileUploadPath = "public/uploads/career/";
const storage = setupStorage(FileUploadPath);
const upload = multer({ storage });

const controller = require("../controllers/Admin/CareerController");
const ProgramController = require("../controllers/Admin/ProgramController");
const route = "career"; 


router.get(`/admin/${route}-list/:type?`, adminauthenticateCustomer, controller.List);


router.get(`/admin/${route}-create`, adminauthenticateCustomer, controller.Create);


router.get(`/admin/${route}-edit/:postId`, adminauthenticateCustomer, controller.Edit);


router.post(
  `/admin/${route}-update/:postId?`,
  adminauthenticateCustomer,
  upload.fields([{ name: "image", maxCount: 1 }]),
  controller.Update
);


router.get(`/admin/${route}-delete/:postId`, adminauthenticateCustomer, controller.Delete);


router.get(`/admin/${route}-restore/:postId`, adminauthenticateCustomer, controller.Restore);


router.get(
  `/admin/${route}-permanent-delete/:postId`,
  adminauthenticateCustomer,
  controller.PermanentDelete
);


router.get("/admin/program-list", adminauthenticateCustomer,  ProgramController.programList);
router.get("/admin/program-create", adminauthenticateCustomer,  ProgramController.Create);
router.get("/admin/program-edit/:postId", adminauthenticateCustomer,  ProgramController.Edit);
router.post(
  `/admin/program-update/:postId?`,
  adminauthenticateCustomer,
    upload.fields([{ name: "image", maxCount: 1 }]),
  ProgramController.Update
);
router.post("/admin/program-delete/:postId", adminauthenticateCustomer, ProgramController.Delete);
router.get(`/admin/${route}-show/:postId`, adminauthenticateCustomer, controller.Show);

router.get("/admin/career-request-list", adminauthenticateCustomer,  controller.careerRequestList);
router.get("/admin/career-request-details/:id", adminauthenticateCustomer,  controller.careerRequestDetails);


router.get("/admin/bftp-request-list", adminauthenticateCustomer,  controller.bftpRequestList);
router.get("/admin/bftp-request-details/:id", adminauthenticateCustomer,  controller.bftpRequestDetails);
module.exports = router;
