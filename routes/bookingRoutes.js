const express = require("express");
const router = express.Router();
const { setupStorage } = require("../storage");
const multer = require("multer");
const adminauthenticateCustomer = require("../middlewares/adminauthenticateCustomer");

const controller = require("../controllers/Admin/BookingController");

// List
router.get(
  "/admin/course-bookings",
  adminauthenticateCustomer,
  controller.CourseBooking
);

// Create form
router.get("/admin/test-series-booking-list", adminauthenticateCustomer, controller.TestSeriesBooking);

router.get("/admin/live-test-booking-list", adminauthenticateCustomer, controller.LiveTestBooking);
router.get(
  "/admin/booking-details/:bookingId",
  adminauthenticateCustomer,
  controller.bookingDetails
);

router.get("/admin/faculty-training-request-list", adminauthenticateCustomer,  controller.facultyTrainingRequestList);
router.get("/admin/boost-program-requests",adminauthenticateCustomer,  controller.boostProgramRequestList);
router.get("/admin/boost-program-requests/export",adminauthenticateCustomer,  controller.boostProgramRequestListExport);
router.get('/admin/boost-program-request-details/:id', adminauthenticateCustomer,  controller.boostProgramRequestDetails);

module.exports = router;
