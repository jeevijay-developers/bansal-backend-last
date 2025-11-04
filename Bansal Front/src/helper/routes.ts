import { lazy } from "react";
const Home = lazy(() => import("../pages/home"));
const About = lazy(() => import("../pages/about"));
const BlogDetails = lazy(() => import("../pages/blog-details"));
const Blogs = lazy(() => import("../pages/blog-listing"));
const BookDetails = lazy(() => import("../pages/book-details"));
const BookListing = lazy(() => import("../pages/book-listing"));
const BookStore = lazy(() => import("../pages/book-store"));
const Checkout = lazy(() => import("../pages/checkout"));
const Contact = lazy(() => import("../pages/contact"));
const CourseDetailsPage = lazy(() => import("../pages/course-details"));
const CourseStudy = lazy(() => import("../pages/course-study"));
const CourseListingPage = lazy(() => import("../pages/courses"));
const Dashboard = lazy(() => import("../dashboard/dashboard"));
const myTestSeries = lazy(() => import("../dashboard/my-test-series"));
const myLiveTest = lazy(() => import("../dashboard/my-live-test"));
const myProfile = lazy(() => import("../dashboard/my-profile"));
const Notice = lazy(() => import("../pages/notice-collection"));
const CenterDetails = lazy(() => import("../pages/offline-center-details"));
const OfflineCenters = lazy(() => import("../pages/offline-center-listing"));
const Privacy = lazy(() => import("../pages/privacy-policy"));
const TermsAndCondition = lazy(() => import("../pages/term-condition"));
const TestLive = lazy(() => import("../pages/test-live"));
const TestResult = lazy(() => import("../pages/test-result"));
const TestReview = lazy(() => import("../pages/test-review"));
const TestStart = lazy(() => import("../pages/test-start"));
const TestStart2 = lazy(() => import("../pages/test-start2"));
const DashboardExamList = lazy(() => import("../dashboard/exam-list"));
const DashboardCourseExamList = lazy(
  () => import("../dashboard/course-exam-list")
);
const TestSeriesDetails = lazy(() => import("../pages/testseries-details"));
const LiveTestDetails = lazy(() => import("../pages/live-test-details"));
const TestSeriesListing = lazy(() => import("../pages/testseries-listing"));
const LiveTestListing = lazy(() => import("../pages/live-test-listing"));
const DashbaordExamIntro = lazy(() => import("../dashboard/exam-intro"));
const DashboardExam = lazy(() => import("../dashboard/exam-live"));
const DashboardExamResult = lazy(() => import("../dashboard/exam-result"));
const DashboardExamResultHistory = lazy(
  () => import("../dashboard/exam-review")
);
export const SITE_FOLDER = "front";
export const publicRoutes = [
  { path: "/", element: Home },
  { path: "/about", element: About },
  { path: "/contact", element: Contact },
  { path: "/blogs", element: Blogs },
  { path: "/blog/:id", element: BlogDetails },
  { path: "/courses", element: CourseListingPage },
  { path: "/course/:id", element: CourseDetailsPage },
  { path: "/test-series", element: TestSeriesListing },
  { path: "/live-test", element: LiveTestListing },
  { path: "/live-test/:id", element: LiveTestDetails },
  { path: "/test-series/:id", element: TestSeriesDetails },
  { path: "/book-store", element: BookStore },
  { path: "/books", element: BookListing },
  { path: "/book/details", element: BookDetails },
  { path: "/centers", element: OfflineCenters },
  { path: "/centers/:id", element: CenterDetails },
  { path: "/terms-and-conditions", element: TermsAndCondition },
  { path: "/privacy-policy", element: Privacy },
  { path: "/notice-collection", element: Notice },
];
export const privateRoutes = [
  { path: `/home`, element: Home },
  { path: `/`, element: Home },
  { path: "/about", element: About },
  { path: "/contact", element: Contact },
  { path: "/blogs", element: Blogs },
  { path: "/blog/:id", element: BlogDetails },
  { path: "/courses", element: CourseListingPage },
  { path: "/course/:id", element: CourseDetailsPage },
  { path: "/test-series", element: TestSeriesListing },
  { path: "/live-test", element: LiveTestListing },
  { path: "/live-test/:id", element: LiveTestDetails },
  // {path: '/test-series', element: testSeries},
  { path: "/test-series/:id", element: TestSeriesDetails },
  { path: "/book-store", element: BookStore },
  { path: "/books", element: BookListing },
  { path: "/book/details", element: BookDetails },
  { path: "/checkout", element: Checkout },
  { path: "/dashboard", element: Dashboard },
  { path: "/study-materials", element: CourseStudy },
  // { path: '/tests', element: Tests },
  { path: "/test/start", element: TestStart },
  { path: "/test/start2", element: TestStart2 },
  { path: "/test/live", element: TestLive },
  { path: "/test/result", element: TestResult },
  { path: "/test/review", element: TestReview },
  // { path: '/centers', element: Centers },
  { path: "/centers", element: OfflineCenters },
  { path: "/center/:id", element: CenterDetails },
  { path: "/terms-conditions", element: TermsAndCondition },
  { path: "/privacy-policy", element: Privacy },
  { path: "/notice-collection", element: Notice },

  { path: "/dashboard/my-test-series", element: myTestSeries },
    { path: "/dashboard/my-live-test", element: myLiveTest },
  { path: "/dashboard/my-profile", element: myProfile },
  { path: "/dashboard/exams/:id", element: DashboardExamList },
  { path: "/dashboard/course/exams/:id", element: DashboardCourseExamList },
  { path: "/dashboard/exam-intro/:id", element: DashbaordExamIntro },
  { path: "/dashboard/exam-live/:id", element: DashboardExam },
  { path: "/dashboard/exam-result/:id", element: DashboardExamResult },
  {
    path: "/dashboard/exam-result-history/:id",
    element: DashboardExamResultHistory,
  },
];
