const CenterModels = require("../../models/CenterModels");
const Helper = require("../../helpers/Helper");
const path = require("path");
const fs = require("fs");
const pool = require("../../db/database");
const { table } = require("console");
const bcrypt = require("bcrypt"); // at the top of your controller
const checkImagePath = (relativePath) => {
  if (!relativePath) return false;
  const fullPath = path.join(
    __dirname,
    "..",
    "public",
    path.normalize(relativePath)
  );
  return fs.existsSync(fullPath);
};

const module_name = "User";

const handleError = (res, error, context = "Unknown") => {
  console.error(`Error in ${context}:`, error);
  res.status(500).render("admin/error", {
    title: "Server Error",
    page_name: `${module_name} - ${context}`,
    error_message: error.message,
    stack: error.stack,
    full_error: error,
  });
};

const renderForm = async (res, options) => {
  const {
    postId,
    center,
    action,
    formUrl,
    pageName,
    error,
    success,
    userRoles,
  } = options;
  const categories = await Helper.getActiveCategoriesByType();
  const testSeries = await Helper.getActiveTestSeries();
  const service_cities = await Helper.getServicableCities();
  res.render("admin/users/create", {
    success,
    error,
    categories,
    testSeries,
    form_url: formUrl,
    page_name: pageName,
    service_cities,
    action,
    userRoles,
    center, // now center is defined
    image:
      center && checkImagePath(center.image)
        ? center.image
        : "admin/images/default-featured-image.png",
  });
};

// const handleError = (res, req, message, redirectUrl = "back") => {
//   req.flash("error", message);
//   return res.redirect(redirectUrl);
// };

module.exports = {
List: async (req, res) => {
  try {
    // Determine status from query parameter
    const status = req.query.status === "trashed" ? "trashed" : "active";

    // Base SQL query
    let query = `
      SELECT users.id, users.name, users.email, users.mobile, users.status, 
             users.profile_image, roles.name AS role_name
      FROM users
      LEFT JOIN roles ON users.role_id = roles.id
      WHERE users.role_id NOT IN (1, 3)
    `;

    // Add condition for active/trashed users
     if (status === "trashed") {
      query += " AND users.deleted_at IS NOT NULL";
    } else {
      query += " AND users.deleted_at IS NULL";
    }

    query += " ORDER BY users.id DESC";

    // Execute query
    const [users] = await pool.promise().query(query);

    // Render EJS view
    res.render("admin/users/list", {
      success: req.flash("success"),
      error: req.flash("error"),
      customers: users,
      req,
      page_name: status === "trashed" ? "Trashed User List" : "User List",
      list_url: "/admin/user-list",
      trashed_list_url: "/admin/user-list/?status=trashed",
      create_url: "/admin/user-create",
      publicUrl: "/public", // for images or assets
    });
  } catch (error) {
    console.error("List Error:", error);
    handleError(res, error, "Server error in listing data");
  }
},
Show: async (req, res) => {
  try {
    const userId = req.params.postId; // Assuming postId is the user ID

    // Fetch user with role name
    const query = `
      SELECT u.id, u.name,u.original_password, u.email, u.mobile, u.status, u.profile_image, u.created_at,
             r.name AS role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `;

    const [rows] = await pool.promise().query(query, [userId]);
    const user = rows[0];

    if (!user) {
      return handleError(res, { message: "User not found" }, "User not found");
    }

    res.render("admin/users/show", {
      success: req.flash("success"),
      error: req.flash("error"),
      user: user,
      list_url: "/admin/user-list",
      page_name: "User Details",
      publicUrl: "/public" // Needed for image paths
    });
  } catch (error) {
    console.error("Show Error:", error);
    handleError(res, error, "An unexpected error occurred");
  }
},


 Edit: async (req, res) => {
  try {
    const userId = req.params.postId;

    // Fetch user details with role name
    const [rows] = await pool.promise().query(
      `SELECT id, name, email, mobile, role_id, status, profile_image, original_password
       FROM users 
       WHERE id = ? LIMIT 1`,
      [userId]
    );


    if (rows.length === 0) {
      req.flash("error", "User not found");
      return res.redirect("/admin/user-list");
    }

    const user = rows[0];
    console.log(user); 
    // Fetch all roles for dropdown
     const [userRoles] = await pool
        .promise()
        .query(
          "SELECT id, name FROM roles WHERE status = 1 AND name != 'admin'"
        );

          const [userRole] = await pool.promise().query(
        'SELECT role_id FROM user_roles WHERE user_id = ?',
        [userId]
      );
    res.render("admin/users/create", {
      success: req.flash("success"),
      error: req.flash("error"),
      form_url: `/admin/user-update/${userId}`,
      page_name: "Edit User",
      action: "Update",
      userRoles,
      userRole,
      user, // Pass user data
      image:
        user.profile_image && checkImagePath(user.profile_image)
          ? user.profile_image
          : "admin/images/default-featured-image.png",
    });

  } catch (error) {
    console.error("Edit Error:", error);
    handleError(res, error, "Error while loading edit page");
  }
},


  Create: async (req, res) => {
    try {
      const [userRoles] = await pool
        .promise()
        .query(
          "SELECT id, name FROM roles WHERE status = 1 AND name != 'admin'"
        );
      // const [userRoles] = await pool.promise().query(
      //   'SELECT role_id FROM user_roles WHERE user_id = ?',
      //   [userId]
      // );

      res.render("admin/users/create", {
        success: req.flash("success"),
        error: req.flash("error"),
        form_url: "/admin/user-update",
        page_name: "Create User",
        action: "Create",
        userRoles,
        user: null,
        image: "admin/images/default-featured-image.png",
      });
    } catch (error) {
      console.error("Create Error:", error);
      handleError(res, req, error.message, "/admin/user-list");
    }
  },

  Update: async (req, res) => {
  try {
    const postId = req.params.postId; // User ID
    const { name, email, mobile, roles, status, password } = req.body;

    if (!name || !email || !mobile || !roles || !status) {
      return res.json({
        success: false,
        message: "All fields are required.",
      });
    }

    let hashedPassword = null;
    let original_password = "";
    if (password?.trim()) {
      hashedPassword = await bcrypt.hash(password, 10);
      original_password = password;
    }

    // Handle profile image upload
    let profileImage = null;
    if (req.files?.profile_image?.length > 0) {
      profileImage = `/uploads/users/${req.files.profile_image[0].filename}`;
    }

    if (!postId) {
      // ---------- CREATE NEW USER ----------
      const insertUserQuery = `
        INSERT INTO users (name, email, mobile, password, original_password, role_id, status, profile_image, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const insertUserValues = [
        name,
        email,
        mobile,
        hashedPassword,
        original_password,
        roles,
        status,
        profileImage,
      ];

      const [userResult] = await pool.promise().query(insertUserQuery, insertUserValues);
      const userId = userResult.insertId;

      // Insert into user_roles
      await pool.promise().query(
        `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
        [userId, roles]
      );

      return res.json({
        success: true,
        redirect_url: "/admin/user-list",
        message: "User created successfully",
      });
    } else {
      // ---------- UPDATE EXISTING USER ----------
      const updateQuery = `
        UPDATE users SET name = ?, email = ?, mobile = ?, role_id = ?, status = ?, updated_at = NOW()
        ${hashedPassword ? ", password = ?, original_password = ?" : ""}
        ${profileImage ? ", profile_image = ?" : ""}
        WHERE id = ?
      `;

      const updateValues = [name, email, mobile, roles, status];

      if (hashedPassword) {
        updateValues.push(hashedPassword, original_password);
      }
      if (profileImage) {
        updateValues.push(profileImage);
      }
      updateValues.push(postId);

      await pool.promise().query(updateQuery, updateValues);

      // Update user_roles (delete old roles and insert new one)
      await pool.promise().query(`DELETE FROM user_roles WHERE user_id = ?`, [postId]);
      await pool.promise().query(
        `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
        [postId, roles]
      );

      return res.json({
        success: true,
        redirect_url: "/admin/user-list",
        message: "User updated successfully",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
},


  //   Update: async (req, res) => {

  //     try {
  //       const postId = req.params.postId;

  //       const {
  //         city_id,
  //         name,
  //         email,
  //         mobile,
  //         roles,
  //         address,
  //         map_url,
  //         status,
  //         password,
  //         description // ✅ Add this
  //       } = req.body;

  //         const slug = Helper.generateSlug(name);

  //       if (!city_id || !name || !email || !mobile || !roles || !address || !map_url || !status) {
  //         return res.json({ success: false, message: "All fields are required." });
  //       }

  //       let hashedPassword = null;
  //       let original_password = "";
  //       if (password?.trim()) {
  //         hashedPassword = await bcrypt.hash(password, 10);
  //         original_password = password;
  //       }

  //       // Handle logo upload
  //       let logoPath = null;
  //       if (req.files?.logo?.length > 0) {
  //         logoPath = `/uploads/centers/${req.files.logo[0].filename}`;
  //       }

  //       if (!postId) {
  //         // ---- CREATE ----

  //         // Insert user first
  //         const userQuery = `
  //   INSERT INTO users (name, email, mobile, password, original_password, role_id, status, created_at, updated_at)
  //   VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  // `;

  //         const userValues = [name, email, mobile, hashedPassword, original_password, roles, status];

  //         const userId = await new Promise((resolve, reject) => {
  //           pool.query(userQuery, userValues, (err, result) => {
  //             if (err) return reject(err);
  //             resolve(result.insertId);
  //           });
  //         });

  //         // Insert center
  //         const centerQuery = `
  //       INSERT INTO centers (user_id, city_id, name, slug, email, mobile, roles, address, map_url, status, logo, description, created_at)
  // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  //       `;
  //         const centerValues = [
  //           userId,
  //           city_id,
  //           name,
  //            slug,
  //           email,
  //           mobile,
  //           roles,
  //           address,
  //           map_url,
  //           status,
  //           logoPath,
  //           description,
  //         ];

  //         await new Promise((resolve, reject) => {
  //           pool.query(centerQuery, centerValues, (err) => {
  //             if (err) return reject(err);
  //             resolve();
  //           });
  //         });

  //         return res.json({
  //           success: true,
  //           redirect_url: "/admin/user-list",
  //           message: "Center created successfully"
  //         });

  //       } else {
  //         // ---- UPDATE ----

  //         // Get user_id from center table using postId
  //         const [center] = await new Promise((resolve, reject) => {
  //           pool.query(`SELECT user_id FROM centers WHERE id = ?`, [postId], (err, result) => {
  //             if (err) return reject(err);
  //             resolve(result);
  //           });
  //         });

  //         if (!center) {
  //           return res.json({ success: false, message: "Center not found" });
  //         }

  //         const userId = center.user_id;

  //         // Update user
  //         const userUpdateQuery = `
  //   UPDATE users SET name = ?, email = ?, mobile = ?, role_id = ?, status = ?, updated_at = NOW()
  //   ${hashedPassword ? ", password = ?, original_password = ?" : ""}
  //   WHERE id = ?
  // `;

  //         const userUpdateValues = hashedPassword
  //           ? [name, email, mobile, roles, status, hashedPassword, original_password, userId]
  //           : [name, email, mobile, roles, status, userId];

  //         await new Promise((resolve, reject) => {
  //           pool.query(userUpdateQuery, userUpdateValues, (err) => {
  //             if (err) return reject(err);
  //             resolve();
  //           });
  //         });

  //   const centerUpdateQuery = `
  //   UPDATE centers SET city_id = ?, name = ?, slug = ?, email = ?, mobile = ?, roles = ?, address = ?, map_url = ?, status = ?, description = ?, updated_at = NOW()
  //   ${logoPath ? ", logo = ?" : ""}
  //   WHERE id = ?
  // `;

  // const centerUpdateValues = logoPath
  //   ? [city_id, name, slug, email, mobile, roles, address, map_url, status, description, logoPath, postId]
  //   : [city_id, name, slug, email, mobile, roles, address, map_url, status, description, postId];

  //         await new Promise((resolve, reject) => {
  //           pool.query(centerUpdateQuery, centerUpdateValues, (err) => {
  //             if (err) return reject(err);
  //             resolve();
  //           });
  //         });

  //         return res.json({
  //           success: true,
  //           redirect_url: "/admin/user-list",
  //           message: "Center updated successfully"
  //         });
  //       }

  //     } catch (error) {
  //       console.error("Error:", error);
  //       return res.json({
  //         success: false,
  //         message: "Something went wrong",
  //         error: error.message
  //       });
  //     }
  //   },
  Delete: async (req, res) => {
    try {
      const centerId = req.params.postId;

      // First, fetch the center to get user_id
      const userId = await new Promise((resolve, reject) => {
        const fetchCenterQuery = `SELECT user_id FROM centers WHERE id = ? AND deleted_at IS NULL`;
        pool.query(fetchCenterQuery, [centerId], (error, results) => {
          if (error) return reject(error);
          if (results.length === 0)
            return reject(new Error("Center not found or already deleted"));
          resolve(results[0].user_id);
        });
      });

      // Soft delete center query
      const softDeleteCenterQuery = `UPDATE centers SET deleted_at = NOW() WHERE id = ?`;

      // Soft delete user query
      const softDeleteUserQuery = `UPDATE users SET deleted_at = NOW() WHERE id = ?`;

      // Execute soft delete on center
      await new Promise((resolve, reject) => {
        pool.query(softDeleteCenterQuery, [centerId], (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      });

      // Execute soft delete on user
      await new Promise((resolve, reject) => {
        pool.query(softDeleteUserQuery, [userId], (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      });

      req.flash("success", "Center  deleted successfully");
      return res.redirect("/admin/user-list");
    } catch (error) {
      console.error("Delete Error:", error);
      req.flash("error", error.message || "Internal server error");
      return res.redirect("/admin/user-list");
    }
  },

  Restore: async (req, res) => {
    try {
      await CenterModels.restore(req.params.postId);
      req.flash("success", "Center restored successfully");
      res.redirect("/admin/user-list?status=trashed");
    } catch (error) {
      console.error("Restore Error:", error);
      handleError(
        res,
        req,
        "Error restoring Center",
        "/admin/user-list?status=trashed"
      );
    }
  },

  PermanentDelete: async (req, res) => {
    try {
      await CenterModels.permanentDelete(req.params.postId);
      req.flash("success", "Center permanently deleted");
      res.redirect("/admin/user-list?status=trashed");
    } catch (error) {
      console.error("PermanentDelete Error:", error);
      handleError(
        res,
        req,
        "Error permanently deleting Center",
        "/admin/user-list?status=trashed"
      );
    }
  },

  centerEnquiriesList: async (req, res) => {
    try {
      const { from_date, to_date, center_id } = req.query;

      let query = `
      SELECT ce.*, c.name AS center_name 
      FROM center_enquiries ce 
      LEFT JOIN centers c ON ce.center_id = c.id 
      WHERE 1=1
    `;
      const values = [];

      if (from_date) {
        query += ` AND DATE(ce.created_at) >= ?`;
        values.push(from_date);
      }

      if (to_date) {
        query += ` AND DATE(ce.created_at) <= ?`;
        values.push(to_date);
      }

      if (center_id) {
        query += ` AND ce.center_id = ?`;
        values.push(center_id);
      }

      // Ensure latest records are first
      query += ` ORDER BY ce.created_at DESC`;

      const [rows] = await pool.promise().execute(query, values);

      const [centers] = await pool.promise().query(`
        SELECT DISTINCT c.id, c.name, c.mobile 
        FROM centers c
        INNER JOIN center_enquiries ce ON c.id = ce.center_id
        ORDER BY c.name ASC
      `);

      const center_enquiries_list = "/admin/user-enquiries-list";

      return res.render("admin/center/enquiry-list", {
        title: "Center Enquiry List",
        request_data: rows,
        req,
        centers,
        center_enquiries_list,
      });
    } catch (error) {
      handleError(res, error, "List");
    }
  },

  contactEnquiriesList: async (req, res) => {
    try {
      const { from_date, to_date } = req.query;

      let query = `
      SELECT 
        ce.*, 
        cat.category_name AS category_name,
        cls.name AS class_name
      FROM contact_enquiries ce
      LEFT JOIN categories cat ON ce.category_id = cat.id
      LEFT JOIN course_classes cls ON ce.class_id = cls.id
      WHERE 1=1
    `;
      const values = [];

      if (from_date) {
        query += ` AND DATE(ce.created_at) >= ?`;
        values.push(from_date);
      }

      if (to_date) {
        query += ` AND DATE(ce.created_at) <= ?`;
        values.push(to_date);
      }

      // Show latest first
      query += ` ORDER BY ce.created_at DESC`;

      const [rows] = await pool.promise().execute(query, values);

      const contact_enquiries_list = "/admin/contact-enquiries-list";

      return res.render("admin/contact/enquiry-list", {
        title: "Contact Enquiry List",
        request_data: rows,
        contact_enquiries_list,
        req,
      });
    } catch (error) {
      console.error("Error in contactEnquiriesList:", error);
      handleError(res, error, "List");
    }
  },
};
