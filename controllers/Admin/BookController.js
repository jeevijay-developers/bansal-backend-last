const pool = require("../../db/database");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");
const Helper = require("../../helpers/Helper");
const { validateRequiredFields } = require("../../helpers/validationsHelper");

const actions_url =  "/admin/book";
const table_name = "books"; // Change this dynamically as needed
const folder_path = "books"; // Change this dynamically as needed
const route = "book"; // Change this dynamically as needed
const module_name = "Book Store"; // Change this dynamically as needed
const module_title = "Book"; // Change this dynamically as needed

function List(req, res) {


  const { category_id, status } = req.query;
  const record_type = req.params.type; 
  const userRoles = req.session.userRole || [];
  const userId = req.user.id;

  let filters = [];
  let queryParams = [];

  // Role-based filtering
  if (userRoles.includes("Center")) {
    filters.push(`${table_name}.created_by = ?`);
    queryParams.push(userId);
  }

  // Soft delete and type filtering
  if (record_type === "trashed") {
    filters.push(`${table_name}.deleted_at IS NOT NULL`);
  } else {
    filters.push(`${table_name}.deleted_at IS NULL`);

    if (record_type === "active") {
      filters.push(`${table_name}.status = 1`);
    } else if (record_type === "inactive") {
      filters.push(`${table_name}.status = 0`);
    } else if (record_type === "online") {
      filters.push(`${table_name}.batch_type = 'online'`);
    } else if (record_type === "offline") {
      filters.push(`${table_name}.batch_type = 'offline'`);
    } else if (record_type === "free") {
      filters.push(`${table_name}.course_type = 'free'`);
    } else if (record_type === "paid") {
      filters.push(`${table_name}.course_type = 'paid'`);
    }
  }

  // Category and status filtering
  if (category_id) {
    filters.push(`${table_name}.category_id = ?`);
    queryParams.push(category_id);
  }

  if (status) {
    filters.push(`${table_name}.course_status = ?`);
    queryParams.push(status);
  }

  // SQL query dynamically built
  const sql = `
    SELECT 
      ${table_name}.*, 
      categories.category_name,
      users.name AS uploaded_by_name,
      roles.name AS uploaded_by_role
    FROM ${table_name}
    LEFT JOIN categories ON ${table_name}.category_id = categories.id
    LEFT JOIN users ON ${table_name}.created_by = users.id
    LEFT JOIN roles ON users.role_id = roles.id
    WHERE ${filters.join(" AND ")}
    ORDER BY ${table_name}.id DESC
  `;

  runQuery(sql, queryParams)
    .then(records => {
      return runQuery(`SELECT id, category_name FROM categories WHERE deleted_at IS NULL`)
        .then(category_list => {
          res.render(`admin/${folder_path}/list`, {
            customers: records,
            category_list,
            req,
            list_url: `/admin/${route}-list/all`,
            trashed_list_url: `/admin/${route}-list/trashed`,
            create_url: `/admin/${route}-create`,
            page_name: module_name + " List",
            route,
            module_name,
            record_type,
          });
        });
    })
    .catch(err => {
      console.error("DB Error:", err);
      res.status(500).send("Internal Server Error");
    });
}


const Create = async (req, res) => {
  try {
    const visibility = ["featured", "up_comming"];
    const services = await getServicesFromTable();
    const categories = await getCategoriesFromTable();
    const course_classes = await getCourseClassesFromTable();
    const faculties = await Helper.getActiveFaculties();
    const centers = await Helper.getCenters();

    let post = {};
    res.render(`admin/${folder_path}/create`, {
      success: req.flash("success"),
      error: req.flash("error"),
      visibility,
      form_url: `/admin/${route}-update`, // e.g., /admin/book-store
      page_name: `Create ${module_name}`, // e.g., Create Book Store
      services,
      post,
      categories,
      course_classes,
      faculties,
      centers,
      module_name
    });
  } catch (error) {
    console.log("Error:", error.message);
    req.flash("error", error.message);
    res.redirect(`/admin/${route}-list/all`);
  }
};
const getServicesFromTable = async () => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM services WHERE status = 1 AND deleted_at IS NULL"; // Correct SQL query
    pool.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}
const getCategoriesFromTable = async () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM categories WHERE status = 1 AND deleted_at IS NULL AND category_type = 'course'`;
    pool.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const validateCourseData = (data) => {
  const errors = {};

  // Auto-generate slug if not provided
  if (!data.slug || data.slug.trim() === "") {
    data.slug = data.course_name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  if (!data.category_id || isNaN(data.category_id)) {
    errors.category_id = "Category ID is required and must be numeric";
  }
  if (!data.course_class_id || isNaN(data.course_class_id)) {
    errors.course_class_id = "Course class ID is required and must be numeric";
  }
  if (!data.course_name?.trim()) {
    errors.course_name = "Course name is required";
  }
  if (!data.title_heading?.trim()) {
    errors.title_heading = "Title heading is required";
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    errors.slug = "Slug is invalid. Use lowercase letters, numbers, hyphens";
  }
  if (!["free", "paid"].includes(data.course_type)) {
    errors.course_type = 'Course type must be "free" or "paid"';
  }
  if (data.course_type === "paid" && (!data.price || isNaN(data.price))) {
    errors.price = "Price is required and must be a number";
  }
  if (!["percentage", "fixed"].includes(data.discount_type)) {
    errors.discount_type = 'Discount type must be "percentage" or "fixed"';
  }
  if (data.discount && isNaN(data.discount)) {
    errors.discount = "Discount must be a number";
  }
  if (!data.duration || isNaN(data.duration)) {
    errors.duration = "Duration must be a number";
  }
  if (!Array.isArray(data.course_visibility)) {
    errors.course_visibility = "Course visibility must be an array";
  }
  if (!data.content?.trim()) {
    errors.content = "Content is required";
  }
  if (!data.description?.trim()) {
    errors.description = "Description is required";
  }
  if (
    !Array.isArray(data.service_id) ||
    data.service_id.some((id) => isNaN(id))
  ) {
    errors.service_id = "Service IDs must be numeric array";
  }
  if (!data.start_time || isNaN(new Date(data.start_time))) {
    errors.start_time = "Start time is invalid";
  }
  if (!["0", "1"].includes(data.status)) {
    errors.status = 'Status must be "0" or "1"';
  }

  return errors;
};

const getCourseClassesFromTable = async () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM course_classes WHERE status = 1 AND deleted_at IS NULL`;
    pool.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const fs = require("fs");
const path = require("path");

// const checkImagePath = (filePath) => {
//     const normalizedPath = filePath.normalize(filePath); // converts \ to /
//     const fullPath = filePath.join(__dirname, '..', 'public', normalizedPath);

//     return fs.existsSync(fullPath);
//       };

const checkImagePath = (relativePath) => {
  const normalizedPath = path.normalize(relativePath);

  // Get the absolute path from the project root (where the 'public' folder is located)
  const fullPath = path.join(__dirname, "..", "public", normalizedPath);
  // console.log("Server checking for file at:", fullPath); // For debugging
  // Check if the file exists on the server
  return fs.existsSync(fullPath);
};

const generateImageURL = (imagePath) => {
  const baseURL = "http://localhost:5000/"; // Base URL of your application
  const defaultImage = "admin/images/default-featured-image.png"; // Default image if path doesn't exist

  // Check if the image exists on the server
  const fileExists = checkImagePath(imagePath);

  // Return the correct URL: either the actual image URL or the default image URL
  return fileExists ? `${baseURL}${imagePath}` : `${baseURL}${defaultImage}`;
};
const Edit = async (req, res) => {
  try {
    const postId = req.params.postId;

    // 🔁 Change these values to match your current module
    const route = "book";
    const table_name = "books";
    const module_name = "Book";
  

    const visibility = ["featured", "up_comming"];
    const services = await getServicesFromTable();
    const centers = await Helper.getCenters();

    // Fetch post
    const post = await new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM ${table_name} WHERE id = ?`, [postId], (error, result) => {
        if (error) return reject(error);
        if (!result.length) return reject(new Error(`${module_name} not found`));
        resolve(result[0]);
      });
    });

    const categories = await Helper.getActiveCategoriesByType();
    const course_classes = await Helper.getActiveCourseClasses();
    const faculties = await Helper.getActiveFaculties();

    const imageExists = checkImagePath(post.image);
    const detailsImageExists = checkImagePath(post.details_image);

    res.render(`admin/${folder_path}/create`, {
      success: req.flash("success"),
      error: req.flash("error"),
      post,
      categories,
      course_classes,
      faculties,
      centers,
      services,
      visibility,
      form_url: `/admin/${route}-update/${postId}`,
      page_name: `Edit ${module_name}`,
      module_name,
      route,
      image: imageExists ? post.image : "admin/images/default-featured-image.png",
      details_image: detailsImageExists ? post.details_image : "admin/images/default-featured-image.png",
    });
  } catch (error) {
    console.error("Edit Error:", error.message);
    req.flash("error", error.message);
    return res.redirect("back");
  }
};


const Update = async (req, res) => {
  const table_name = "books"; // Dynamically change this
  const postId = req.params.postId || req.body.id || null;
  const isInsert = !postId || postId === "null" || postId === "0";

  const {
    category_id,
    class_id,
    book_name,
    title_heading,
    slug: inputSlug,
    book_type = "free",
    price,
    discount_type,
    discount,
    duration,
    content,
    description,
    status,
    batch_year,
  } = req.body;

  const imageFile = req?.files?.image?.[0];
  const detailsImageFile = req?.files?.details_image?.[0];

  // Generate slug if not provided
  let slug = inputSlug?.trim();
  if (!slug && book_name) {
    slug = book_name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // --- Validation ---
  const errors = {};
  if (!category_id?.trim()) errors.category_id = ["Category is required"];
  if (!batch_year?.trim()) errors.batch_year = ["Batch Year is required"];
  if (!class_id?.trim()) errors.class_id = ["Class ID is required"];
  if (!book_name?.trim()) errors.book_name = ["Book name is required"];
  if (!title_heading?.trim()) errors.title_heading = ["Title heading is required"];
  if (!slug) errors.slug = ["Slug is required"];
  if (!["free", "paid"].includes(book_type)) errors.book_type = ["Invalid book type"];
  if (book_type === "paid" && (!price || isNaN(price))) errors.price = ["Price must be a number"];
  if (!content?.trim()) errors.content = ["Content is required"];
  if (!description?.trim()) errors.description = ["Description is required"];
  if (!["0", "1"].includes(status)) errors.status = ["Status must be '0' or '1'"];

  // File validations for insert
  if (isInsert) {
    if (!imageFile) errors.image = ["Image is required"];
    if (!detailsImageFile) errors.details_image = ["Details image is required"];
  }

  // If errors exist
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      success: false,
      errors,
      message: Object.values(errors)[0][0],
    });
  }

  // Offer price calculation
  let offer_price = 0;
  const parsedPrice = parseFloat(price);
  const parsedDiscount = parseFloat(discount);
  if (book_type === "paid" && !isNaN(parsedPrice)) {
    if (discount_type === "percentage" && !isNaN(parsedDiscount)) {
      offer_price = parsedPrice - (parsedPrice * parsedDiscount) / 100;
    } else if (discount_type === "price" && !isNaN(parsedDiscount)) {
      offer_price = parsedPrice - parsedDiscount;
    } else {
      offer_price = parsedPrice;
    }
    if (offer_price < 0) offer_price = 0;
  }

  // Prepare data for DB
  const data = {
    category_id: category_id.trim(),
    class_id: class_id.trim(),
    book_name: book_name.trim(),
    title_heading: title_heading.trim(),
    slug,
    book_type,
    price: parsedPrice || 0,
    discount_type,
    discount: parsedDiscount || 0,
    duration: parseInt(duration) || 0,
    content: content.trim(),
    description: description.trim(),
    status,
    offer_price,
    batch_year,
    created_by: req.user?.id || null,
  };

  if (imageFile) data.image = `/uploads/${table_name}/${imageFile.filename}`;
  if (detailsImageFile) data.details_image = `/uploads/${table_name}/${detailsImageFile.filename}`;

  // Insert or Update
  try {
    if (isInsert) {
      const fields = Object.keys(data);
      const placeholders = fields.map(() => "?").join(", ");
      const values = fields.map((key) => data[key]);

      const insertQuery = `INSERT INTO ${table_name} (${fields.join(", ")}) VALUES (${placeholders})`;
      pool.query(insertQuery, values, (err) => {
        if (err) {
          console.error("Insert Error:", err);
          return res.status(500).json({ success: false, message: "Insert failed" });
        }
        return res.json({
          success: true,
          redirect_url: `/admin/${route}-list/all`,
          message: "Record created successfully",
        });
      });
    } else {
      const fields = Object.keys(data);
      const setClause = fields.map((field) => `${field} = ?`).join(", ");
      const values = fields.map((key) => data[key]);
      values.push(postId);

      const updateQuery = `UPDATE ${table_name} SET ${setClause} WHERE id = ?`;
      pool.query(updateQuery, values, (err) => {
        if (err) {
          console.error("Update Error:", err);
          return res.status(500).json({ success: false, message: "Update failed" });
        }
        return res.json({
          success: true,
          redirect_url: `/admin/${route}-list/all`,
          message: "Record updated successfully",
        });
      });
    }
  } catch (err) {
    console.error("Exception:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const Show = async (req, res) => {
  try {
    const postId = req.params.postId;

    // 🔁 Dynamic variables
    const table_name = "books";
    const folder_path = "books";
    const route = "book";
    const module_name = "Book";

    // 1. Fetch book with category
    const courseQuery = `
      SELECT 
        ts.*, 
        c.category_name 
      FROM 
        \`${table_name}\` ts
      LEFT JOIN 
        categories c ON ts.category_id = c.id
      WHERE 
        ts.id = ?
    `;

    const post = await new Promise((resolve, reject) => {
      pool.query(courseQuery, [postId], (error, result) => {
        if (error) return reject(error);
        if (result.length === 0) return reject(new Error(`${module_name} not found`));
        resolve(result[0]);
      });
    });

    // 2. Parse comma-separated IDs
    const teacherIds = post.teacher_id
      ? post.teacher_id.split(',').map(id => parseInt(id.trim()))
      : [];

    const serviceIds = post.service_id
      ? post.service_id.split(',').map(id => parseInt(id.trim()))
      : [];

    // 3. Fetch teachers
    const teachers = await new Promise((resolve, reject) => {
      if (teacherIds.length === 0) return resolve([]);
      const query = `SELECT id, name FROM faculties WHERE id IN (?) AND status = 1 AND deleted_at IS NULL`;
      pool.query(query, [teacherIds], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // 4. Fetch services
    const services = await new Promise((resolve, reject) => {
      if (serviceIds.length === 0) return resolve([]);
      const query = `SELECT id, title FROM services WHERE id IN (?) AND status = 1 AND deleted_at IS NULL`;
      pool.query(query, [serviceIds], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // 5. Other counts (optional dynamic logic can be added later)
    const subjectCount = await Helper.getSubjectCountByCourseId(postId);
    const chapterCount = await Helper.getChapterCountByCourseId(postId);
    const pdfCount = await Helper.getPdfCountByCourseId(postId);
    const videoCount = await Helper.getVideoCountByCourseId(postId);
    const bookingCount = await Helper.getBookingCountByCourseId(postId);
    const testCount = await Helper.getTestCountByCourseId(postId);

    // 6. Render view
    res.render(`admin/${folder_path}/show`, {
      success: req.flash("success"),
      error: req.flash("error"),
      post,
      teachers,
      services,
      subjectCount,
      chapterCount,
      pdfCount,
      videoCount,
      bookingCount,
      testCount,
      form_url: `/admin/${route}-update/${postId}`,
      page_name: `${module_name} Details`,
      module_name,
      route,
      table_name
    });

  } catch (error) {
    console.error("Show Error:", error.message);
    req.flash("error", "An unexpected error occurred");
   // res.redirect("back");
  }
};


// const Booking = async (req, res) => {
//   try {
//     const courseId = req.params.courseId;
//     const status = req.query.status || "active";
//     const page_name = "Course Booking List";

//     // Build conditional WHERE clause
//     let whereClause = `WHERE co.order_type = 'course'`;
//     const params = [];

//     if (courseId) {
//       whereClause += ` AND co.course_id = ?`;
//       params.push(courseId);
//     }


//     const query = `
//       SELECT
//         co.id,
//         co.user_id,
//         u.name AS customer_name,
//         ts.course_name,
//         co.transaction_id,
//         co.payment_status,
//         co.order_status,
//         co.total_amount,
//         co.created_at,
//         co.updated_at
//       FROM course_orders co
//       JOIN front_users u ON u.id = co.user_id
//       JOIN courses ts ON ts.id = co.course_id
//       ${whereClause}
//       ORDER BY co.created_at DESC
//     `;

//     const courseQuery = `
//       SELECT 
//         ts.*, 
//         c.category_name 
//       FROM 
//         \`courses\` ts
//       LEFT JOIN 
//         categories c ON ts.category_id = c.id
//       WHERE 
//         ts.id = ?
//     `;

//     const course = await new Promise((resolve, reject) => {
//       pool.query(courseQuery, [courseId], (error, result) => {
//         if (error) return reject(error);
//         if (result.length === 0) return reject(new Error("Course not found"));
//         resolve(result[0]);
//       });
//     });
//     const [bookings] = await pool.promise().query(query, params);
//     const subjectCount = await Helper.getSubjectCountByCourseId(courseId);
//     const chapterCount = await Helper.getChapterCountByCourseId(courseId);
//     const pdfCount = await Helper.getPdfCountByCourseId(courseId);
//     const videoCount = await Helper.getVideoCountByCourseId(courseId);
//     const bookingCount = await Helper.getBookingCountByCourseId(courseId);
// const testCount = await Helper.getTestCountByCourseId(courseId);
//     res.render("admin/course/booking", {
//       success: req.flash("success"),
//       error: req.flash("error"),
//       bookings,
//       req,
//       page_name,
//       course,
//       subjectCount,
//       chapterCount,
//       pdfCount,
//       videoCount,
//       bookingCount,
//       testCount,
//       list_url: `/admin/course-booking-list/${courseId}`,
//       trashed_list_url: `/admin/course-booking-list/${courseId}?status=trashed`,
//       create_url: "/admin/course-booking-create",
//     });

//   } catch (error) {
//     console.error("CourseBooking List Error:", error);
//     req.flash("error", "Server error in listing course bookings");
//     res.redirect(req.get("Referrer") || "/");
//   }
// };

const Booking = async (req, res) => {
  try {
    const page_name = "Book Order List";

   const { search = '', order_source = '', payment_status = '', order_status = '', date_from = '', date_to = '', page = 1, per_page = '50' } = req.query;

    const limit = parseInt(per_page, 10) || 50;
    const currentPage = parseInt(page, 10);
    const offset = (currentPage - 1) * limit;

    // Build WHERE conditions
    let whereClause = 'WHERE 1=1';
    const params = [];

    if(search){
      whereClause += ` AND (bo.order_id LIKE ? OR u.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if(order_source){
      whereClause += ` AND bo.source = ?`;
      params.push(order_source);
    }

    if(payment_status){
      if(payment_status === 'paid'){
        whereClause += ` AND bo.payment_status IN (?, ?, ?)`;
        params.push('paid', 'completed', 'complete');
      } else {
        whereClause += ` AND bo.payment_status = ?`;
        params.push(payment_status);
      }
    }

    if(order_status){
      whereClause += ` AND bo.order_status = ?`;
      params.push(order_status);
    }

    if (date_from) {
  whereClause += ` AND DATE(bo.created_at) >= ?`;
  params.push(date_from);
}
if (date_to) {
  whereClause += ` AND DATE(bo.created_at) <= ?`;
  params.push(date_to);
}

    // Fetch total records for pagination
    const [[{ total }]] = await pool.promise().query(
      `SELECT COUNT(DISTINCT bo.id) as total
       FROM book_orders bo
       JOIN front_users u ON u.id = bo.user_id
       ${whereClause}`, params
    );
    const totalRecords = total;
    const totalPages = Math.ceil(totalRecords / limit);

    // Fetch orders
    const [rows] = await pool.promise().query(
      `SELECT bo.id, bo.order_id, bo.user_id, bo.transaction_id, bo.payment_status, bo.order_status,
              bo.source, bo.total_amount, bo.created_at, u.name AS customer_name,
              bod.id AS detail_id, bod.book_name AS item_name, bod.quantity, bod.book_price AS price,
              COUNT(bod.id) OVER (PARTITION BY bo.id) AS items_count
       FROM book_orders bo
       JOIN front_users u ON u.id = bo.user_id
       LEFT JOIN book_order_details bod ON bod.order_id = bo.id
       ${whereClause}
       ORDER BY bo.created_at DESC
       LIMIT ? OFFSET ?`, [...params, limit, offset]
    );

    // Group orders
    const ordersMap = new Map();
    rows.forEach(row => {
      if(!ordersMap.has(row.order_id)){
        ordersMap.set(row.order_id, {
          id: row.id,
          order_id: row.order_id,
          user_id: row.user_id,
          booking_source: row.source,
          transaction_id: row.transaction_id,
          payment_status: row.payment_status,
          order_status: row.order_status,
          total_amount: row.total_amount,
          created_at: row.created_at,
          customer_name: row.customer_name,
          items_count: row.items_count || 0,
          details: []
        });
      }
      if(row.detail_id){
        ordersMap.get(row.order_id).details.push({
          id: row.detail_id,
          item_name: row.item_name,
          quantity: row.quantity,
          price: row.price
        });
      }
    });

    const bookings = Array.from(ordersMap.values());

    // Start/end record numbers for display
    const startRecord = totalRecords === 0 ? 0 : offset + 1;
    const endRecord = offset + bookings.length;

    res.render("admin/books/booking", {
      bookings,
      page_name,
      query: req.query,
      totalPages,
      currentPage,
      per_page: limit,
      totalRecords,
      startRecord,
      endRecord
    });

  } catch(err){
    console.error(err);
    req.flash("error", "Server error in listing book bookings");
    res.redirect(req.get('Referrer') || '/');
  }
};





const BookingDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const page_name = "Book Order Details";

    if (!orderId) {
      req.flash("error", "Order ID is required");
      return res.redirect("/admin/book-booking-list");
    }

    // ✅ Fetch order + user info
    const [orderRows] = await pool.promise().query(
      `SELECT 
         bo.*,
         u.name AS customer_name,
         u.email AS customer_email,
         u.mobile AS customer_mobile
       FROM book_orders bo
       JOIN front_users u ON u.id = bo.user_id
       WHERE bo.id = ?`,
      [orderId]
    );

    if (!orderRows.length) {
      req.flash("error", "Order not found");
      return res.redirect("/admin/book-booking-list");
    }

    const order = orderRows[0];
    console.log(order); 
    // ✅ Fetch order items
    const [items] = await pool.promise().query(
      `SELECT 
         bod.id AS detail_id,
         bod.book_name AS item_name,
         bod.quantity,
         bod.book_price AS price,
         bod.offer_price,
         bod.total_price
       FROM book_order_details bod
       WHERE bod.order_id = ?`,
      [orderId]
    );

    // attach details
    order.items = items;
    order.items_count = items.length;
const [statusHistory] = await pool.promise().query(
  `SELECT 
     bos.previous_status,
     bos.new_status,
     bos.remark,
     bos.created_at,
     u.name AS updated_by_name
   FROM book_order_status bos
   LEFT JOIN users u ON bos.update_by = u.id
   WHERE bos.order_id = ?
   ORDER BY bos.created_at ASC`,
  [orderId]
);

    res.render("admin/books/booking-details", {
      success: req.flash("success"),
      error: req.flash("error"),
      order,
       statusHistory,
      req,
      page_name,
      back_url: "/admin/book-booking-list",
    });
  } catch (error) {
    console.error("Book Booking Details Error:", error);
    req.flash("error", "Server error in fetching booking details");
    res.redirect("/admin/book-booking-list");
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    const allowedStatuses = ['pending','confirmed','shipped','out_for_delivery','delivered','cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Get current status
    const [orderRows] = await pool.promise().query(
      'SELECT order_status FROM book_orders WHERE id = ?',
      [orderId]
    );

    if (!orderRows.length) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = orderRows[0].order_status;

    if (previousStatus === status) {
      return res.status(400).json({ success: false, message: 'Order already in this status' });
    }

    // Update order status
    await pool.promise().query(
      'UPDATE book_orders SET order_status = ?, updated_at = NOW() WHERE id = ?',
      [status, orderId]
    );

    // Insert into status tracking table
    await pool.promise().query(
      `INSERT INTO book_order_status 
       (order_id, previous_status, new_status, update_by, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [orderId, previousStatus, status, req.user?.id || null]
    );

    // Optional: If status is "processing", mark as confirmed
    const isConfirmed = status === 'processing';

    return res.json({ 
      success: true, 
      message: `Order status updated from "${previousStatus}" to "${status}"`,
      confirmed: isConfirmed
    });

  } catch (err) {
    console.error('Update Status Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


const Delete = async (req, res) => {
   await Helper.handleTableAction({
    req,
    res,
    action: "soft-delete",
    table_name,
    redirectUrl: `${actions_url}-list`,
    title: module_title,
  });
};

// Restore
const Restore = async (req, res) => {
  await Helper.handleTableAction({
    req,
    res,
    action: "restore",
    table_name,
    redirectUrl: `${actions_url}-list`,
    title: module_title,
  });
};

// Permanent Delete
const PermanentDelete = async (req, res) => {
  await Helper.handleTableAction({
    req,
    res,
    action: "delete",
    table_name,
    redirectUrl: `${actions_url}-list`,
    title: module_title,
  });
};

const bulkDelete = (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length) return res.json({ success: false, message: "No ${module_name} selected." });

  const placeholders = ids.map(() => "?").join(",");
  const sql = `UPDATE ${table_name} SET deleted_at = NOW(), status = 0 WHERE id IN (${placeholders})`;

  pool.query(sql, ids, (err, result) => {
    if (err) return res.json({ success: false, message: "Database error." });

    res.json({ success: true, message: `${result.affectedRows} ${module_name}(s) moved to trash.` });
  });
};

const bulkRestore = (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length) return res.json({ success: false, message: "No ${module_name} selected." });

  const placeholders = ids.map(() => "?").join(",");
  const sql = `UPDATE ${table_name} SET deleted_at = NULL, status = 1 WHERE id IN (${placeholders})`;

  pool.query(sql, ids, (err, result) => {
    if (err) return res.json({ success: false, message: "Database error." });

    res.json({ success: true, message: `${result.affectedRows} ${module_name}(s) restored.` });
  });
};


const { Parser } = require('json2csv');
const exportBooks = (req, res) => {
  const sql = `
    SELECT 
      b.id,
      b.book_name,
      b.title_heading,
      cat.category_name,
      cl.name AS class_name,
      b.price,
      b.discount,
      b.offer_price,
      b.description,
      b.content,
      CASE WHEN b.status = 1 THEN 'Active' ELSE 'Inactive' END AS status,
      b.discount_type,
      b.book_type,
      b.batch_year
    FROM books b
    LEFT JOIN categories cat ON b.category_id = cat.id
    LEFT JOIN course_classes cl ON b.class_id = cl.id
    LEFT JOIN centers cent ON b.center_id = cent.id
    WHERE b.deleted_at IS NULL
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error(err.stack);
      return res.status(500).json({ success: false, message: 'Database error.', error: err.message });
    }

    if (!results.length) {
      return res.status(404).json({ success: false, message: 'No book data found.' });
    }

    try {
      const fields = [
        'id',
        'book_name',
        'title_heading',
        'category_name',
        'class_name',
        'price',
        'discount',
        'offer_price',
        'description',
        'content',
        'status',
        'discount_type',
        'book_type',
        'batch_year'
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(results);

      // Generate filename with timestamp
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
      const filename = `books_export_${timestamp}.csv`;

      res.header('Content-Type', 'text/csv');
      res.attachment(filename);
      return res.send(csv);
    } catch (parseErr) {
      console.error(parseErr.stack);
      return res.status(500).json({ success: false, message: 'Error generating CSV.', error: parseErr.message });
    }
  });
};
module.exports = {
  Create,
  List,
  Edit,
  Update,
  Delete,
  Restore,
  PermanentDelete,
  Show,
    Booking,
  BookingDetails,
  updateOrderStatus,
  bulkRestore,
  bulkDelete,
  exportBooks
};
