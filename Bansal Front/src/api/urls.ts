// export const BASE_URL = "https://rodistaa.com/ibvijayin-admin/api/auth/";
// export const IMAGE_URL = "https://rodistaa.com/ibvijayin-admin/public";
// new url update

const BASE_DOMAIN = "http://localhost:3003";
//const BASE_DOMAIN =  "https://project.bansalcalssadmin.aamoditsolutions.com";

// export const BASE_URL = "const BASE_DOMAIN =/api/v1/";
// export const IMAGE_URL = "const BASE_DOMAIN =/admin/public/";
// export const NO_IMAGE_URLL = "const BASE_DOMAIN =/public/no_image.jpg";
// // export const IMAGE_URL = "https://project.bansalcalssadmin.aamoditsolutions.com/public";
// export const WEB_URL = "const BASE_DOMAIN =/api/v1/";
// export const MAIN_URL = "const BASE_DOMAIN =";

// const local = "https://project.bansalcalssadmin.aamoditsolutions.com";

export const BASE_URL = `${BASE_DOMAIN}/api/v1/`;
export const IMAGE_URL = `${BASE_DOMAIN}/admin/public/`;
export const NO_IMAGE_URLL = `${BASE_DOMAIN}/public/no_image.jpg`;
export const WEB_URL = BASE_URL;
export const MAIN_URL = `${BASE_DOMAIN}/`;

//export const RAZOR_API_KEY =  "rzp_test_s6bO2hGbSwG2Nc";
// export const RAZOR_API_KEY = "rzp_test_Ql00vist0zmjZS";

export const RAZOR_API_KEY = "rzp_live_x3idBzuRAkpem1";


export const APIPATH = {
  login: "send-otp",
  verifyOTP: "verify-otp",
  testSeriesList: "test-series-list",
  testSeriesDetail: "test-series-details",
  courses: "course-list",
  blogList: "blog-list",
  blogDetails: "blog-details",
  courseDetails: "course-details",
  home: "home-api",
  getCategory: "category-list",
  getOfflineCenter: "center-list",
  getCenterDetails: "center-details",
  getClassesList: "class-list",
  signup: "register",
  cms: "get-cms",
  about: "about-us",
  logout: "logout",
  applyCouponApi: "apply-coupon",
  couponList: "coupon-list",
  buyCourse: "buy-course",
  
  buyLiveTest: "buy-live-test",
  createRazorPay: "create-order",
  myOrder: "my-order",
  myCourse: "my-course",
  myTestSeries: "my-test-series",
  myProfile: "my-profile",
  updateProfile: "update-profile",
  studyMaterial: "study-material",
  examListApi: "exam-list",
  courseExamListApi: "course-exam-list",
  examDetailsApi: "exam-details",
  getTestQuestion: "get-question",
  submitLiveTest: "submit-live-test",
  submitFinalLiveTest: "submit-final-live-test",
  liveTestResult: "live-test-result",
  examAttempHistory: "exam-attemp-history",
  testSeriesWithCategoryList: "test-series-list-with-category",
  liveTestList: "live-test-list",
  liveTestDetails: "live-test-details",
  myLiveTest: "my-live-test",
};
