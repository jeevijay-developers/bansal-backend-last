const pool = require("../../db/database");
const randomstring = require("randomstring");
const Helper = require("../../helpers/Helper");
const jwt = require("jsonwebtoken");
const { validateRequiredFields } = require("../../helpers/validationsHelper");

const actions_url = "/admin/faculty";
const table_name = "faculties";
const module_title = "Faculty";
// const List = async (req, res) => {
//   try {
//     const userRoles = req.session.userRole || [];
//     const userId = req.session.userId; // assuming you store it in session
//     const status = req.query.status || "active";
//     let where =
//       req.query.status === "trashed"
//         ? "WHERE faculties.deleted_at IS NOT NULL"
//         : "WHERE faculties.deleted_at IS NULL";
//     // if (userRoles.includes("Center")) {
//     //   where += " AND faculties.created_by = ? ";
//     // }
//     const query = `
//       SELECT
//         faculties.*,
//         categories.category_name
//       FROM faculties
//       LEFT JOIN categories ON faculties.category_id = categories.id
//       ${where}
//       ORDER BY faculties.id DESC`;
//     const page_name =
//       req.query.status === "trashed" ? "Trashed Faculty List" : "Faculty List";

//     // Fetching data from MySQL
//     const customers = await new Promise((resolve, reject) => {
//       pool.query(query, (err, result) => {
//         if (err) {
//           req.flash("error", err.message);
//           return reject(err);
//         }
//         resolve(result);
//       });
//     });

//     // Rendering the list page
//     res.render("admin/faculty/list", {
//       success: req.flash("success"),
//       error: req.flash("error"),
//       customers,
//       req,
//       page_name,
//       list_url: "/admin/faculty-list",
//       actions_url: actions_url, // pass this to dynamically build URLs in EJS
//       status,
//       trashed_list_url: "/admin/faculty-list/?status=trashed",
//       create_url: "/admin/faculty-create",
//     });
//   } catch (error) {
//     console.error("Faculty List Error:", error);
//     req.flash("error", error.message);
//     res.redirect(req.get("Referrer") || "/admin/faculty-list");
//   }
// };


const List = async (req, res) => {
  try {
    const userRoles = req.session.userRole || [];
    const userId = req.session.adminUserId; // assuming you store it in session
    const status = req.query.status || "active";

    let where =
      req.query.status === "trashed"
        ? "WHERE faculties.deleted_at IS NOT NULL"
        : "WHERE faculties.deleted_at IS NULL";

    // Add role-based filtering
    if (userRoles.includes("Center")) {
      where += " AND faculties.created_by = ? ";
    }

    const query = `
      SELECT 
        faculties.*, 
        categories.category_name  
      FROM faculties 
      LEFT JOIN categories ON faculties.category_id = categories.id 
      ${where} 
      ORDER BY faculties.id DESC
    `;

    // Params for query
    const queryParams = [];
    if (userRoles.includes("Center")) {
      queryParams.push(userId);
    }

    const page_name =
      req.query.status === "trashed" ? "Trashed Faculty List" : "Faculty List";

    // Fetching data from MySQL
    const customers = await new Promise((resolve, reject) => {
      pool.query(query, queryParams, (err, result) => {
        if (err) {
          req.flash("error", err.message);
          return reject(err);
        }
        resolve(result);
      });
    });

    // Rendering the list page
    res.render("admin/faculty/list", {
      success: req.flash("success"),
      error: req.flash("error"),
      customers,
      req,
      page_name,
      list_url: "/admin/faculty-list",
      actions_url: actions_url, // make sure actions_url is defined above
      status,
      trashed_list_url: "/admin/faculty-list/?status=trashed",
      create_url: "/admin/faculty-create",
    });
  } catch (error) {
    console.error("Faculty List Error:", error);
    req.flash("error", error.message);
    res.redirect(req.get("Referrer") || "/admin/faculty-list");
  }
};
// const List = async (req, res) => {
//   try {
//     const userRoles = req.session.userRole || [];
//     const userId = req.session.adminUserId; // assuming you store it in session
//     const status = req.query.status || "active";

//     let where =
//       req.query.status === "trashed"
//         ? "WHERE faculties.deleted_at IS NOT NULL"
//         : "WHERE faculties.deleted_at IS NULL";

//     // Add role-based filtering
//     if (userRoles.includes("Center")) {
//       where += " AND faculties.created_by = ? ";
//     }

//     const query = `
//       SELECT 
//         faculties.*, 
//         categories.category_name  
//       FROM faculties 
//       LEFT JOIN categories ON faculties.category_id = categories.id 
//       ${where} 
//       ORDER BY faculties.id DESC
//     `;

//     // Params for query
//     const queryParams = [];
//     if (userRoles.includes("Center")) {
//       queryParams.push(userId);
//     }

//     const page_name =
//       req.query.status === "trashed" ? "Trashed Faculty List" : "Faculty List";

//     // Fetching data from MySQL
//     const customers = await new Promise((resolve, reject) => {
//       pool.query(query, queryParams, (err, result) => {
//         if (err) {
//           req.flash("error", err.message);
//           return reject(err);
//         }
//         resolve(result);
//       });
//     });

//     // Rendering the list page
//     res.render("admin/faculty/list", {
//       success: req.flash("success"),
//       error: req.flash("error"),
//       customers,
//       req,
//       page_name,
//       list_url: "/admin/faculty-list",
//       actions_url: actions_url, // make sure actions_url is defined above
//       status,
//       trashed_list_url: "/admin/faculty-list/?status=trashed",
//       create_url: "/admin/faculty-create",
//     });
//   } catch (error) {
//     console.error("Faculty List Error:", error);
//     req.flash("error", error.message);
//     res.redirect(req.get("Referrer") || "/admin/faculty-list");
//   }
// };

const Create = async (req, res) => {
  try {
    const categories = await getCategoriesFromTable();

    let post = {};

    res.render("admin/faculty/create", {
      success: req.flash("success"),
      error: req.flash("error"),
      form_url: "/admin/faculty-update",
      page_name: "Create Faculty",
      action: "Create",
      post: post,
      categories: categories,
    });
  } catch (error) {
    console.log(error.message);
    req.flash("error", "An error occurred while fetching data.");
    res.redirect("/admin/faculty-list");
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

  console.log("Server checking for file at:", fullPath);

  return fs.existsSync(fullPath);
};

const Edit = async (req, res) => {
  try {
    const postId = req.params.postId;

    const getCourseQuery = "SELECT * FROM faculties WHERE id = ?";

    const post = await new Promise((resolve, reject) => {
      pool.query(getCourseQuery, [postId], function (error, result) {
        if (error) {
          req.flash("error", error.message);
          return reject(error);
        }

        resolve(result[0]); // Ensure result[0] contains course data
      });
    });

    const getCategoriesQuery = "SELECT * FROM categories";
    const categories = await new Promise((resolve, reject) => {
      pool.query(getCategoriesQuery, function (error, result) {
        if (error) {
          req.flash("error", error.message);
          return reject(error);
        }
        resolve(result);
      });
    });

    // Fetch course classes from the database

    const imageExists = checkImagePath(post.image);

    res.render("admin/faculty/create", {
      success: req.flash("success"),
      error: req.flash("error"),
      post: post, // Pass the course details to the view
      categories: categories, // Pass the categories for the select dropdown

      form_url: "/admin/faculty-update/" + postId, // URL for the update form
      page_name: "Edit",
      action: "Update",
      image: imageExists
        ? `${post.image}`
        : "admin/images/default-featured-image.png",
    });
  } catch (error) {
    console.error("Edit Error:", error.message);
    req.flash("error", error.message);
    res.redirect("back");
  }
};
const Update = async (req, res) => {
  const facultyId = req.params.postId;

  console.log(req.body);
  const isInsert = !facultyId || facultyId === "null" || facultyId === "0";

  const {
    category_id,
    name,
    email,
    phone,
    subject,
    experience,
    teaching_mode,
    short_description,
    description,
    status,
    created_by, // <-- take from body OR req.user.id
  } = req.body;

  const imageFile = req?.files?.image?.[0];

  // Slug generation (optional)
  let slug = name
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  // Validation
  const errors = {};
  if (!category_id?.trim()) errors.category_id = ["Category is required"];
  if (!name?.trim()) errors.name = ["Name is required"];
  if (!email?.trim()) errors.email = ["Email is required"];
  if (!phone?.trim()) errors.phone = ["Phone is required"];
  if (!subject?.trim()) errors.subject = ["Subject is required"];
  if (!experience?.trim()) errors.experience = ["Experience is required"];
  if (!["online", "offline"].includes(teaching_mode))
    errors.teaching_mode = ["Teaching mode must be 'online' or 'offline'"];
  if (!short_description?.trim())
    errors.short_description = ["Short description is required"];
  if (!description?.trim()) errors.description = ["Description is required"];
  if (!["0", "1"].includes(status))
    errors.status = ["Status must be '0' or '1'"];

  if (isInsert && !imageFile) {
    errors.image = ["Faculty image is required"];
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      success: false,
      errors,
      message: Object.values(errors)[0][0],
    });
  }

  // Prepare data
  const data = {
    category_id: category_id.trim(),
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    subject: subject.trim(),
    experience: experience.trim(),
    teaching_mode,
    short_description: short_description.trim(),
    description: description.trim(),
    status,
    created_by: created_by || req.user?.id || null, // <-- safe fallback

  };

  // Add image path if uploaded
  if (imageFile) {
    data.image = `/uploads/faculty/${imageFile.filename}`;
  }

  try {
    if (isInsert) {
      const fields = Object.keys(data);
      const placeholders = fields.map(() => "?");
      const values = fields.map((key) => data[key]);

      const insertQuery = `INSERT INTO faculties (${fields.join(
        ", "
      )}) VALUES (${placeholders.join(", ")})`;

      pool.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ success: false, message: "Insert failed" });
        }
        return res.json({
          success: true,
          redirect_url: "/admin/faculty-list",
          message: "Faculty created successfully",
        });
      });
    } else {
      const fields = Object.keys(data);
      const setClause = fields.map((field) => `${field} = ?`).join(", ");
      const values = fields.map((key) => data[key]);
      values.push(facultyId);

      const updateQuery = `UPDATE faculties SET ${setClause} WHERE id = ?`;

      pool.query(updateQuery, values, (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ success: false, message: "Update failed" });
        }
        return res.json({
          success: true,
          redirect_url: "/admin/faculty-list",
          message: "Faculty updated successfully",
        });
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const Show = async (req, res) => {
  const facultyId = req.params.postId;

  try {
    const query = `
      SELECT 
        faculties.*, 
        categories.category_name 
      FROM faculties 
      LEFT JOIN categories ON faculties.category_id = categories.id 
      WHERE faculties.id = ? 
      LIMIT 1
    `;

    const faculty = await new Promise((resolve, reject) => {
      pool.query(query, [facultyId], (err, result) => {
        if (err) {
          req.flash("error", err.message);
          return reject(err);
        }
        if (result.length === 0) {
          req.flash("error", "Faculty not found");
          return reject(new Error("Faculty not found"));
        }
        resolve(result[0]);
      });
    });

    res.render("admin/faculty/show", {
      success: req.flash("success"),
      error: req.flash("error"),
      faculty,
      req,
      page_name: "Faculty Details",
      back_url: "/admin/faculty-list",
    });
  } catch (error) {
    console.error("Faculty Show Error:", error);
    req.flash("error", error.message);
    res.redirect("/admin/faculty-list");
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

const { Parser } = require('json2csv'); // Make sure json2csv is installed
const ExportTeachers = async (req, res) => {
  const sql = `
    SELECT 
      id,
      name,
      email,
      phone,
      subject,
      short_description,
      description,
      image,
      detail,
      help_stu,
      experience,
      styles,
      about,
      certifications,
      level,
      about_teacher,
      teaching_mode,
      CASE WHEN status = 1 THEN 'Active' ELSE 'Inactive' END AS status
    
    FROM faculties
    WHERE deleted_at IS NULL
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error(err.stack);
      return res.status(500).json({ success: false, message: 'Database error.', error: err.message });
    }

    if (!results.length) {
      return res.status(404).json({ success: false, message: 'No teacher data found.' });
    }

    try {
      const fields = [
        'id',
        'name',
        'email',
        'phone',
        'subject',
        'short_description',
        'description',
        'image',
        'detail',
        'help_stu',
        'experience',
        'styles',
        'about',
        'certifications',
        'level',
        'about_teacher',
        'teaching_mode',
        'status'
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(results);

      // Generate filename with local date-time
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
      const filename = `faculties_export_${timestamp}.csv`;

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
  bulkRestore,
  bulkDelete,
  ExportTeachers
};
