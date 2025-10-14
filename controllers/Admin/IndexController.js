const pool = require("../../db/database");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");

const dashboard = async (req, res) => {
  console.log("Dashboard");
  try {
    // const [[{ active_courses }]] = await pool
    //   .promise()
    //   .query(
    //     `SELECT COUNT(*) AS active_courses FROM courses WHERE status = 1 AND deleted_at IS NULL`
    //   );

      const userRoles = req.session.userRole || [];
  const userId = req.user.id;



        let query = `SELECT COUNT(*) AS active_courses FROM courses WHERE status = 1 AND deleted_at IS NULL`;
let queryParams = [];

// Role-based filtering
if (userRoles.includes("Center")) {
  query += ` AND (courses.created_by = ? OR courses.is_universal = 'yes')`;
  queryParams.push(userId);
}

// Execute query
const [[{ active_courses }]] = await pool.promise().query(query, queryParams);

    const [[{ active_books }]] = await pool
      .promise()
      .query(
        `SELECT COUNT(*) AS active_books FROM books WHERE status = 1 AND deleted_at IS NULL`
      );

    const [[{ active_coupons }]] = await pool
      .promise()
      .query(
        `SELECT COUNT(*) AS active_coupons FROM coupons WHERE status = 1 AND deleted_at IS NULL`
      );

    const [[{ active_centers }]] = await pool
      .promise()
      .query(
        `SELECT COUNT(*) AS active_centers FROM centers WHERE status = 1 AND deleted_at IS NULL`
      );

    // const [[{ active_students }]] = await pool
    //   .promise()
    //   .query(
    //     `SELECT COUNT(*) AS active_students FROM front_users WHERE status = 1 AND deleted_at IS NULL`
    //   );

      let studentQuery = `SELECT COUNT(*) AS active_students FROM front_users WHERE status = 1 AND deleted_at IS NULL`;
        let studentParams = [];

        // Example: role-based filter
        if (userRoles.includes("Center")) {
        studentQuery += ` AND center_id = ?`; // assuming you have this field
        studentParams.push(userId);
        }

// Execute query
        const [[{ active_students }]] = await pool.promise().query(studentQuery, studentParams);

    const [[{ active_test_series }]] = await pool
      .promise()
      .query(
        `SELECT COUNT(*) AS active_test_series FROM test_series WHERE status = 1 AND deleted_at IS NULL`
      );

    const [[{ active_live_tests }]] = await pool
      .promise()
      .query(
        `SELECT COUNT(*) AS active_live_tests FROM live_test WHERE status = 1 AND deleted_at IS NULL`
      );

    const [[{ active_service_city }]] = await pool
      .promise()
      .query(
        `SELECT COUNT(*) AS active_service_city FROM servicable_cities WHERE status = 1 AND deleted_at IS NULL`
      );

    res.render("admin/dashboard", {
      success: req.flash("success"),
      error: req.flash("error"),
      user: req.customer,
      active_courses,
      active_books,
      active_coupons,
      active_centers,
      active_students,
      active_test_series,
      active_live_tests,
      active_service_city,
      userRoles,
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).send("Server error");
  }
};

const restaurantdashboard = async (req, res) => {
  try {
    res.render("admin/restaurantdashboard", {
      success: req.flash("success"),
      error: req.flash("error"),
      user: req.restaurant, // Pass user to the view
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { dashboard, restaurantdashboard };
