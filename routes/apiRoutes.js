const express = require("express");
const multer = require("multer");
const { setupStorage } = require("../storage");
const authenticateCustomer = require("../middlewares/authenticateCustomer");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();
const ApiController = require("../controllers/Api/v1/ApiController");
const MobileApiController = require("../controllers/Api/v1/MobileApiController");
const AuthApiController = require("../controllers/Api/v1/AuthApiController");

router.post("/send-otp", AuthApiController.sendOtp);
router.post("/verify-otp", AuthApiController.verifyOtp);

// router.post("/user-delete-send-otp", AuthApiController.userDeleteSendOtp);
router.post("/user-delete-verify-otp", AuthApiController.userDeleteVerifyOtp);
router.post("/register", AuthApiController.register);

router.post("/get-cms", ApiController.getCms);

router.post("/category-list", ApiController.categoryList);
router.post("/class-list", ApiController.courseClassList);
router.post("/center-list", ApiController.centerList);
router.post("/center-details", ApiController.centerDetails);
router.post("/center-details-by-slug", ApiController.centerDetailsBySlug);
router.post("/home-api", ApiController.homeApi);
router.post("/course-list", ApiController.courseList);
router.post("/course-list-app", ApiController.courseListForApp);
router.post("/course-details", ApiController.courseDetails);
router.post("/blog-list", ApiController.blogList);
router.post("/blog-details", ApiController.blogDetails);
router.post("/about-us", ApiController.aboutUs);
router.post("/contact-data", ApiController.contactData);
router.post("/coupon-list", authenticateCustomer, ApiController.couponList);
router.post("/apply-coupon", authenticateCustomer, ApiController.applyCoupon);
router.post("/create-order", ApiController.createOrder);
router.post(
  "/create-cashfree-order",
  authenticateCustomer,
  ApiController.createCashFreeOrder
);
router.post(
  "/create-test-series-cashfree-order",
  authenticateCustomer,
  ApiController.createTestSeriesCashFreeOrder
);
router.post(
  "/verify-cashfree-order",
  authenticateCustomer,
  ApiController.verifyCashFreeOrder
);
router.post(
  "/buy-cartItems-cashFree",
  authenticateCustomer,
  ApiController.buyCartItemsCashFree
);
router.post(
  "/verify-cart-cashfree-order",
  authenticateCustomer,
  ApiController.verifyCartCashFreeOrder
);

router.post(
  "/buy-cartItems-cashFree1",
  authenticateCustomer,
  ApiController.buyCartItemsCashFree1
);
router.post(
  "/verify-cart-cashfree-order1",
  authenticateCustomer,
  ApiController.verifyCartCashFreeOrder1
);

router.post(
  "/app/address-list",
  authenticateCustomer,
  MobileApiController.addressList
);
router.post(
  "/app/add-address",
  authenticateCustomer,
  MobileApiController.addAddress
);
router.post(
  "/app/delete-address",
  authenticateCustomer,
  MobileApiController.deleteAddress
);
router.post(
  "/app/set-default-address",
  authenticateCustomer,
  MobileApiController.setDefaultAddress
);

router.post("/app/delete-reasons", authenticateCustomer, MobileApiController.deleteReasons);
router.post("/app/delete-account", authenticateCustomer, MobileApiController.deleteAccount);

router.post("/app/create-mobile-cashfree-order", authenticateCustomer, MobileApiController.createMobileCashFreeOrder);
router.post("/app/save-checkout-order", authenticateCustomer, MobileApiController.saveCheckoutOrder);

router.post("/app/course-details", authenticateCustomer, MobileApiController.appCourseDetails);
router.post("/app/fcm_token_update", authenticateCustomer, MobileApiController.fcmTokenUpdate);
router.post("/app/test-series-list-app", authenticateCustomer, MobileApiController.testSeriesListApp);

router.post("/app/book-listing", authenticateCustomer, MobileApiController.bookListingApp);


router.post(
  "/app/send-push-notification",
  authenticateCustomer,
  MobileApiController.sendPushNotificationToUser
);


router.post(
  "/app/is-notification-read",
  authenticateCustomer,
  MobileApiController.isReadNotification
);

router.post(
  "/app/unread-notification-count",
  authenticateCustomer,
  MobileApiController.unReadNotificationCount
);

router.post(
  "/app/delete-notification-by-user",
  authenticateCustomer,
  MobileApiController.deleteNotificationByUser
);


router.get(
"/app/course-order-invoice",
  authenticateCustomer,
  MobileApiController.downloadCourseOrderInvoice
);

router.post(
  "/app/test-series-details",
  authenticateCustomer,
  MobileApiController.testSeriesDetails
);

router.post(
  "/create-test-order",
  authenticateCustomer,
  ApiController.createTestOrder
);
router.post("/buy-course", authenticateCustomer, ApiController.buyCourse);
router.post(
  "/buy-cart-items",
  authenticateCustomer,
  ApiController.buyCartItems
);
router.post("/buy-live-test", authenticateCustomer, ApiController.buyLiveTest);
router.post("/test-series-list", ApiController.testSeriesList);

router.post(
  "/test-series-list-with-category",
  ApiController.testSeriesWithCategoryList
);
router.post("/test-series-details", ApiController.testSeriesDetails);

router.post("/live-test-list", ApiController.liveTestListing);
router.post("/live-test-details", ApiController.liveTestDetails);

router.post("/profile", authenticateCustomer, (req, res) => {
  // If middleware assigns req.user:
  res.json({ userId: req.user.id, name: req.user.name });

  // If middleware assigns req.customer:
  // res.json({ userId: req.customer.id, name: req.customer.name });
});

const FileUploadPath = `public/uploads/users/`;
const storage = setupStorage(FileUploadPath);
const upload = multer({ storage });

router.post("/my-course", authenticateCustomer, ApiController.myCourse);

router.post(
  "/app/my-course",
  authenticateCustomer,
  MobileApiController.myCourseApi
);
router.post(
  "/app/course-subjects",
  authenticateCustomer,
  MobileApiController.courseSubjects
);

router.post(
  "/app/subject-chapters",
  authenticateCustomer,
  MobileApiController.subjectChapters
);

router.post(
  "/app/subject-study-material",
  authenticateCustomer,
  MobileApiController.subjectStudyMaterial
);

router.post(
  "/app/chapter-study-material",
  authenticateCustomer,
  MobileApiController.chapterStudyMaterial
);
router.post(
  "/app/course-exam-list",
  authenticateCustomer,
  MobileApiController.courseExamList
);

router.post(
  "/app/test-series-exam-list",
  authenticateCustomer,
  MobileApiController.testSeriesExamList
);

router.post(
  "/app/books-list",
  authenticateCustomer,
  MobileApiController.booksListByCategory
);

router.post(
  "/app/course-list",
  authenticateCustomer,
  MobileApiController.courseListing
);

router.post(
  "/app/get-exam-question",
  authenticateCustomer,
  MobileApiController.getExamQuestion
);

router.post(
  "/app/submit-exam",
  authenticateCustomer,
  MobileApiController.submitExam
);

router.post(
  "/app/live-test-result",
  authenticateCustomer,
  MobileApiController.liveTestResult
);

router.post(
  "/my-test-series",
  authenticateCustomer,
  ApiController.myTestSeries
);
router.post("/my-profile", authenticateCustomer, ApiController.myProfile);
router.post("/my-live-test", authenticateCustomer, ApiController.myLiveTest);
router.post("/my-books", authenticateCustomer, ApiController.myBooks);
router.post(
  "/update-profile",
  authenticateCustomer,
  ApiController.updateProfile
);
router.post(
  "/update-profile-image",
  upload.single("profile_pic"),
  authenticateCustomer,
  ApiController.updateProfileImage
);
router.post("/my-order", authenticateCustomer, ApiController.myOrder);
router.post(
  "/study-material",
  authenticateCustomer,
  ApiController.getStudyMaterialsBySubject
);
router.post(
  "/chapter-study-material",
  authenticateCustomer,
  ApiController.chapterStudyMaterial
);

router.post("/exam-list", authenticateCustomer, ApiController.examList);
router.post(
  "/course-exam-list",
  authenticateCustomer,
  ApiController.courseExamList
);
router.post(
  "/app/course-exam-list1",
  authenticateCustomer,
  MobileApiController.courseExamList1
);
router.post("/exam-details", authenticateCustomer, ApiController.examDetails);
router.post("/get-question", authenticateCustomer, ApiController.getQuestion);
router.post(
  "/get-question-subjects",
  authenticateCustomer,
  ApiController.getQuestionSubjects
);
router.post("/get-question1", authenticateCustomer, ApiController.getQuestion1);
router.post(
  "/submit-live-test",
  authenticateCustomer,
  ApiController.submitLiveTest
);
router.post(
  "/submit-final-live-test",
  authenticateCustomer,
  ApiController.submitFinalLiveTest
);
router.post(
  "/live-test-result",
  authenticateCustomer,
  ApiController.liveTestResult
);

router.post(
  "/exam-attemp-history",
  authenticateCustomer,
  ApiController.examAttemptHistory
);
// router.post('/exam-analysis', authenticateCustomer, ApiController.ExamAnalysis )
router.post(
  "/notification-list",
  authenticateCustomer,
  ApiController.NotificationList
);
router.post(
  "/test-question-list",
  authenticateCustomer,
  ApiController.testQuestionList
);

router.post("/add-to-cart", authenticateCustomer, ApiController.addToCart);

router.post(
  "/remove-cart-item",
  authenticateCustomer,
  ApiController.removeCartItem
);
router.post("/cart-list", authenticateCustomer, ApiController.cartList);
router.post(
  "/save-faculty-training-request",
  ApiController.SaveFacultyTrainingRequest
);

router.post("/save-boot-program", ApiController.SaveBoostProgram);
router.post(
  "/update-boost-payment-status",
  ApiController.UpdateBoostPaymentStatus
);


router.post("/save-boot-program-cashfree", ApiController.SaveBoostProgramCashFree);
router.post("/verify-boost-program-cashfree", ApiController.VerifyBoostProgramCashFree); 

router.post("/save-academic-career", ApiController.saveAcademicSeniorCareer);

router.post("/save-bftp-career", ApiController.saveBftpCareer);
router.post(
  "/get-faculty-training-program",
  ApiController.getFacultyTrainingProgram
);
router.post(
  "/faculty-training-program-details",
  ApiController.getFacultyTrainingProgramDetails
);
router.post("/save-center-form-request", ApiController.SaveCenterRequest);
router.post("/save-contact-enquiry", ApiController.saveContactEnquiry);

router.post("/book-listing", ApiController.bookListing);
router.post("/book-details", ApiController.bookDetails);

router.post(
  "/apply-cart-coupon",
  authenticateCustomer,
  ApiController.applyCartCoupon
);
router.post("/get-faq", ApiController.getFaq);
router.post("/get-states", ApiController.getStates);
router.post("/get-cities", ApiController.getCities);

router.post("/get-photo-gallery", ApiController.getPhotoGallery);
router.post("/get-video-gallery", ApiController.getVideoGallery);

router.post("/get-achievement-list", ApiController.getAchievementList);

router.post("/boost-program-details", ApiController.boostProgramDetails);
router.post("/get-bftp-date", ApiController.getBFTPDate);

// router.post('/test-question-list', authenticateCustomer, ApiController.testQuestionList )

// router.get('/home_api', ApiController.home_api);
// router.get('/menu', ApiController.menu);
// router.get('/place', ApiController.place);
// router.get('/restaurant', ApiController.restaurant);
// router.get('/menu-detail', ApiController.menuDetail);

// router.post('/uddate-profile', authenticateCustomer, ApiController.updateProfile);

module.exports = router;
