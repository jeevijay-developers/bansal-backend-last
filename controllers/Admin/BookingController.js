const pool = require("../../db/database");

class BookingController {

  static async CourseBooking(req, res) {
  try {
    const page_name = "Course Booking List";
    const {
      from_date,
      to_date,
      payment_status,
      course,
      student,
      coupon_code,
    } = req.query;

    // Base query and conditions
    let conditions = [`co.order_type = 'course'`];
    let values = [];

    if (from_date) {
      conditions.push(`DATE(co.updated_at) >= ?`);
      values.push(from_date);
    }

    if (to_date) {
      conditions.push(`DATE(co.updated_at) <= ?`);
      values.push(to_date);
    }

    if (payment_status) {
  const paidStatuses = ['paid', 'completed', 'complete'];

  if (payment_status === 'paid') {
    conditions.push(`co.payment_status IN (${paidStatuses.map(() => '?').join(', ')})`);
    values.push(...paidStatuses);
  } else { 
    conditions.push(`co.payment_status NOT IN (${paidStatuses.map(() => '?').join(', ')})`);
    values.push(...paidStatuses);
  }
}

    if (course) {
      conditions.push(`co.course_id = ?`);
      values.push(course);
    }

    if (student) {
      conditions.push(`co.user_id = ?`);
      values.push(student);
    }

    if (coupon_code) {
      conditions.push(`co.coupon_code = ?`);
      values.push(coupon_code);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT
        co.id,
        co.user_id,
        u.name AS customer_name,
        ts.course_name,
        co.transaction_id,
        co.payment_status,
        co.order_status,
        co.total_amount,
        co.coupon_code,
        co.created_at,
        co.updated_at
      FROM course_orders co
      JOIN front_users u ON u.id = co.user_id
      JOIN courses ts ON ts.id = co.course_id
      ${whereClause}
      ORDER BY co.created_at DESC
    `;

    const [bookings] = await pool.promise().query(query, values);

    // Get filter options
    const [courses] = await pool.promise().query(`
      SELECT DISTINCT c.id, c.course_name
      FROM courses c
      JOIN course_orders co ON co.course_id = c.id
      WHERE co.order_type = 'course'
    `);

    const [students] = await pool.promise().query(`
      SELECT DISTINCT u.id, u.name
      FROM front_users u
      JOIN course_orders co ON co.user_id = u.id
      WHERE co.order_type = 'course'
    `);

    const [coupons] = await pool.promise().query(`
      SELECT DISTINCT coupon_code
      FROM course_orders
      WHERE coupon_code IS NOT NULL AND coupon_code != ''
    `);

    res.render("admin/booking/course-order", {
      success: req.flash("success"),
      error: req.flash("error"),
      bookings,
      courses,
      students,
      coupons,
      req,
      page_name,
      list_url: "/admin/course-booking-list",
      trashed_list_url: "/admin/course-booking-list?status=trashed",
      create_url: "/admin/course-booking-create",
    });
  } catch (error) {
    console.error("CourseBooking List Error:", error);
    req.flash("error", "Server error in listing course bookings");
    res.redirect(req.get("Referrer") || "/");
  }
}


//   static async CourseBooking(req, res) {
//     try {
//       const status = req.query.status || "active";
//        const page_name = "Course Booking List";

// const whereClause = "WHERE order_type = 'course'";

// const query = `
//   SELECT
//     co.id,
//     co.user_id,
//     u.name AS customer_name,
//     ts.course_name,
//     co.transaction_id,
//     co.payment_status,
//     co.order_status,
//     co.total_amount,
//     co.created_at,
//     co.updated_at
//   FROM course_orders co
//   JOIN front_users u ON u.id = co.user_id
//   JOIN courses ts ON ts.id = co.course_id
//   WHERE co.order_type = 'course'
//   ORDER BY co.created_at DESC
// `;



//       const [bookings] = await pool.promise().query(query);
//        const [courses] = await pool.promise().query(`
//       SELECT DISTINCT c.id, c.course_name
//       FROM courses c
//       JOIN course_orders co ON co.course_id = c.id
//       WHERE co.order_type = 'course'
//     `);

//     // 🔹 Get unique user IDs from course_orders and their names
//     const [students] = await pool.promise().query(`
//       SELECT DISTINCT u.id, u.name
//       FROM front_users u
//       JOIN course_orders co ON co.user_id = u.id
//       WHERE co.order_type = 'course'
//     `);

//     // 🔹 Get distinct coupon codes used in course_orders
//     const [coupons] = await pool.promise().query(`
//       SELECT DISTINCT coupon_code
//       FROM course_orders
//       WHERE coupon_code IS NOT NULL AND coupon_code != ''
//     `);
//       res.render("admin/booking/course-order", {
//         success: req.flash("success"),
//         error: req.flash("error"),
//         bookings,
//           courses,
//       students,
//       coupons,
//         req,
//         page_name,
//         list_url: "/admin/course-booking-list",
//         trashed_list_url: "/admin/course-booking-list?status=trashed",
//         create_url: "/admin/course-booking-create",
//       });
//     } catch (error) {
//       console.error("CourseBooking List Error:", error);
//       req.flash("error", "Server error in listing course bookings");
//       res.redirect(req.get("Referrer") || "/");
//     }
//   }

  static async TestSeriesBooking(req, res) {
    try {

      const status = req.query.status || "active";
    const page_name = "Test Series Booking List";
      console.log(page_name);
const whereClause = "WHERE order_type = 'test'";

    const query = `
  SELECT
    co.id,
    co.user_id,
    u.name AS customer_name,
    u.email,
    u.mobile,
    u.father_name,
    u.mother_name,
    u.dob,
    u.address,
    u.city,
    ts.name as course_name,
    co.transaction_id,
    co.payment_status,
    co.order_status,
    co.total_amount,
    co.created_at,
    co.updated_at
  FROM course_orders co
  JOIN front_users u ON u.id = co.user_id
  JOIN test_series ts ON ts.id = co.course_id
  WHERE co.order_type = 'test'
  ORDER BY co.created_at DESC
`;


      const [bookings] = await pool.promise().query(query);
      console.log(bookings)
      res.render("admin/booking/test-series-order", {
        success: req.flash("success"),
        error: req.flash("error"),
        bookings,
        req,
        page_name,
        list_url: "/admin/test-series-booking-list",
        trashed_list_url: "/admin/test-series-booking-list?status=trashed",
      });
    } catch (error) {
      console.error("TestSeriesBooking List Error:", error);
      req.flash("error", "Server error in listing test series bookings");
      res.redirect(req.get("Referrer") || "/");
    }
  }

  static async bookingDetails(req, res) {
    try {
      const bookingId = req.params.bookingId;

      const query = `
        SELECT 
          tsb.*,
          u.name AS customer_name,
          u.email AS email,
          u.mobile AS mobile,
          ts.name AS test_series_name
        FROM course_orders tsb
        LEFT JOIN front_users u ON tsb.user_id = u.id
        LEFT JOIN test_series ts ON tsb.course_id = ts.id
        WHERE tsb.id = ?
      `;

      const [results] = await pool.promise().query(query, [bookingId]);


      if (results.length === 0) {
        req.flash("error", "Booking not found");
        return res.redirect("/admin/test-series-booking-list");
      }

      const booking = results[0];

      // console.log(booking); 
      res.render("admin/booking/booking_details", {
        success: req.flash("success"),
        error: req.flash("error"),
        booking,
        req,
        page_name: "Booking Details",
        list_url: "/admin/test-series-booking-list",
      });
    } catch (error) {
      console.error("Booking Details Error:", error);
      req.flash("error", "Server error retrieving booking details");
      res.redirect(req.get("Referrer") || "/");
    }
  };

  static async LiveTestBooking(req, res) {
  try {
    const page_name = "Live Test Booking List";
    const {
      from_date,
      to_date,
      status,
      course,
      student,
      coupon,
    } = req.query;

    // Base query and conditions
    let conditions = [];
    let values = [];

    if (from_date) {
      conditions.push(`DATE(co.created_at) >= ?`);
      values.push(from_date);
    }

    if (to_date) {
      conditions.push(`DATE(co.created_at) <= ?`);
      values.push(to_date);
    }

    if (status) {
      conditions.push(`co.payment_status = ?`);
      values.push(status);
    }

    if (course) {
      conditions.push(`co.course_id = ?`);
      values.push(course);
    }

    if (student) {
      conditions.push(`co.user_id = ?`);
      values.push(student);
    }

    if (coupon) {
      conditions.push(`co.coupon_code = ?`);
      values.push(coupon);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT
        co.id,
        co.user_id,
        u.name AS customer_name,
        ts.test_name,
        co.transaction_id,
        co.payment_status,
        co.order_status,
        co.total_amount,
        co.coupon_code,
        co.created_at,
        co.updated_at
      FROM live_test_orders co
      JOIN front_users u ON u.id = co.user_id
      JOIN live_test ts ON ts.id = co.test_id
      ${whereClause}
      ORDER BY co.created_at DESC
    `;

    const [bookings] = await pool.promise().query(query, values);

    // Get filter options
    const [courses] = await pool.promise().query(`
      SELECT DISTINCT c.id, c.test_name
      FROM live_test c
      JOIN live_test_orders co ON co.test_id = c.id
     
    `);

    const [students] = await pool.promise().query(`
      SELECT DISTINCT u.id, u.name
      FROM front_users u
      JOIN live_test_orders co ON co.user_id = u.id
    `);

    const [coupons] = await pool.promise().query(`
      SELECT DISTINCT coupon_code
      FROM live_test_orders
      WHERE coupon_code IS NOT NULL AND coupon_code != ''
    `);

    res.render("admin/booking/live-test-order", {
      success: req.flash("success"),
      error: req.flash("error"),
      bookings,
      courses,
      students,
      coupons,
      req,
      page_name,
      list_url: "/admin/course-booking-list",
      trashed_list_url: "/admin/course-booking-list?status=trashed",
      create_url: "/admin/course-booking-create",
    });
  } catch (error) {
    console.error("CourseBooking List Error:", error);
    req.flash("error", "Server error in listing course bookings");
    res.redirect(req.get("Referrer") || "/");
  }
}


  static async facultyTrainingRequestList(req, res) {
  try {
    const { from_date, to_date, program_id } = req.query;

    let query = `SELECT * FROM faculty_training_requests WHERE 1=1`;
    const values = [];

    if (from_date) {
      query += ` AND DATE(created_at) >= ?`;
      values.push(from_date);
    }

    if (to_date) {
      query += ` AND DATE(created_at) <= ?`;
      values.push(to_date);
    }

    if (program_id) {
      query += ` AND training_id = ?`;
      values.push(program_id);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await pool.promise().query(query, values);
    const [programs] = await pool
  .promise()
  .query("SELECT * FROM faculty_trainings WHERE apply_date > CURDATE() AND status = 1 ORDER BY id ASC");
    console.log(programs); 
    return res.render("admin/faculty-training/request-list", {
      title: "Faculty Training Request List",
      request_data: rows,
      programs,
      req,
    });

  } catch (error) {
    console.error("Error fetching faculty training requests:", error);
    return res.status(500).send("Internal Server Error");
  }
}
static async boostProgramRequestList(req, res) {
  try {
    const { from_date, to_date, payment_status } = req.query;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const offset = (page - 1) * limit;

    // Get current user's role and name
    const userRoles = req.roles || req.session.userRole || [];
    const isSuperAdmin = userRoles.includes('Super Admin');
    const userName = req.user?.name || req.session?.userName || '';

    let countQuery = `SELECT COUNT(*) as total FROM boost_training_requests WHERE 1=1`;
    let query = `SELECT * FROM boost_training_requests WHERE 1=1`;
    const countValues = [];
    const values = [];

    // Filter by center if user is not Super Admin
    if (!isSuperAdmin && userName) {
      countQuery += ` AND centre = ?`;
      query += ` AND centre = ?`;
      countValues.push(userName);
      values.push(userName);
    }

    if (from_date) {
      countQuery += ` AND DATE(created_at) >= ?`;
      query += ` AND DATE(created_at) >= ?`;
      countValues.push(from_date);
      values.push(from_date);
    }

    if (to_date) {
      countQuery += ` AND DATE(created_at) <= ?`;
      query += ` AND DATE(created_at) <= ?`;
      countValues.push(to_date);
      values.push(to_date);
    }

    if (payment_status) {
      countQuery += ` AND payment_status = ?`;
      query += ` AND payment_status = ?`;
      countValues.push(payment_status); // expects 'pending' or 'complete'
      values.push(payment_status);
    }

    // Get total count
    const [countResult] = await pool.promise().query(countQuery, countValues);
    const totalCount = countResult[0].total;

    query += ` ORDER BY id DESC`;
    query += ` LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const [rows] = await pool.promise().query(query, values);

    const programs = [];

    // Calculate pagination data
    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      totalRecords: totalCount,
      limit: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };

    return res.render("admin/booking/boost-program-request-list", {
      title: "Boost Program Request",
      request_data: rows,
      programs,
      permissions: req.permissions || res.locals.permissions || [],
      pagination: pagination,
      req,
    });

  } catch (error) {
    console.error("Error Boost Program requests:", error);
    return res.status(500).send("Internal Server Error");
  }
}


static async boostProgramRequestDetails(req, res) {
  const { id } = req.params;
  try {
    const [requestData] = await pool.promise().query(
      `SELECT * FROM boost_training_requests WHERE id = ?`,
      [id]
    );
    // console.log(requestData);
    if (!requestData.length) {
      return res.status(404).render("admin/404", { message: "Request not found" });
    }

    res.render("admin/booking/boost-program-request-details", {
      title: "Request Details",
      request: requestData[0],
    });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).render("admin/500", { message: "Server Error" });
  }
}

static async boostProgramRequestListExport(req, res) {
  try {
    const { from_date, to_date, payment_status } = req.query;

    // Get current user's role and name
    const userRoles = req.roles || req.session.userRole || [];
    const isSuperAdmin = userRoles.includes('Super Admin');
    const userName = req.user?.name || req.session?.userName || '';

    let query = `SELECT * FROM boost_training_requests WHERE 1=1`;
    const values = [];

    // Filter by center if user is not Super Admin
    if (!isSuperAdmin && userName) {
      query += ` AND centre = ?`;
      values.push(userName);
    }

    if (from_date) {
      query += ` AND DATE(created_at) >= ?`;
      values.push(from_date);
    }

    if (to_date) {
      query += ` AND DATE(created_at) <= ?`;
      values.push(to_date);
    }

    if (payment_status) {
      query += ` AND payment_status = ?`;
      values.push(payment_status);
    }

    query += ` ORDER BY id DESC`;

    const [rows] = await pool.promise().query(query, values);

    // Create CSV content with all detailed fields
    const headers = [
      'ID',
      'Name',
      'Email',
      'Mobile',
      'Program Type',
      'Program Date',
      'Price',
      'Transaction ID',
      'Status',
      'DOB',
      'Gender',
      'Father Name',
      'Mother Name',
      'Stream',
      'Class',
      'Test Dated',
      'Centre',
      'Address',
      'Pin Code',
      'City',
      'State',
      'School Name',
      'School Board',
      'Agree',
      'Created At',
      'Updated At'
    ];
    let csv = headers.join(',') + '\n';

    rows.forEach(row => {
      // Format dates
      const dob = row.dob 
        ? new Date(row.dob).toLocaleString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          })
        : '-';

      const testDate = row.test_date 
        ? new Date(row.test_date).toLocaleString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
          })
        : '-';

      const createdAt = row.created_at 
        ? new Date(row.created_at).toLocaleString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          })
        : '-';

      const updatedAt = row.updated_at 
        ? new Date(row.updated_at).toLocaleString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          })
        : '-';

      const rowData = [
        row.id || '',
        `"${(row.name || 'N/A').replace(/"/g, '""')}"`,
        `"${(row.email || 'N/A').replace(/"/g, '""')}"`,
        `"${row.mobile || 'N/A'}"`,
        `"${(row.program_type || 'N/A').replace(/"/g, '""')}"`,
        `"${row.program_date || 'N/A'}"`,
        `"${row.price || 'N/A'}"`,
        `"${(row.transaction_id || 'N/A').replace(/"/g, '""')}"`,
        `"${row.status === 1 ? 'Active' : 'Inactive'}"`,
        `"${dob}"`,
        `"${(row.gender || 'N/A').replace(/"/g, '""')}"`,
        `"${(row.father_name || 'N/A').replace(/"/g, '""')}"`,
        `"${(row.mother_name || 'N/A').replace(/"/g, '""')}"`,
        `"${(row.stream || 'N/A').replace(/"/g, '""')}"`,
        `"${(row.class || 'N/A').replace(/"/g, '""')}"`,
        `"${testDate}"`,
        `"${(row.centre || 'N/A').replace(/"/g, '""')}"`,
        `"${(row.address || 'N/A').replace(/"/g, '""')}"`,
        `"${row.pin_code || 'N/A'}"`,
        `"${(row.city || 'N/A').replace(/"/g, '""')}"`,
        `"${(row.state || 'N/A').replace(/"/g, '""')}"`,
        `"${(row.school_name || 'N/A').replace(/"/g, '""')}"`,
        `"${(row.school_board || 'N/A').replace(/"/g, '""')}"`,
        `"${row.agree === 1 ? 'Yes' : 'No'}"`,
        `"${createdAt}"`,
        `"${updatedAt}"`
      ];
      
      csv += rowData.join(',') + '\n';
    });

    // Set headers for CSV download
    const filename = `boost-program-requests-detailed-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.send(csv);

  } catch (error) {
    console.error("Error exporting boost program requests:", error);
    return res.status(500).send("Internal Server Error");
  }
}


}

module.exports = BookingController;
