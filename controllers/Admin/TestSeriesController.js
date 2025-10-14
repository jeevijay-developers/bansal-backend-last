const pool = require("../../db/database");
const randomstring = require("randomstring");
const Helper = require("../../helpers/Helper");
const jwt = require("jsonwebtoken");
const { validateRequiredFields } = require("../../helpers/validationsHelper");

const actions_url =  "/admin/test-series";
const table_name =  "test_series";
const module_title =  "Test Series";

const List = async (req, res) => {
  try {
    const userRoles = req.session.userRole || [];
    const userId = req.session.userId; // must exist in session
    const status = req.query.status || "active";

    let where =
      req.query.status === "trashed"
        ? "WHERE `test_series`.deleted_at IS NOT NULL"
        : "WHERE `test_series`.deleted_at IS NULL";

    const queryParams = [];
    if (userRoles.includes("Center")) {
      where += " AND `test_series`.created_by = ? ";
      queryParams.push(userId);
    }

    const query = `${withCategory()} ${where} ORDER BY \`test_series\`.id DESC`;

    const page_name =
      req.query.status === "trashed"
        ? "Trashed Test Series List"
        : "Test Series List";

    const customers = await new Promise((resolve, reject) => {
      pool.query(query, queryParams, (err, result) => {
        if (err) {
          req.flash("error", err.message);
          return reject(err);
        }
        resolve(result);
      });
    });

    const actions_url = "/admin/test-series"; // ✅ define it

    res.render("admin/test-series/list", {
      success: req.flash("success"),
      error: req.flash("error"),
      customers,
      req,
      page_name,
      actions_url, // ✅ now valid
      status,
      list_url: "/admin/test-series-list",
      trashed_list_url: "/admin/test-series-list/?status=trashed",
      create_url: "/admin/test-series-create",
    });
  } catch (error) {
    console.error("test-series List Error:", error);
    req.flash("error", error.message);
    res.redirect("back"); // ✅ restore redirect
  }
};

const withCategory = () => `
  SELECT \`test_series\`.*, categories.category_name
  FROM \`test_series\`
  LEFT JOIN categories ON \`test_series\`.category_id = categories.id
`;

const Create = async (req, res) => {
  try {
    const categories = await getCategoriesFromTable(); // Fetch data from services_table

    res.render("admin/test-series/create", {
      success: req.flash("success"),
      error: req.flash("error"),
      form_url: "/admin/test-series-update",
      page_name: "Create Test Series",
      action: "Create",

      course: [],
      categories: categories,
    });
  } catch (error) {
    console.log(error.message);
  }
};

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

const fs = require("fs");
const path = require("path");

const checkImagePath = (relativePath) => {
  const normalizedPath = path.normalize(relativePath);
  const fullPath = path.join(__dirname, "..", "public", normalizedPath);
  return fs.existsSync(fullPath);
};

// Helper to run SQL queries
const runQuery = (query, params = []) =>
  new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

const Edit = async (req, res) => {
  try {
    const courseId = req.params.postId;
    const visibility = ["featured", "up_comming"];

    // Fetch course
    const courseResult = await runQuery(
      "SELECT * FROM `test_series` WHERE id = ?",
      [courseId]
    );
    if (courseResult.length === 0) {
      req.flash("error", "Test Series not found");
      return res.redirect("/admin/test-series-list");
    }
    const course = courseResult[0];

    // Fetch categories and course classes
    const categories = await Helper.getActiveCategoriesByType();
    const course_classes = await Helper.getActiveCourseClasses();

    // Check image existence
    const imageExists = checkImagePath(course.image);
    const detailsImageExists = checkImagePath(course.details_image);

    res.render("admin/test-series/create", {
      success: req.flash("success"),
      error: req.flash("error"),
      course,
      categories,
      course_classes,
      visibility,
      form_url: `/admin/test-series-update/${courseId}`,
      page_name: "Edit",
         action: "Update",
      image: imageExists
        ? course.image
        : "admin/images/default-featured-image.png",
      details_image: detailsImageExists
        ? course.details_image
        : "admin/images/default-featured-image.png",
    });
  } catch (error) {
    console.error("Edit Error:", error.message);
    req.flash("error", error.message);
    res.redirect(req.get("referer") || "/admin/test-series-list");
  }
};
const Update = async (req, res) => {
  const courseId = req.params.postId;
  const isInsert = !courseId || courseId === "null" || courseId === "0";

  const {
    category_id,
    sort_order,
    name,
    title_heading,
    slug: inputSlug,
    type,
    price,
    discount_type,
    discount,
    short_description,
    description,
    status,
    start_time,
    end_time,
  } = req.body;

  const imageFile = req?.files?.image?.[0];
  const detailsImageFile = req?.files?.details_image?.[0];

  let slug = inputSlug?.trim();
  if (!slug && name) {
    slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const errors = {};
  if (!category_id?.trim()) errors.category_id = ["Category ID is required"];
  if (!sort_order?.trim()) errors.sort_order = ["Sort Order is required"];
  if (!name?.trim()) errors.name = ["Name is required"];
  if (!title_heading?.trim())
    errors.title_heading = ["Title heading is required"];
  if (!short_description?.trim())
    errors.short_description = ["Short Description is required"];
  if (!slug) errors.slug = ["Slug is required"];
  if (!["free", "paid"].includes(type))
    errors.type = ["Course type must be 'free' or 'paid'"];

  if (type === "paid") {
    if (!price || isNaN(price)) {
      errors.price = ["Price is required and must be a number"];
    }

    if (!discount_type?.trim()) {
      errors.discount_type = ["Discount type is required"];
    }

    if (discount && isNaN(discount)) {
      errors.discount = ["Discount must be numeric"];
    }
  }

  if (!description?.trim()) errors.description = ["Description is required"];

  if (!start_time?.trim()) errors.start_time = ["Start time is required"];
  if (!end_time?.trim()) errors.end_time = ["End time is required"];

  if (isInsert) {
    if (!imageFile) errors.image = ["Course image is required"];
    if (!detailsImageFile) errors.details_image = ["Details image is required"];
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      success: false,
      errors,
      message: Object.values(errors)[0][0],
    });
  }

  let offer_price = 0;
  const parsedPrice = parseFloat(price || 0);
  const parsedDiscount = parseFloat(discount || 0);

  if (type === "paid" && !isNaN(parsedPrice)) {
    if (discount_type === "percentage" && !isNaN(parsedDiscount)) {
      offer_price = parsedPrice - (parsedPrice * parsedDiscount) / 100;
    } else if (discount_type === "price" && !isNaN(parsedDiscount)) {
      offer_price = parsedPrice - parsedDiscount;
    } else {
      offer_price = parsedPrice;
    }
    if (offer_price < 0) offer_price = 0;
  }

  const data = {
    category_id: category_id.trim(),
    sort_order,
    name: name.trim(),
    title_heading: title_heading.trim(),
    slug,
    type,
    price,
    discount_type,
    discount,
    short_description,
    description,
    status,
    start_time, // New field
    end_time, // New field
    offer_price,
  };

  if (type === "free") {
    data.price = 0;
    data.discount_type = "";
    data.discount = 0;
  }

  if (imageFile) {
    data.image = path.join("/uploads/test-series", imageFile.filename);
  }
  if (detailsImageFile) {
    data.details_image = path.join(
      "/uploads/test-series",
      detailsImageFile.filename
    );
  }

  try {
    const fields = Object.keys(data);
    const values = Object.values(data);

    if (isInsert) {
      const insertQuery = `INSERT INTO \`test_series\` (${fields.join(
        ", "
      )}) VALUES (${fields.map(() => "?").join(", ")})`;
      pool.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error("Insert error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Insert failed" });
        }
        return res.json({
          success: true,
          redirect_url: "/admin/test-series-list",
          message: "Test series created successfully",
        });
      });
    } else {
      const updateQuery = `UPDATE \`test_series\` SET ${fields
        .map((field) => `${field} = ?`)
        .join(", ")} WHERE id = ?`;
      values.push(courseId);
      pool.query(updateQuery, values, (err, result) => {
        if (err) {
          console.error("Update error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Update failed" });
        }
        return res.json({
          success: true,
          redirect_url: "/admin/test-series-list",
          message: "Test series updated successfully",
        });
      });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const Show = async (req, res) => {
  try {
    const postId = req.params.postId;

    const query = `
  SELECT 
    ts.*, 
    c.category_name 
  FROM 
    \`test_series\` ts
  LEFT JOIN 
    categories c ON ts.category_id = c.id
  WHERE 
    ts.id = ?
`;
    const post = await new Promise((resolve, reject) => {
      pool.query(query, [postId], (error, result) => {
        if (error) {
          console.error("Database Error:", error);
          req.flash("error", "Failed to fetch test series");
          return reject(error);
        }
        if (result.length === 0) {
          req.flash("error", "Test series not found");
          return reject(new Error("Not found"));
        }
        resolve(result[0]);
      });
    });
    post.start_time = await Helper.formatDate(post.start_time);
    post.end_time = await Helper.formatDate(post.end_time);
    res.render("admin/test-series/show", {
      success: req.flash("success"),
      error: req.flash("error"),
      post: post, // still using `customer` for compatibility with view
      form_url: `/admin/test-series-update/${postId}`,
      page_name: "Test Series Detials",
    });
  } catch (error) {
    console.error("Show Error:", error.message);
    req.flash("error", "An unexpected error occurred");
    res.redirect("back");
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
  const { ids } = req.body; // array of IDs

  if (!ids || !ids.length) {
    return res.json({ success: false, message: `No ${module_title} selected.` });
  }

  const placeholders = ids.map(() => "?").join(",");
  const sql = `UPDATE ?? SET deleted_at = NOW(), status = 0 WHERE id IN (${placeholders})`;

  pool.query(sql, [table_name, ...ids], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Database error." });
    }

    return res.json({
      success: true,
      message: `${result.affectedRows} ${module_title}(s) moved to trash successfully.`,
    });
  });
};

const bulkRestore = (req, res) => {
  const { ids } = req.body;

  if (!ids || !ids.length) {
    return res.json({ success: false, message: `No ${module_title} selected.` });
  }

  const placeholders = ids.map(() => "?").join(",");
  const sql = `UPDATE ?? SET deleted_at = NULL, status = 1 WHERE id IN (${placeholders})`;

  pool.query(sql, [table_name, ...ids], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Database error." });
    }

    return res.json({
      success: true,
      message: `${result.affectedRows} ${module_title}(s) restored successfully.`,
    });
  });
};



const { Parser } = require('json2csv'); // Ensure json2csv is installed

const exportTestSeries = (req, res) => {
  const sql = `
    SELECT 
      ts.id,
      ts.name,
      ts.title_heading,
      ts.slug,
      cat.category_name,
      ts.type,
      ts.price,
      ts.discount,
      ts.offer_price,
      ts.start_time,
      ts.end_time,
    
      CASE WHEN ts.status = 1 THEN 'Active' ELSE 'Inactive' END AS status,
      ts.discount_type
    FROM test_series ts
    LEFT JOIN categories cat ON ts.category_id = cat.id
    WHERE ts.deleted_at IS NULL
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error(err.stack);
      return res.status(500).json({
        success: false,
        message: 'Database error.',
        error: err.message
      });
    }

    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: 'No test series data found.'
      });
    }

    try {
      const fields = [
        'id',
        'name',
        'title_heading',
        'slug',
        'category_name',
        'type',
        'price',
        'discount',
        'offer_price',
        'start_time',
        'status',
        'discount_type'
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(results);

      // Generate filename with timestamp
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
      const filename = `test_series_export_${timestamp}.csv`;

      res.header('Content-Type', 'text/csv');
      res.attachment(filename);
      return res.send(csv);
    } catch (parseErr) {
      console.error(parseErr.stack);
      return res.status(500).json({
        success: false,
        message: 'Error generating CSV.',
        error: parseErr.message
      });
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
    bulkDelete,
  bulkRestore,
  exportTestSeries
};
