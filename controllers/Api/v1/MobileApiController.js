// Dependencies
const pool = require("../../../db/database");
const randomstring = require("randomstring");
const { sendSuccess, sendError } = require("../../../helpers/Helper");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const momenttimezone = require("moment-timezone");
const dayjs = require("dayjs");
const PDFDocument = require("pdfkit");
const Joi = require("joi");
const axios = require("axios");
const path = require("path");
const Helper = require("../../../helpers/Helper");
const MobileHelper = require("../../../helpers/MobileHelper");
const Razorpay = require("razorpay"); // Import Razorpay
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
 const admin = require('./../../../config/firebase');
dayjs.extend(utc);
dayjs.extend(timezone);
const ejs = require("ejs");
const pdf = require("html-pdf");
const IST_TIMEZONE = "Asia/Kolkata";
// Initialize Razorpay instance
const CASHFREE_LIVE_APP_ID = "10356909a15b25e64545bbe77dc0965301";
const CASHFREE_LIVE_SECRET_KEY =
  "cfsk_ma_prod_02dd88d4a4979a6ea8e2fe3365e546a0_6779a2cd";
const CASHFREE_LIVE_API_URL = "https://api.cashfree.com/pg/orders";
const {
  BASE_URL,
  PUBLIC_PATH,
  NO_IMAGE_URL,
} = require("../../../config/constants");
const {
  fetchMenus,
  fetchMenuDetail,
  fetchBanners,
  fetchRestaurants,
  fetchPlaces,
  fetchOfferBanners,
  fetchTestimonial,
  fetchInstaVideo,
} = require("../../Admin/CommonController");
const { console } = require("inspector");

// Controller
const MobileApiController = {
  /**
   * Home API
   * Fetches categories, courses, servicable cities, testimonials, FAQs, and banners.
   */

  test: async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Test",
    });
  },

    testSeriesListApp: async (req, res) => {
    try {

      const filters = {
      category_id: req.body.category_id || null,
      price_range: req.body.price_range || null,
      course_type: req.body.course_type || null,
    };

      userId = req.user.id;
      const testSeries = await MobileHelper.getActiveTestSeries(filters,userId);

      if (testSeries.length === 0) {
        return Helper.sendSuccess(res, "No test series available.", []);
      }

      return Helper.sendSuccess(
        res,
        "Test series fetched successfully.",
        testSeries
      );
    } catch (error) {
      console.error("Error fetching test series:", error);
      return Helper.sendError(res, "Internal server error", error);
    }
  },

//   bookListingApp: async (req, res) => {
//   try {
//     const userId = req.user?.id || 0; // assuming user info is available from middleware
//     const { category_id, class_id, price_range } = req.body;

//     // Base query
//     let query = `
//       SELECT * FROM books 
//       WHERE status = 1 AND deleted_at IS NULL
//     `;

//     const queryParams = [];

//     // Apply filters
//     if (category_id) {
//       query += " AND category_id = ?";
//       queryParams.push(category_id);
//     }

//     if (class_id) {
//       query += " AND class_id = ?";
//       queryParams.push(class_id);
//     }

//     // Sorting
//     if (price_range === "low-to-high") {
//       query += " ORDER BY offer_price ASC";
//     } else if (price_range === "high-to-low") {
//       query += " ORDER BY offer_price DESC";
//     } else {
//       query += " ORDER BY book_name ASC";
//     }

//     // Run query
//     const [books] = await pool.promise().query(query, queryParams);

//     // If user is logged in, check which books are in the cart
//     let cartBookIds = [];
//     if (userId) {
//       const [cartItems] = await pool.promise().query(
//         `
//           SELECT item_id FROM carts 
//           WHERE user_id = ? AND item_type = 'book'
//         `,
//         [userId]
//       );
//       cartBookIds = cartItems.map((item) => item.item_id);
//     }

//     // Add is_cart = 1/0 to each book
//     const booksWithCartStatus = books.map((book) => ({
//       ...book,
//       is_cart: cartBookIds.includes(book.id) ? 1 : 0,
//     }));

//     return res.status(200).json({
//       success: true,
//       message: "Books fetched successfully",
//       data: booksWithCartStatus,
//     });
//   } catch (error) {
//     console.error("Book Listing Error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch books",
//       error: error.message,
//     });
//   }
// },

// bookListingApp: async (req, res) => {
//   try {
//     const userId = req.user?.id || 0; // get user ID from middleware
//     const { category_id, class_id, price_range } = req.body;

//     // Base query
//    let query = `
//   SELECT * 
//   FROM books 
//   WHERE status = 1 
//     AND deleted_at IS NULL 
//   ORDER BY book_name ASC
// `;
//     const queryParams = [];

//     // Apply filters
//     if (category_id) {
//       query += " AND category_id = ?";
//       queryParams.push(category_id);
//     }
//     if (class_id) {
//       query += " AND class_id = ?";
//       queryParams.push(class_id);
//     }

//     // Sorting
//     if (price_range === "low-to-high") {
//       query += " ORDER BY offer_price ASC";
//     } else if (price_range === "high-to-low") {
//       query += " ORDER BY offer_price DESC";
//     } else {
//       query += " ORDER BY book_name ASC";
//     }

//     // Fetch books
//     const [books] = await pool.promise().query(query, queryParams);

//     // Fetch cart items if user logged in
//     let cartBookIds = [];
//     let cartCount = 0;
//     if (userId) {
//       const [cartItems] = await pool.promise().query(
//         `SELECT item_id FROM carts WHERE user_id = ? AND item_type = 'book'`,
//         [userId]
//       );
//       cartBookIds = cartItems.map((item) => item.item_id);
//       cartCount = cartItems.length; // total cart items count
//     }

//     // Add is_cart flag to each book
//     const booksWithCartStatus = books.map((book) => ({
//       ...book,
//       is_cart: cartBookIds.includes(book.id) ? 1 : 0,
//     }));

//     return res.status(200).json({
//       success: true,
//       message: "Books fetched successfully",
//       cart_count: cartCount, // total cart items
//       data: booksWithCartStatus,
//     });
//   } catch (error) {
//     console.error("Book Listing Error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch books",
//       error: error.message,
//     });
//   }
// },

bookListingApp: async (req, res) => {
  try {
    const userId = req.user?.id || 0;
    const { category_id, class_id, price_range } = req.body;

    // Base query
    let query = `
      SELECT * 
      FROM books 
      WHERE status = 1 
        AND deleted_at IS NULL
    `;
    const queryParams = [];

    // Filters
    if (category_id) {
      query += " AND category_id = ?";
      queryParams.push(category_id);
    }
    if (class_id) {
      query += " AND class_id = ?";
      queryParams.push(class_id);
    }

    // Sorting
    if (price_range === "low-to-high") {
      query += " ORDER BY offer_price ASC";
    } else if (price_range === "high-to-low") {
      query += " ORDER BY offer_price DESC";
    } else {
      query += " ORDER BY book_name ASC";
    }

    // Fetch books
    const [books] = await pool.promise().query(query, queryParams);

    // Fetch cart items if user logged in
    let cartBookIds = [];
    let cartCount = 0;
    if (userId) {
      const [cartItems] = await pool.promise().query(
        `SELECT item_id FROM carts WHERE user_id = ? AND item_type = 'book'`,
        [userId]
      );
      cartBookIds = cartItems.map((item) => item.item_id);
      cartCount = cartItems.length;
    }

    // Mark books already in cart
    const booksWithCartStatus = books.map((book) => ({
      ...book,
      is_cart: cartBookIds.includes(book.id) ? 1 : 0,
    }));

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      cart_count: cartCount,
      data: booksWithCartStatus,
    });
  } catch (error) {
    console.error("Book Listing Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message,
    });
  }
},

 courseListing: async (req, res) => {
  try {
    const filters = {
      category_id: req.body.category_id || null,
      course_type: req.body.course_type || null,
      course_class_id: req.body.course_class_id || null,
      price_range: req.body.price_range || null,
    };
    const userId = req.user.id;
    const courses = await MobileHelper.getActiveCourseListing(
      [
        "id",
        "course_name",
        "category_id",
        "title_heading",
        "slug",
        "course_type",
        "mode_of_class",
        "course_class_id",
        "discount_type",
        "discount",
        "price",
        "offer_price",
        "image",
      ],
      filters,
      userId,
    );

    res.status(200).json({
      success: true,
      message: "Course List",
      base_url: BASE_URL,
      public_path: PUBLIC_PATH,
      path: req.originalUrl,
      NO_IMAGE_URL: NO_IMAGE_URL,
      data: courses,
    });
  } catch (error) {
    console.error("Error in courseList:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
},

  myCourseApi: async (req, res) => {
    const userId = req.session.userId || req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
    }

    try {
      // Fetch orders with course and category info
const [orders] = await pool.promise().query(
  `
  SELECT 
    co.*, 
    c.course_name, 
    c.image AS course_image,
    c.id AS course_id,
    c.deleted_at, 
    cat.category_name
  FROM course_orders co
  JOIN courses c ON co.course_id = c.id
  LEFT JOIN categories cat ON c.category_id = cat.id
  WHERE co.user_id = ? 
    AND co.order_type = "course"
    AND co.payment_status IN ('complete', 'completed')
    AND c.status = 1
    AND c.deleted_at IS NULL
  ORDER BY co.created_at DESC
  `,
  [userId]
);


      const baseImageUrl = `${req.protocol}://${req.get("host")}/admin/public`;

      const formatDate = (date) =>
        date
          ? new Date(date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : null;

      const courseIds = orders.map((o) => o.course_id);

      // Subjects

      const [subjects] = await pool.promise().query(`
        SELECT * FROM course_subjects 
        WHERE status = 1 AND deleted_at IS NULL
      `);

      // Live Tests

      const [liveTests] = courseIds.length
        ? await pool.promise().query(
            `
          SELECT * FROM live_test 
          WHERE status = 1 
          AND deleted_at IS NULL 
           AND test_location = 'course'
          AND course_id IN (?)
          `,
            [courseIds]
          )
        : [[]];

      // Format orders
const filteredOrders = orders.filter((order) => {
  const isDeleted = order.deleted_at !== null;
  const isExpired =
    order.course_expired_date &&
    new Date(order.course_expired_date) < new Date();

  return !isDeleted && !isExpired; // only keep valid orders
});
      const formattedOrders = filteredOrders.map((order) => {
        const imageUrl = order.course_image
          ? `${baseImageUrl}${order.course_image
              .replace(/\\/g, "/")
              .replace(/^\/?uploads/, "/uploads")}`
          : null;

        const subjectCount = subjects.filter(
          (s) => s.course_id == order.course_id
        ).length;
        const liveTestCount = liveTests.filter(
          (t) => t.course_id == order.course_id
        ).length;

         const isDeleted = !!order.deleted_at;

  const isExpired =
    order.course_expired_date &&
    new Date(order.course_expired_date) < new Date();


        return {
          ...order,
          course_image: imageUrl,
          subjects_course: subjectCount,
          live_test_count: liveTestCount,
          purchase_date: formatDate(order.created_at),
          expired_date: formatDate(order.course_expired_date),
            isDeleted,
        isExpired,
        };
      });

      return res.json({
        success: true,
        message: "My Course ordersss",
        orders: formattedOrders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching orders.",
      });
    }
  },

  courseSubjects: async (req, res) => {
    try {
      const { course_id } = req.body;
      const subjects = await MobileHelper.getActiveSubjectByCourseId(course_id);

      res.json({
        status: true,
        message: "Subjects fetched successfully",
        data: subjects,
      });
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  },


  subjectChapters: async (req, res) => {
    try {
      const { subject_id } = req.body;
      const subjects = await MobileHelper.getActiveChaptersBySubjectId(subject_id);

      res.json({
        status: true,
        message: "Chapters fetched successfully",
        data: subjects,
      });
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  },

  
  subjectStudyMaterial: async (req, res) => {
    try {
      const { subject_id } = req.body;

      if (!subject_id) {
        return res.status(400).json({
          status: false,
          message: "subject_id is required",
        });
      }

      const videoCount = await MobileHelper.getActiveVideoCountBySubjectId(
        subject_id
      );

      const videoResult = await MobileHelper.getActiveVideoBySubjectId(
        subject_id
      );
      const pdfResult = await MobileHelper.getActivePdfBySubjectId(subject_id);
      const pdfCount = await MobileHelper.getPdfCountBySubjectId(subject_id);
      const liveClassCount = await MobileHelper.getLiveClassCountBySubjectId(
        subject_id
      );

      const total = videoCount + pdfCount + liveTestCount + liveClassCount;

      res.json({
        status: true,
        message: "Study material fetched successfully",
        data: {
          subject_id,
          videoCount,
          pdfCount,
          
          liveClassCount,
          total,
          videoList: videoResult,
          pdfList: pdfResult,
        },
      });
    } catch (error) {
      console.error("❌ Error fetching study materials:", {
        message: error.message,
        stack: error.stack,
      });

      res.status(500).json({
        status: false,
        message: "Internal server error",
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
    }
  },

  
  
  chapterStudyMaterial: async (req, res) => {
    try {
      const { chapter_id } = req.body;
      console.log(req.body);
      if (!chapter_id) {
        return res.status(400).json({
          status: false,
          message: "chapter_id is required",
        });
      }

      const videoCount = await MobileHelper.getActiveVideoCountByChapterId(
        chapter_id
      );

      const videoResult = await MobileHelper.getActiveVideoByChapterId(
        chapter_id
      );
      const pdfResult = await MobileHelper.getActivePdfByChapterId(chapter_id);
      const pdfCount = await MobileHelper.getPdfCountByChapterId(chapter_id);
  
      const liveClassCount = await MobileHelper.getLiveClassCountByChapterId(
        chapter_id
      );

      const total = videoCount + pdfCount +  liveClassCount;

      res.json({
        status: true,
        message: "Study material fetched successfully",
        data: {
          chapter_id,
          videoCount,
          pdfCount,
          liveClassCount,
          total,
          videoList: videoResult,
          pdfList: pdfResult,
        },
      });
    } catch (error) {
      console.error("❌ Error fetching study materials:", {
        message: error.message,
        stack: error.stack,
      });

      res.status(500).json({
        status: false,
        message: "Internal server error",
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
    }
  },
  courseExamList: async (req, res) => {
  const { course_id } = req.body;
  const user_id = req.user.id;

  try {
    const [course] = await pool
      .promise()
      .query(`SELECT id, course_name FROM courses WHERE id = ?`, [course_id]);

    if (course.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const testSeriesDetails = { ...course[0] };

    const [exams] = await pool.promise().query(
      `SELECT id, course_id, test_name, test_type, marks, duration_test, start_date_time, end_date_time, result_date 
       FROM live_test 
       WHERE status = 1 AND test_location = 'course' AND deleted_at IS NULL AND course_id = ?`,
      [course_id]
    );

    const examIds = exams.map((exam) => exam.id);

    let questionCounts = {};
    if (examIds.length > 0) {
      const [questionCountRows] = await pool.promise().query(
        `SELECT test_id, COUNT(*) as no_of_questions 
         FROM live_test_questions 
         WHERE test_id IN (?) 
         GROUP BY test_id`,
        [examIds]
      );

      questionCounts = questionCountRows.reduce((acc, row) => {
        acc[row.test_id] = row.no_of_questions;
        return acc;
      }, {});
    }

    const [attemptedRows] = await pool
      .promise()
      .query(`SELECT test_id FROM live_test_result WHERE frontuser_id = ?`, [
        user_id,
      ]);

    const attemptedTestIds = new Set(attemptedRows.map((row) => row.test_id));

    // Get current time in Asia/Kolkata
    const now = new Date();
    const currentTimeKolkata = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // Helper to format datetime with AM/PM
    const formatDateTime = (date) => {
      const pad = (n) => (n < 10 ? "0" + n : n);
      let hours = date.getHours();
      const minutes = pad(date.getMinutes());
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate()) +
        " " +
        pad(hours) +
        ":" +
        minutes +
        " " +
        ampm
      );
    };

    const formattedExams = exams.map((exam) => {
      const startTime = new Date(exam.start_date_time);
      const endTime = new Date(exam.end_date_time);
      const resultTime = exam.result_date ? new Date(exam.result_date) : null;

      return {
        ...exam,
        start_date_time: formatDateTime(startTime),
        end_date_time: formatDateTime(endTime),
        result_date: exam.result_date ? formatDateTime(resultTime) : null,
        no_of_question: questionCounts[exam.id] || 0,
        is_start: currentTimeKolkata >= startTime && currentTimeKolkata <= endTime,
        is_completed: currentTimeKolkata > endTime,
        is_expired: currentTimeKolkata > endTime,
        is_result: resultTime ? currentTimeKolkata >= resultTime : false,
        is_attempted: attemptedTestIds.has(exam.id),
        is_open: currentTimeKolkata >= startTime && currentTimeKolkata <= endTime,
        is_close: currentTimeKolkata > endTime,
      };
    });

    const attemptedExams = formattedExams.filter((exam) => exam.is_attempted);
    const nonAttemptedExams = formattedExams.filter(
      (exam) => !exam.is_attempted
    );

    return res.json({
      success: true,
      message: "Exams list fetched successfully",
      current_time: formatDateTime(currentTimeKolkata),
      data: testSeriesDetails,
      attemptedExams,
      nonAttemptedExams,
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching exams",
    });
  }
},


deleteNotificationByUser: async (req, res) => {
  try {
    const userId = req.user?.id; // From authenticateCustomer
    const { notification_id } = req.body;

    if (!notification_id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    const [result] = await pool.promise().query(
      `DELETE FROM notifications WHERE id = ? AND user_id = ?`,
      [notification_id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or not owned by user",
      });
    }

    return res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
},

downloadCourseOrderInvoice: async (req, res) => {
  try {
    const userId = req.user?.id;
    const order_id = req.body.order_id || "ORD-V9HVR0J5";

    // Fetch order with course details
    const [orderResult] = await pool.promise().query(
      `SELECT co.id, co.order_id, co.total_amount, co.created_at,
              c.course_name as course_name, c.price, u.name as customer_name, u.email
       FROM course_orders co
       JOIN courses c ON co.course_id = c.id
       JOIN front_users u ON co.user_id = u.id
       WHERE co.order_id = ?`,
      [order_id, userId]
    );

    if (orderResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        order_id:order_id,
        user_id:userId
      });
    }

    const order = orderResult[0];
    const ejsPath = path.join(__dirname, "../../../views/invoice/order-invoice.ejs");

    // Render EJS template as promise
    const html = await new Promise((resolve, reject) => {
      ejs.renderFile(ejsPath, { order }, (err, str) => {
        if (err) {
          const errorWithStack = new Error("EJS Render Failed");
          errorWithStack.original = err;
          errorWithStack.stack = err.stack;
          return reject(errorWithStack);
        }
        resolve(str);
      });
    });

    const options = { format: "A4", border: "10mm" };

    // Generate PDF as promise
    const pdfBuffer = await new Promise((resolve, reject) => {
      pdf.create(html, options).toBuffer((err, buffer) => {
        if (err) {
          const errorWithStack = new Error("PDF Generation Failed");
          errorWithStack.original = err;
          errorWithStack.stack = err.stack;
          return reject(errorWithStack);
        }
        resolve(buffer);
      });
    });

    // ✅ Set headers and return PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.order_id}.pdf`);
    return res.send(pdfBuffer);

  } catch (error) {
    console.error("Invoice Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to generate invoice",
        stack: error.stack,
        original: error.original || null,
      });
    }
  }
},


  testSeriesExamList: async (req, res) => {
  const { test_series_id } = req.body;
  const user_id = req.user.id;

  try {
    // 1️⃣ Fetch course/test series details
    const [courseRows] = await pool
      .promise()
      .query(`SELECT id, name FROM test_series WHERE id = ?`, [test_series_id]);

    if (courseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Test Series not found",
      });
    }

    const testSeriesDetails = { ...courseRows[0] };

    // 2️⃣ Fetch exams for this course
    const [exams] = await pool.promise().query(
      `SELECT id, course_id, test_name, test_type, marks, duration_test, start_date_time, end_date_time, result_date 
       FROM live_test 
       WHERE status = 1 AND test_location = 'test-series' AND deleted_at IS NULL AND test_series_id = ?`,
      [test_series_id]
    );

    const examIds = exams.map((exam) => exam.id);

    // 3️⃣ Get question counts for each exam
    let questionCounts = {};
    if (examIds.length > 0) {
      const placeholders = examIds.map(() => '?').join(',');
      const [questionCountRows] = await pool.promise().query(
        `SELECT test_id, COUNT(*) as no_of_questions 
         FROM live_test_questions 
         WHERE test_id IN (${placeholders}) 
         GROUP BY test_id`,
        examIds
      );

      questionCounts = questionCountRows.reduce((acc, row) => {
        acc[row.test_id] = row.no_of_questions;
        return acc;
      }, {});
    }

    // 4️⃣ Fetch attempted exams for this user
    const [attemptedRows] = await pool
      .promise()
      .query(`SELECT test_id FROM live_test_result WHERE frontuser_id = ?`, [
        user_id,
      ]);

    const attemptedTestIds = new Set(attemptedRows.map((row) => Number(row.test_id)));

    // 5️⃣ Current time in Asia/Kolkata
    const now = new Date();
    const currentTimeKolkata = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // 6️⃣ Helper function to format datetime
    const formatDateTime = (date) => {
      const pad = (n) => (n < 10 ? "0" + n : n);
      let hours = date.getHours();
      const minutes = pad(date.getMinutes());
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate()) +
        " " +
        pad(hours) +
        ":" +
        minutes +
        " " +
        ampm
      );
    };

    // 7️⃣ Format each exam
    const formattedExams = exams.map((exam) => {
      const startTime = new Date(exam.start_date_time);
      const endTime = new Date(exam.end_date_time);
      const resultTime = exam.result_date ? new Date(exam.result_date) : null;

      return {
        ...exam,
        start_date_time: formatDateTime(startTime),
        end_date_time: formatDateTime(endTime),
        result_date: exam.result_date ? formatDateTime(resultTime) : null,
        no_of_question: questionCounts[exam.id] || 0,
        is_start: currentTimeKolkata >= startTime && currentTimeKolkata <= endTime,
        is_completed: currentTimeKolkata > endTime,
        is_expired: currentTimeKolkata > endTime,
        is_result: resultTime ? currentTimeKolkata >= resultTime : false,
        is_attempted: attemptedTestIds.has(Number(exam.id)),
        is_open: currentTimeKolkata >= startTime && currentTimeKolkata <= endTime,
        is_close: currentTimeKolkata > endTime,
      };
    });

    // 8️⃣ Separate attempted and non-attempted exams
    const attemptedExams = formattedExams.filter((exam) => exam.is_attempted);
    const nonAttemptedExams = formattedExams.filter(
      (exam) => !exam.is_attempted
    );

    // 9️⃣ Total exams list
    const totalExamsList = formattedExams;

    // 🔟 Send final response
    return res.json({
      success: true,
      message: "Exams list fetched successfully",
      current_time: formatDateTime(currentTimeKolkata),
      data: testSeriesDetails,
      totalExamsList,
      user_id,
      attemptedExams,
      nonAttemptedExams,
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching exams",
      error: error.message,
    });
  }
},



  booksListByCategory: async (req, res) => {
    try {
      const books = await MobileHelper.getBooksGroupedByCategory();
      return res.json({
        status: true,
        message: "Books List",
        data: books,
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      return res.status(500).json({
        status: false,
        message: "Server error while fetching books",
      });
    }
  },
  getExamQuestion: async (req, res) => {
  const { exam_id, question_id } = req.body;

  if (!exam_id) {
    return res.status(400).json({
      success: false,
      message: "exam_id is required",
    });
  }

  try {
    // 1. Fetch all questions for the test (ordered by id)
    const [questions] = await pool.promise().query(
      `SELECT id,subject, question_type, question  
       FROM live_test_questions 
       WHERE test_id = ? 
       ORDER BY id ASC`,
      [exam_id]
    );

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this test",
      });
    }

    // 2. Determine the current question
    let currentQuestion;
    if (question_id) {
      currentQuestion = questions.find((q) => q.id === parseInt(question_id));
      if (!currentQuestion) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }
    } else {
      // If no question_id provided, take the first question
      currentQuestion = questions[0];
    }

    // 3. Find index of current question
    const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id);

    // 4. Get previous and next question IDs (if available)
    const previousQuestionId =
      currentIndex > 0 ? questions[currentIndex - 1].id : null;
    const nextQuestionId =
      currentIndex < questions.length - 1
        ? questions[currentIndex + 1].id
        : null;

    // 5. Send response
    return res.json({
      success: true,
      message: "Question fetched successfully",
      question: currentQuestion,
      previous_question_id: previousQuestionId,
      next_question_id: nextQuestionId,
      total_questions: questions.length,
    });
  } catch (error) {
    console.error("Error fetching exam question:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching question",
       error: error.message, // Show the exact error message
    stack: error.stack    // (Optional) Show the error stack for debugging
    });
  }
},

submitExam: async (req, res) => {
  const user_id = req.user?.id;
  const { test_id, question_id, student_answer, spend_time, next_id, count } = req.body;

  try {
    // 1. Fetch current question
    const [questionRows] = await pool.promise().query(
      `SELECT id, test_id, subject, question_type, answer, correct_marks, incorrect_marks 
       FROM live_test_questions 
       WHERE id = ? LIMIT 1`,
      [question_id]
    );

    if (questionRows.length === 0) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const questionData = questionRows[0];
    const correct_answer = questionData.answer;
    const correct_marks = Number(questionData.correct_marks) || 0;
    const incorrect_marks = Number(questionData.incorrect_marks) || 0;
    const subject = questionData.subject || "";

    // 2. Determine correctness
    let is_correct = 0, is_wrong = 0, is_skipped = 0, marks = 0;
    if (student_answer) {
      is_skipped = 0;

      if (questionData.question_type === "multiple_choice") {
        is_correct = correct_answer.split(",").sort().join(",") === student_answer.split(",").sort().join(",") ? 1 : 0;
      } else if (questionData.question_type === "boolean") {
        is_correct = correct_answer.toLowerCase() === student_answer.toLowerCase() ? 1 : 0;
      } else {
        is_correct = correct_answer == student_answer ? 1 : 0;
      }
      is_wrong = is_correct === 0 ? 1 : 0;
    } else {
      is_skipped = 1;
    }

    marks = is_correct ? correct_marks : (is_wrong ? -incorrect_marks : 0);

    // 3. Manage temp results (INSERT or UPDATE)
    const [tempResults] = await pool.promise().query(
      `SELECT total_time FROM live_test_tmp 
       WHERE test_id = ? AND question_id = ? AND user_id = ? LIMIT 1`,
      [test_id, question_id, user_id]
    );

    const previousTime = tempResults[0]?.total_time || 0;
    const currentTime = isNaN(spend_time) ? 0 : spend_time;
    const timeDiff = Math.max(0, currentTime - previousTime);

    if (tempResults.length > 0) {
      await pool.promise().query(
        `UPDATE live_test_tmp 
         SET subject = ?, is_pending = 0, is_correct = ?, is_wrong = ?, question_type = ?, 
             student_answer = ?, is_skipped = ?, total_time = ?, spend_time = ?, marks = ?
         WHERE test_id = ? AND question_id = ? AND user_id = ?`,
        [
          subject,
          is_correct,
          is_wrong,
          questionData.question_type,
          student_answer || "",
          is_skipped,
          spend_time,
          timeDiff,
          marks,
          test_id,
          question_id,
          user_id,
        ]
      );
    } else {
      await pool.promise().query(
        `INSERT INTO live_test_tmp 
         (subject, is_pending, is_correct, is_wrong, question_type, user_id, test_id, question_id, student_answer, is_skipped, total_time, spend_time, marks)
         VALUES (?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          subject,
          is_correct,
          is_wrong,
          questionData.question_type,
          user_id,
          test_id,
          question_id,
          student_answer || "",
          is_skipped,
          spend_time,
          timeDiff,
          marks,
        ]
      );
    }

    // 4. Fetch live test & all questions
    const [[live_test]] = await pool.promise().query(`SELECT id,  test_name FROM live_test WHERE id = ? LIMIT 1`, [test_id]);

    const [allQuestions] = await pool.promise().query(
      `SELECT id FROM live_test_questions WHERE test_id = ? ORDER BY id ASC`,
      [test_id]
    );

    if (allQuestions.length === 0) {
      return res.status(404).json({ success: false, message: "No questions found for this test" });
    }

    const totalQuestions = allQuestions.length;
    const currentIndex = allQuestions.findIndex((q) => q.id === (next_id || question_id));

    const currentQuestionId = currentIndex >= 0 ? allQuestions[currentIndex].id : allQuestions[0].id;
    const prevQuestionId = currentIndex > 0 ? allQuestions[currentIndex - 1].id : null;
    const nextQuestionId = currentIndex < totalQuestions - 1 ? allQuestions[currentIndex + 1].id : null;

    // 5. Count answered questions
    const [[answeredResult]] = await pool.promise().query(
      `SELECT COUNT(*) AS answeredCount 
       FROM live_test_tmp 
       WHERE user_id = ? AND test_id = ? AND is_skipped = 0`,
      [user_id, test_id]
    );

    const answeredQuestion = answeredResult?.answeredCount || 0;
    const noanswerQuestions = totalQuestions - answeredQuestion;
    const all_attempted = answeredQuestion === totalQuestions ? 1 : 0;

    // 6. Return response
    return res.json({
      success: true,
      count: (count || 0) + 1,
      live_test,
      current_question_id: currentQuestionId,
      prev_question_id: prevQuestionId,
      next_question_id: nextQuestionId,
      question_sr_no: currentIndex + 1,
      total_questions: totalQuestions,
      answeredQuestion,
      noanswerQuestions,
      base_url: process.env.BASE_URL || "",
      all_attempted,
      is_last_question: currentIndex === totalQuestions - 1 ? 1 : 0,
      is_next: nextQuestionId ? 1 : 0,
      is_previous: prevQuestionId ? 1 : 0,
    });

  } catch (err) {
    console.error("submitExam error:", err.message, err.stack);
    return res.status(500).json({ success: false, message: "Server error while submitting exam", error: err.message });
  }
},
courseExamList1 : async (req, res) => {
  const { course_id } = req.body;
  const user_id = req.user.id;

  try {
    // 1. Fetch course details
    const [course] = await pool
      .promise()
      .query(`SELECT id, course_name FROM courses WHERE id = ?`, [course_id]);

    if (course.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const testSeriesDetails = { ...course[0] };

    // 2. Fetch exams for this course
    const [exams] = await pool.promise().query(
      `SELECT id, course_id, test_name, test_type, marks, test_pattern, test_location, 
              duration_test, start_date_time, end_date_time, result_date 
       FROM live_test 
       WHERE status = 1 AND test_location = 'course' AND deleted_at IS NULL AND course_id = ?`,
      [course_id]
    );

    const examIds = exams.map((exam) => exam.id);

    // 3. Fetch question counts
    let questionCounts = {};
    if (examIds.length > 0) {
      const [questionCountRows] = await pool.promise().query(
        `SELECT test_id, COUNT(*) as no_of_questions 
         FROM live_test_questions 
         WHERE test_id IN (?) 
         GROUP BY test_id`,
        [examIds]
      );

      questionCounts = questionCountRows.reduce((acc, row) => {
        acc[row.test_id] = row.no_of_questions;
        return acc;
      }, {});
    }

    // 4. Fetch attempted tests by user
    const [attemptedRows] = await pool
      .promise()
      .query(`SELECT test_id FROM live_test_result WHERE frontuser_id = ?`, [
        user_id,
      ]);

    const attemptedTestIds = new Set(attemptedRows.map((row) => row.test_id));

    // 5. Current IST time
    const now = dayjs().tz(IST_TIMEZONE);

    // 6. Format exams data
    const formattedExams = exams.map((exam) => {
      const startTime = dayjs(exam.start_date_time).tz(IST_TIMEZONE);
      const endTime = dayjs(exam.end_date_time).tz(IST_TIMEZONE);
      const resultTime = exam.result_date
        ? dayjs(exam.result_date).tz(IST_TIMEZONE)
        : null;

      return {
        ...exam,
        start_date_time: startTime.format("DD MMM YYYY, hh:mm A"),
        end_date_time: endTime.format("DD MMM YYYY, hh:mm A"),
        result_date: resultTime ? resultTime.format("DD MMM YYYY, hh:mm A") : null,
        no_of_question: questionCounts[exam.id] || 0,
        is_start: now.isAfter(startTime) && now.isBefore(endTime),
        is_completed: now.isAfter(endTime),
        is_expired: now.isAfter(endTime),
        is_result: resultTime ? now.isAfter(resultTime) : false,
        is_attempted: attemptedTestIds.has(exam.id),
        is_open: now.isAfter(startTime) && now.isBefore(endTime),
        is_close: now.isAfter(endTime),
        current_time: now.format("DD MMM YYYY, hh:mm A"),
      };
    });

    return res.json({
      success: true,
      message: "Test series details and exams fetched successfully",
      data: testSeriesDetails,
      exams: formattedExams,
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching exams",
    });
  }
},
liveTestResult: async (req, res) => {
  const userId = req.user.id;
  const testId = parseInt(req.body.test_id);
  const filterSubject = req.body.subject;

  if (!testId || isNaN(testId)) {
    return res.status(400).json({ success: false, message: "Invalid or missing test_id" });
  }

  try {
const [liveTests] = await pool.promise().query(
  `SELECT lt.id, lt.test_name, c.batch_type 
   FROM live_test lt 
   LEFT JOIN courses c ON lt.course_id = c.id 
   WHERE lt.id = ?`,
  [testId]
);

    const liveTest = liveTests[0];
    if (!liveTest) {
      return res.status(404).json({ success: false, message: "Live test not found" });
    }

    const isResultDeclared = moment(liveTest.result_date).isSameOrBefore(moment());

    let isDisplayHistory = liveTest.result_history_display_time &&
      moment(liveTest.result_history_display_time).isSameOrBefore(moment()) ? 1 : 0;

    const [resultDatas] = await pool.promise().query(
      `SELECT * FROM live_test_result WHERE test_id = ? AND frontuser_id = ? LIMIT 1`,
      [testId, userId]
    );

    const resultData = resultDatas[0] || null;

    // Subjective test check
    if (
      liveTest.batch_type === "online" &&
      liveTest.test_pattern === "subjective" &&
      liveTest.testtype === "Live"
    ) {
      if (!resultData?.subjective_result) isDisplayHistory = 0;
      else isDisplayHistory = 1;
    }

    let studentAnswerSheet = resultData?.student_document || "";
    let resultUploadedAnswerSheet = resultData?.subjective_result || "";

    const [results] = await pool.promise().query(
      `SELECT * FROM live_test_result_details WHERE test_id = ? AND frontuser_id = ?`,
      [testId, userId]
    );

    let correct = 0, incorrect = 0, skipped = 0;
    let correct_score = 0, wrong_score = 0;
    let timeTaken = 0, srNo = 1;
    let questionHistory = [];

    for (const result of results) {
      let status = "not_attempted";
      let correct_mark = 0;
      let incorrect_mark = 0;
      let marks = 0;

      if (result.is_skipped === 1) {
        skipped++;
        status = "skipped";
      } else if (result.is_correct === 1) {
        correct++;
        status = "correct";
      } else {
        incorrect++;
        status = "incorrect";
      }

      if (result.is_correct === 1 || result.is_wrong === 1) {
        const [markRows] = await pool.promise().query(
          `SELECT correct_marks, incorrect_marks FROM live_test_questions WHERE id = ? LIMIT 1`,
          [result.question_id]
        );
        if (markRows.length > 0) {
          correct_mark = markRows[0].correct_marks || 0;
          incorrect_mark = markRows[0].incorrect_marks || 0;
        }
      }

      const q_correct_score = result.is_correct * correct_mark;
      const q_wrong_score = result.is_wrong * incorrect_mark;
      marks = q_correct_score - q_wrong_score;

      correct_score += q_correct_score;
      wrong_score += q_wrong_score;
      timeTaken += result.time_taken || 0;

      questionHistory.push({
        sr_no: srNo++,
        question_id: result.question_id,
        status,
        is_correct: result.is_correct,
        is_wrong: result.is_wrong,
        is_skipped: result.is_skipped,
        correct_mark,
        incorrect_mark,
        marks,
        subject: result.subject || "Unknown"
      });
    }

    if (filterSubject) {
      questionHistory = questionHistory.filter(q => q.subject.toLowerCase() === filterSubject.toLowerCase());
    }

    const totalQuestions = questionHistory.length;
    const attempts = correct + incorrect;
    const totalScore = correct_score - wrong_score;
    const accuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0";
    const speed = timeTaken > 0 ? (attempts / (50 / 60)).toFixed(2) : "0";

    const questionHistoryBySubject = {};
    const subjectStats = {};

    for (const item of questionHistory) {
      const subject = item.subject;
      if (!questionHistoryBySubject[subject]) {
        questionHistoryBySubject[subject] = [];
      }
      questionHistoryBySubject[subject].push(item);
    }

    for (const [subject, items] of Object.entries(questionHistoryBySubject)) {
      let sCorrect = 0, sIncorrect = 0, sSkipped = 0, sMarks = 0;
      for (const q of items) {
        if (q.is_skipped === 1) sSkipped++;
        else if (q.is_correct === 1) sCorrect++;
        else sIncorrect++;
        sMarks += parseFloat(q.marks || 0);
      }
     const [rows] = await pool.promise().query(
    `SELECT SUM(CAST(correct_marks AS UNSIGNED)) AS totalExamMarks
     FROM live_test_questions
     WHERE test_id = ? AND subject = ?`,
    [testId, subject]
  );

  const totalExamMarks = rows[0].totalExamMarks || 0;
      const total = items.length;
      subjectStats[subject] = {
        total_questions: total,
        correct: sCorrect,
        incorrect: sIncorrect,
        skipped: sSkipped,
        marks: sMarks,
         total_marks: totalExamMarks,
        accuracy: totalExamMarks > 0 ? ((sMarks / totalExamMarks) * 100).toFixed(2) + "%" : "0%"
      };
    }

    const [[resultSum]] = await pool.promise().query(
      `SELECT SUM(marks) AS totalMarks FROM live_test_result_details 
       WHERE test_id = ? AND frontuser_id = ?`,
      [testId, userId]
    );
    const totalMarks = resultSum.totalMarks || 0;

    // Rank logic
    const [allResults] = await pool.promise().query(
      `SELECT * FROM live_test_result_details WHERE test_id = ?`,
      [testId]
    );

    const userAccuracyList = [];
    const groupedResults = {};

    for (const res of allResults) {
      if (!groupedResults[res.frontuser_id]) groupedResults[res.frontuser_id] = [];
      groupedResults[res.frontuser_id].push(res);
    }

    for (const uid in groupedResults) {
      let uCorrect = 0, uIncorrect = 0;
      for (const r of groupedResults[uid]) {
        if (r.is_correct === 1) uCorrect++;
        else if (r.is_correct === 0) uIncorrect++;
      }
      const uAttempts = uCorrect + uIncorrect;
      const uAccuracy = uAttempts > 0 ? ((uCorrect / uAttempts) * 100).toFixed(2) : 0;
      userAccuracyList.push({ user_id: parseInt(uid), accuracy: parseFloat(uAccuracy) });
    }

    userAccuracyList.sort((a, b) => b.accuracy - a.accuracy);

    let userRank = 0;
    for (let i = 0; i < userAccuracyList.length; i++) {
      if (userAccuracyList[i].user_id === userId) {
        userRank = i + 1;
        break;
      }
    }

    let isDisplayDate = liveTest.batch_type === "online" && liveTest.testtype !== "Practice" ? 0 : 1;
// const totalExamMarks = questionHistory.reduce(
//   (total, item) => total + Number(item.correct_mark || 0),
//   0
// );


const [rows] = await pool.promise().query(
  `SELECT SUM(CAST(correct_marks AS UNSIGNED)) AS totalExamMarks
   FROM live_test_questions
   WHERE test_id = ?`,
  [testId]
);

const totalExamMarks = rows[0].totalExamMarks || 0;

const obtainedMarks = questionHistory.reduce(
  (total, item) => total + Number(item.marks || 0),
  0
);
    return res.json({
      success: true,
      message: "Test result fetched successfully",
      is_result_declared: isResultDeclared ? 1 : 0,
      is_display_history: isDisplayHistory,
      isDisplayDate,
      live_test: {
        ...liveTest,
        display_result_date: moment(liveTest.result_date).format("DD MMM YYYY, hh:mm A"),
      },
      

      data: {
        score: `${correct}/${totalQuestions}`,
        attempts,
        totalExamMarks,
        obtainedMarks,
         score: `${obtainedMarks}/${totalExamMarks}`,
         
        speed: `${speed}/min`,
        accuracy : totalExamMarks > 0 
  ? ((obtainedMarks / totalExamMarks) * 100).toFixed(2)  // 2 decimal places
  : 0,
        
        correct,
        incorrect,
        skipped,
        grade: 0,
        totalQuestions,
        rank: userRank,
        time_taken: resultData?.spend_time ? `${resultData.spend_time} sec` : "",
        total_score: totalScore,
        question_historyCount: questionHistory.length,
        question_history: questionHistory,
        question_history_by_subject: questionHistoryBySubject,
        subject_stats: subjectStats,
        studentAnswerSheet,
        resultUploadedAnswerSheet
      }
    });
  } catch (err) {
    console.error("❌ Error calculating question marks:", err.message);
  console.error(err.stack);
  return res.status(500).json({
    success: false,
    message: "Server error",
    error: err.message,
    stack: err.stack
  });
  }
},
addressList: async (req, res) => {
  try {
    const user_id = req.user.id;

    const [rows] = await pool.promise().query(
      `SELECT * FROM addresses 
       WHERE user_id = ?  AND deleted_at IS NULL 
       ORDER BY is_default DESC, id DESC`,
      [user_id]
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
},


addAddress: async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      address_id,
      first_name,
      last_name,
      country,
      state,
      city,
      state_id,
      city_id,
      pincode,
      address,
      is_default
    } = req.body;

    if (!first_name || !last_name || !address) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    let finalState = state || null;
    let finalCity = city || null;

    if (state_id) {
      const [stateResult] = await pool.promise().query(
        `SELECT name FROM states WHERE id = ?`,
        [state_id]
      );
      finalState = stateResult.length ? stateResult[0].name : finalState;
    }

    if (city_id) {
      const [cityResult] = await pool.promise().query(
        `SELECT name FROM cities WHERE id = ?`,
        [city_id]
      );
      finalCity = cityResult.length ? cityResult[0].name : finalCity;
    }

    // If is_default is 1, reset other addresses
    if (is_default === 1) {
      await pool.promise().query(
        `UPDATE addresses SET is_default = 0 WHERE user_id = ?`,
        [user_id]
      );
    }

    if (address_id) {
      // UPDATE
      await pool.promise().query(
        `UPDATE addresses
         SET first_name=?, last_name=?, country=?, state=?, city=?, pincode=?, address=?, is_default=?
         WHERE id=? AND user_id=?`,
        [first_name, last_name, country, finalState, finalCity, pincode, address, is_default, address_id, user_id]
      );

      return res.json({
        success: true,
        message: "Address updated successfully",
        id: address_id,
        postData: req.body
      });
    } else {
      // Check if user has any addresses
      const [existingAddresses] = await pool.promise().query(
        `SELECT COUNT(*) AS count FROM addresses WHERE user_id = ?`,
        [user_id]
      );
      const defaultFlag = existingAddresses[0].count === 0 ? 1 : (is_default || 0);

      // INSERT
      const [result] = await pool.promise().query(
        `INSERT INTO addresses
         (user_id, first_name, last_name, country, state, city, pincode, address, is_default, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [user_id, first_name, last_name, country, finalState, finalCity, pincode, address, defaultFlag]
      );

      return res.json({
        success: true,
        message: "Address added successfully",
        id: result.insertId,
        postData: req.body
      });
    }
  } catch (err) {
    console.error("Error in addAddress:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
      stack: err.stack
    });
  }
},


deleteAddress: async (req, res) => {
  try {
    const { address_id } = req.body; // Correct destructuring

    if (!address_id) {
      return res.status(400).json({ success: false, message: "Address ID is required" });
    }

    await pool.promise().query(
      `UPDATE addresses SET status = 0, deleted_at = NOW() WHERE id = ?`,
      [address_id]
    );

    return res.json({ success: true, message: "Address deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error",       stack: err.stack, });
  }
},

setDefaultAddress: async (req, res) => {
  try {
    const { address_id } = req.body;
    const userId = req.user.id; // Assuming authenticateCustomer sets req.user

    if (!address_id) {
      return res.status(400).json({ success: false, message: "Address ID is required" });
    }

    // Check if address exists and belongs to user
    const [addressRows] = await pool.promise().query(
      `SELECT is_default FROM addresses WHERE id = ? AND user_id = ?`,
      [address_id, userId]
    );

    if (addressRows.length === 0) {
      return res.status(404).json({ success: false, message: "Address not found or not owned by user" });
    }

    const isAlreadyDefault = addressRows[0].is_default === 1;
    if (isAlreadyDefault) {
      return res.json({
        success: true,
        message: "Address is already set as default",
        defaultAddressId: address_id,
      });
    }

    // Reset all addresses for this user
    await pool.promise().query(
      `UPDATE addresses SET is_default = 0 WHERE user_id = ?`,
      [userId]
    );

    // Set the chosen address as default
    const [result] = await pool.promise().query(
      `UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?`,
      [address_id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ success: false, message: "Failed to update default address" });
    }

    return res.json({
      success: true,
      message: "Default address updated successfully",
      defaultAddressId: address_id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
      stack: err.stack,
    });
  }
},

testSeriesDetails: async (req, res) => {
  try {
    const id = req.body.test_series_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Test series ID is required",
      });
    }

    // Get test series with category name
    const [rows] = await pool.promise().execute(
      `
      SELECT 
        ts.*, 
        c.category_name 
      FROM 
        test_series ts
      LEFT JOIN 
        categories c ON ts.category_id = c.id
      WHERE 
        ts.id = ? 
        AND ts.status = 1 
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Test series not found or inactive",
      });
    }

    const course = rows[0];
    const userId = req.user.id;
        if (userId) {
      const [latestOrderRows] = await pool.promise().query(
        `SELECT * FROM course_orders
         WHERE course_id = ? 
           AND user_id = ? 
           AND (payment_status = 'complete' OR payment_status = 'completed')
           AND order_type = 'test'
         ORDER BY created_at DESC
         LIMIT 1`,
        [id, userId]
      );

      if (latestOrderRows.length > 0) {
        course.is_paid = true;
        course.latest_order = latestOrderRows[0];
      } else {
        course.is_paid = false;
        course.latest_order = null;
      }
    } else {
      course.is_paid = false;
      course.latest_order = [];
    }


    // GST and discount calculation (modify discount logic as needed)
    const discountAmount = 0;
    const gstPercentage = 18;
    const gstAmount = Math.round((course.offer_price * gstPercentage) / 100);
    const totalAmountWithGST = course.offer_price + gstAmount;

    course.discount_amount = discountAmount;
    course.gst_per = gstPercentage;
    course.gst_amount = gstAmount;
    course.total_amount = totalAmountWithGST;

    // Get exams and count active questions
    const [exams] = await pool.promise().execute(
      `
      SELECT 
        tst.*,
        COUNT(ltq.id) AS total_active_questions
      FROM 
        live_test tst
      LEFT JOIN 
        live_test_questions ltq 
          ON ltq.test_id = tst.id AND ltq.status = 1
      WHERE 
        tst.test_series_id = ?
      GROUP BY 
        tst.id
      ORDER BY 
        tst.id ASC
      `,
      [course.id]
    );

    // Split exams into free and paid
    const freeExams = exams.filter((e) => e.price == 0);
    const paidExams = exams.filter((e) => e.price > 0);

    // Get other test series (optional slug logic; modify as needed)
    const trimmedSlug = course.slug ? course.slug.trim() : "";
    const otherTestSeries = await Helper.getOtherActiveTestSeries(trimmedSlug);

    // Final response
    return res.json({
      success: true,
      message: "Test series fetched successfully",
      all: exams.length,
      free: freeExams.length,
      paid: paidExams.length,
      data: {
        ...course,
        all_exams: exams,
        free_exams: freeExams,
        paid_exams: paidExams,
        exam_counts: {
          all: exams.length,
          free: freeExams.length,
          paid: paidExams.length,
        },
        otherTestSeries: otherTestSeries,
      },
    });
  } catch (error) {
    console.error("Error fetching test series:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
},

deleteReasons : async (req, res) => {
    try {
        const [results] = await pool.promise().query(
            'SELECT id, reason, details FROM delete_reasons WHERE status = 1'
        );

        if (!results || results.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No delete reasons found.'
            });
        }

        return res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Database error.'
        });
    }

},
deleteAccount: async (req, res) => {

    const userId = req.user.id; // Assuming authenticateCustomer sets req.user
    const { delete_reason_id, deleted_remark } = req.body;
    const user_id = req.user.id;

    if (!user_id || !delete_reason_id) {
        return res.status(400).json({
            success: false,
            message: 'User ID and delete reason are required.',
            data:userId,
        });
    }

    try {
        // Check if user exists and not already deleted
        const [users] = await pool.promise().query(
            'SELECT id, name, email FROM front_users WHERE id = ? AND is_deleted = 0',
            [user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found or already deleted.'
            });
        }

        const user = users[0]; // Save user info to return later

        // Insert deletion info
        await pool.promise().query(
            `INSERT INTO delete_history (user_id, delete_reason_id, deleted_remark, deleted_at)
             VALUES (?, ?, ?, NOW())`,
            [user_id, delete_reason_id, deleted_remark || null]
        );

        // Soft delete user
        await pool.promise().query(
            'UPDATE front_users SET is_deleted = 1 WHERE id = ?',
            [user_id]
        );

        return res.status(200).json({
            success: true,
            user:userId,
            message: 'Account deleted successfully.',
            data: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Database error.'
        });
    }
},


  
// saveCheckoutOrder: async (req, res) => {
//     try {
//       const { amount } = req.body;
//       const userId = req.user?.id; // if user is authenticated
//       const customerEmail = req.user?.email; // if user is authenticated
//       const customerPhone = req.user?.mobile; // if user is authenticated

//       if (!amount) {
//         return res.status(400).json({
//           success: false,
//           message: "Amount is required",
//         });
//       }

//       // Prepare Cashfree order payload
//       const orderPayload = {
//         order_amount: amount,
//         order_currency: "INR",
//         customer_details: {
//           customer_id: userId ? `CUST_${userId}` : `CUST_${Date.now()}`,
//           customer_email: customerEmail,
//           customer_phone: customerPhone
//         },
//       };

//  const CASHFREE_ENV = process.env.CASHFREE_ENV || 'sandbox';

// const CASHFREE_API_URL =
//   CASHFREE_ENV === 'production'
//     ? 'https://api.cashfree.com/pg/orders' // production URL
//     : 'https://sandbox.cashfree.com/pg/orders'; // sandbox URL

//       const response = await axios.post(
//         CASHFREE_API_URL,
//         orderPayload,
//         {
//           headers: {
//             "x-client-id": process.env.CASHFREE_APP_ID,
//             "x-client-secret": process.env.CASHFREE_SECRET_KEY,
//             "x-api-version": "2022-09-01",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return res.status(200).json({
//         success: true,
//         order: response.data,
//       });
//     } catch (error) {
//       console.error("Cashfree Order Error:", error.response?.data || error.message);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to create order",
//         error: error.response?.data || error.message,
//       });
//     }
//   },


createMobileCashFreeOrder: async (req, res) => {
    try {
      const { amount } = req.body;
      const userId = req.user?.id; // if user is authenticated
      const customerEmail = req.user?.email; // if user is authenticated
      const customerPhone = req.user?.mobile; // if user is authenticated

      if (!amount) {
        return res.status(400).json({
          success: false,
          message: "Amount is required",
        });
      }

      // Prepare Cashfree order payload
      const orderPayload = {
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: userId ? `CUST_${userId}` : `CUST_${Date.now()}`,
          customer_email: customerEmail,
          customer_phone: customerPhone
        },
      };

 const CASHFREE_ENV = process.env.CASHFREE_ENV || 'production';

// const CASHFREE_API_URL =
//   CASHFREE_ENV === 'production'
//     ? 'https://api.cashfree.com/pg/orders' // production URL
//     : 'https://sandbox.cashfree.com/pg/orders'; // sandbox URL

const CASHFREE_API_URL = 'https://api.cashfree.com/pg/orders';
      const response = await axios.post(
        CASHFREE_API_URL,
        orderPayload,
        {
          headers: {
            "x-client-id": CASHFREE_LIVE_APP_ID,
            "x-client-secret": CASHFREE_LIVE_SECRET_KEY,
            "x-api-version": "2022-09-01",
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json({
        success: true,
        order: response.data,
        isSandbox:false
      });
    } catch (error) {
      console.error("Cashfree Order Error:", error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.response?.data || error.message,
      });
    }
  },


  appCourseDetails: async (req, res) => {
  try {
    const { course_id } = req.body;
    
    const userId = req.user.id;
    
    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "Course Id is required",
        base_url: BASE_URL,
        public_path: PUBLIC_PATH,
        NO_IMAGE_URL: NO_IMAGE_URL,
        path: req.originalUrl,
        userId:"userId",
      });
    }

    // Fetch course details by ID
    const [courseRows] = await pool.promise().query(
      `SELECT c.*, 
              cat.category_name AS category_name, 
              cls.name AS class_name
       FROM courses c
       LEFT JOIN categories cat ON cat.id = c.category_id
       LEFT JOIN course_classes cls ON cls.id = c.course_class_id
       WHERE c.id = ? 
         AND c.deleted_at IS NULL
       LIMIT 1`,
      [course_id]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
        base_url: BASE_URL,
        public_path: PUBLIC_PATH,
        path: req.originalUrl,
      });
    }

    const course = courseRows[0];

    // Check if user has purchased this course
  
      const [latestOrderRows] = await pool.promise().query(
        `SELECT * FROM course_orders
         WHERE course_id = ? 
           AND user_id = ? 
          AND (payment_status = 'complete' OR payment_status = 'completed')
           AND order_type = 'course'
         ORDER BY created_at DESC
         LIMIT 1`,
        [course_id, userId]
      );

      if (latestOrderRows.length > 0) {
        course.is_paid = true;
        course.latest_order = latestOrderRows[0];
      } else {
        course.is_paid = false;
        course.latest_order = []
      }
    

    // Step 2: Get subject names and count
    const [subjectData] = await pool.promise().query(
  `SELECT 
       GROUP_CONCAT(subject_name ORDER BY id ASC SEPARATOR ', ') AS subject_names,
       COUNT(*) AS subject_count
     FROM course_subjects 
     WHERE course_id = ? AND status = 1 AND deleted_at IS NULL`,
  [course.id]
);

course.subject_names = subjectData[0].subject_names || "";
course.subject_count = subjectData[0].subject_count || 0;

    // Step 3: Get video count
    const [videoData] = await pool.promise().query(
      `SELECT COUNT(*) AS video_count 
       FROM course_video 
       WHERE course_id = ?`,
      [course.id]
    );

    course.video_count = videoData[0]?.video_count || 0;

    // Step 4: Get pdf count
    const [pdfData] = await pool.promise().query(
      `SELECT COUNT(*) AS pdf_count 
       FROM course_pdf 
       WHERE course_id = ?`,
      [course.id]
    );

    course.pdf_count = pdfData[0]?.pdf_count || 0;

    // Get teachers, FAQs, and services
    const teachers = await Helper.getFacultiesByCourseId(course.teacher_id);
    const faq = await Helper.getFaqs();
    const getServices = await Helper.getServices();

    // Dummy counts (replace with real logic if needed)
    course.audio_count = 3;
    course.notes_count = 3;

    // GST Calculation
    const discountAmount = 0; // If any logic needed, apply here
    const gstPercentage = 0;
    const gstAmount = Math.round((course.offer_price * gstPercentage) / 100);
    const totalAmountWithGST = course.offer_price + gstAmount;

    course.discount_amount = discountAmount;
    course.gst_per = gstPercentage;
    course.gst_amount = gstAmount;
    course.total_amount = totalAmountWithGST;

if (course.description) {
  // Add table-responsive wrapper + add classes to <table>
  course.description = course.description
    .replace(
      /<table([^>]*)>/g,
      '<div class="table-responsive"><table class="table table-bordered"$1>'
    )
    .replace(/<\/table>/g, '</table></div>');
}
    // Final response
    return res.status(200).json({
      success: true,
      message: "Course Details",
      base_url: BASE_URL,
      public_path: PUBLIC_PATH,
      NO_IMAGE_URL: NO_IMAGE_URL,
      user_id: userId,
      path: req.originalUrl,
      data: course,
      teachers,
      faq,
      getServices,
    });
  } catch (error) {
    console.error("Error in appCourseDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      base_url: BASE_URL,
      public_path: PUBLIC_PATH,
      NO_IMAGE_URL: NO_IMAGE_URL,
      path: req.originalUrl,
      error: error.message,
    });
  }
},

saveCheckoutOrder: async (req, res) => {
  const {
    coupon_code = "",
    cf_order_id = req.body.order_id,
    address_id,
    source = "app",    // default source if not provided
    payment_order_id,
  } = req.body;

  const user = req.user;
  const user_id = user?.id;

  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user." });
  }

  try {
    const promisePool = pool.promise();

    // 1. Get book cart items
    const [cartItems] = await promisePool.query(
      `SELECT c.*, b.book_name, b.price AS book_price, b.offer_price
       FROM carts c
       JOIN books b ON b.id = c.item_id
       WHERE c.user_id = ? AND c.item_type = 'book'`,
      [user_id]
    );

    if (!cartItems.length) {
      return res
        .status(400)
        .json({ success: false, message: "Your cart is empty." });
    }

    // 2. Calculate subtotal
    let subTotal = 0;
    for (const item of cartItems) {
      const price = item.offer_price ?? item.book_price;
      subTotal += price * item.item_quantity;
    }

    // 3. Handle coupon
    let discountAmount = 0;
    if (coupon_code) {
      const [coupons] = await promisePool.query(
        `SELECT * FROM coupons WHERE coupon_code = ? LIMIT 1`,
        [coupon_code]
      );

      if (coupons.length) {
        const coupon = coupons[0];
        const discountValue = parseFloat(coupon.coupon_discount);
        discountAmount =
          coupon.coupon_type === "percentage"
            ? Math.round((subTotal * discountValue) / 100)
            : discountValue;
      }
    }

    const amountBeforeGst = Math.max(subTotal - discountAmount, 0);
    const gstPercentage = 0; // adjust if needed
    const gstAmount = Math.round((amountBeforeGst * gstPercentage) / 100);
    const totalAmount = amountBeforeGst + gstAmount;

    // 4. Generate orderId for DB
    const orderId =
      "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    // 5. Save order in DB with payment_order_id from body
    const [orderInsert] = await promisePool.query(
      `INSERT INTO book_orders (
        user_id, order_id, cf_order_id, payment_type, payment_status,
        coupon_code, discount_amount, gst_amount, total_amount, order_status,
        total_amount_before_gst, gst_percentage, source, address_id, payment_order_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        user_id,
        orderId,
        cf_order_id,
        "online",
        "pending",
        coupon_code,
        discountAmount,
        gstAmount,
        totalAmount,
        "pending",
        amountBeforeGst,
        gstPercentage,
        "app",
        address_id,
        payment_order_id,
      ]
    );

    const insertedOrderId = orderInsert.insertId;

    // 6. Save order items
    for (const item of cartItems) {
      const price = item.offer_price ?? item.book_price;
      const total = price * item.item_quantity;

      await promisePool.query(
        `INSERT INTO book_order_details (
          order_id, book_id, book_name, book_price, offer_price, quantity, total_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          insertedOrderId,
          item.item_id,
          item.book_name,
          item.book_price ?? 0,
          item.offer_price ?? item.book_price,
          item.item_quantity,
          total,
        ]
      );
    }

    return res.json({
      success: true,
      message: "Order saved in DB successfully.",
      order_id: orderId,
      db_order_id: insertedOrderId,
      total_amount: totalAmount,
      source,
      address_id,
      payment_order_id,
    });
  } catch (error) {
    console.error("buyCartItems Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating order.",
      error: error.message,
    });
  }
},

fcmTokenUpdate: async (req, res) => {
  try {
    const { device_key = "" } = req.body;

    // get userId safely
    const userId = req.user ? req.user.id : req.body.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    if (!device_key) {
      return res.status(400).json({
        success: false,
        message: "Device Key is required.",
      });
    }

    const promisePool = pool.promise();

    const [updateResult] = await promisePool.query(
      `UPDATE front_users SET device_key = ? WHERE id = ?`,
      [device_key, userId]   // ✅ use device_key
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "Device key updated successfully.",
      device_key,  // ✅ return device_key instead of fcm_token
    });
  } catch (error) {
    console.error("fcmTokenUpdate Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating device key.",
      error: error.message,
    });
  }
},


sendPushNotificationToUser: async (req, res) => {
  try {
    // Take from request (or use defaults for testing)
    const { 
      title = "Welcome to Bansal", 
      body = "Welcome to Bansal", 
      data = {}, 
      landing_screen = "Home" 
    } = req.body;

    const userId = req.user?.id;
    const userType = req.user?.user_type || "user";
    const deviceKey = req.user?.device_key; // user's FCM token

    if (!deviceKey) {
      return res.status(400).json({
        success: false,
        message: "Device token not found",
      });
    }

    // Prepare FCM message
    const message = {
      notification: { title, body },
      token: deviceKey, // single user
      data: { screen: landing_screen, ...data },
      android: { priority: "high" },
      apns: { payload: { aps: { sound: "default" } } },
    };

    // Send notification via Firebase
    const response = await admin.messaging().send(message);

const createdAt = momenttimezone().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
const updatedAt = momenttimezone().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

const [result] = await pool.promise().query(
  `INSERT INTO notifications 
    (user_id, user_type, title, description, landing_screen, created_at, updated_at, is_read) 
   VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
  [userId, userType, title, body, landing_screen, createdAt, updatedAt,0]
);

    return res.status(200).json({
      success: true,
      message: "Notification sent & saved successfully",
      response,
    });
  } catch (error) {
    console.error("🔥 FCM Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
    });
  }
},




isReadNotification: async (req, res) => {
 try {
    const userId = req.user?.id; // from authenticateCustomer middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // Update all notifications to is_read = 1 for this user
    const [result] = await pool.promise().query(
      `UPDATE notifications 
       SET is_read = 1 
       WHERE user_id = ? AND is_read = 0`,
      [userId]
    );

    return res.json({
      success: true,
      message: "All unread notifications marked as read",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update notifications",
      error: error.message,
    });
  }
  },

  unReadNotificationCount: async (req, res) => {
  try {
    const userId = req.user?.id; // from auth middleware

    // Get count of unread notifications
    const [rows] = await pool.promise().query(
      `SELECT COUNT(*) AS unreadCount 
       FROM notifications 
       WHERE user_id = ? AND is_read = 0`,
      [userId]
    );

    return res.json({
      success: true,
      unreadCount: rows[0].unreadCount, // return count
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread notification count",
      error: error.message,
    });
  }
},

};



module.exports = MobileApiController;
