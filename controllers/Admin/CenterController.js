const CenterModels = require("../../models/CenterModels");
const Helper = require("../../helpers/Helper");
const path = require("path");
const fs = require("fs");
const { Parser } = require('json2csv');
const pool = require("../../db/database");
const { table } = require("console");
const bcrypt = require('bcrypt'); // at the top of your controller
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

const module_name = "Center enquiries";
const actions_url =  "/admin/center";
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
  const { postId, center, action, formUrl, pageName, error, success } = options; // add center here
  const categories = await Helper.getActiveCategoriesByType();
  const testSeries = await Helper.getActiveTestSeries();
  const service_cities  = await Helper.getServicableCities();
  res.render("admin/center/create", {
    success,
    error,
    categories,
    testSeries,
    form_url: formUrl,
    page_name: pageName,
    service_cities,
    action,
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
      const status = req.query.status === "trashed" ? "trashed" : "active";
      const centers = await CenterModels.list(status);

      res.render("admin/center/list", {
        success: req.flash("success"),
        error: req.flash("error"),
        customers: centers,
        req,
        page_name: status === "trashed" ? "Trashed Center List" : "Center List",
        list_url: "/admin/center-list",
        trashed_list_url: "/admin/center-list/?status=trashed",
        create_url: "/admin/center-create",
         actions_url:actions_url,
        status
      });
    } catch (error) {
      console.error("List Error:", error);
      handleError(res, req, "Server error in listing data", "/admin/center-list");
    }
  },

  Show: async (req, res) => {
    try {
      const center = await CenterModels.findById(req.params.postId);
      if (!center) {
        return handleError(res, req, "Center not found", "/admin/center-list");
      }
      console.log(center);
      res.render("admin/center/show", {
        success: req.flash("success"),
        error: req.flash("error"),
        post: center,
        list_url: "/admin/center-list",
        page_name: "Center Details",
      });
    } catch (error) {
      console.error("Show Error:", error);
      handleError(res, req, "An unexpected error occurred", "/admin/center-list");
    }
  },

  Edit: async (req, res) => {
    try {
      const center = await CenterModels.findById(req.params.postId);
      const service_cities  = await Helper.getServicableCities();
      console.log(center);
      //   if (!center) {
      //     return handleError(res, req, "Center not found", "/admin/center-list");
      //   }

      await renderForm(res, {
        postId: req.params.postId,
        center: center,
        service_cities,
        action: "Update",
        formUrl: `/admin/center-update/${req.params.postId}`,
        pageName: "Edit Center",
        back_url: "/admin/center-list",
        error: req.flash("error"),
        success: req.flash("success"),
      });
    } catch (error) {
      console.error("Edit Error:", error);
      handleError(res, req, error.message, "/admin/center-list");
    }
  },

  Create: async (req, res) => {
    try {
      const service_cities  = await Helper.getServicableCities();
      await renderForm(res, {
        course: null,
        action: "Create",
        formUrl: "/admin/center-update",
        back_url: "/admin/center-list",
        pageName: "Create Center",
        error: req.flash("error"),
        success: req.flash("success"),
        service_cities,
        data: {},
      });
    } catch (error) {
      console.error("Create Error:", error);
      handleError(res, req, error.message, "/admin/center-list");
    }
  },
  // Update: async (req, res) => {
  //   try {
  //     const postId = req.params.postId;

  //     const {
  //       city_id,
  //       name,
  //       email,
  //       mobile,
  //       roles,
  //       address,
  //       map_url,
  //       status,
  //     } = req.body;

  //     // Validate required fields
  //     if (!city_id) return res.json({ success: false, message: "City is required." });
  //     if (!name) return res.json({ success: false, message: "Name is required." });
  //     if (!email) return res.json({ success: false, message: "Email is required." });
  //     if (!mobile) return res.json({ success: false, message: "Mobile number is required." });
  //     if (!roles) return res.json({ success: false, message: "Roles are required." }); // added roles check
  //     if (!address) return res.json({ success: false, message: "Address is required." });
  //     if (!map_url) return res.json({ success: false, message: "Map URL is required." });
  //     if (!status) return res.json({ success: false, message: "Status is required." });

  //     const data = {
  //       city_id,
  //       name,
  //       email,
  //       mobile,
  //       roles,
  //       address,
  //       map_url,
  //       status,
  //       updated_at: new Date(),
  //     };

  //     // Handle logo upload (make sure folder name matches your model)
  //     if (req.files?.logo?.length > 0) {
  //       data.logo = `/uploads/centers/${req.files.logo[0].filename}`; // changed to 'centers'
  //     }

  //     // Check for duplicate center (adjust checkDuplicate logic accordingly)
  //     const isDuplicate = await CenterModels.checkDuplicate(city_id, name, email, postId || null);
  //     if (isDuplicate) {
  //       return res.json({ success: false, message: "Duplicate Center found" });
  //     }

  //     if (postId) {
  //       await CenterModels.update(postId, data, req.files?.logo?.[0] || null);
  //       return res.json({
  //         success: true,
  //         redirect_url: "/admin/center-list",
  //         message: "Center updated successfully",
  //       });
  //     } else {
  //       data.created_at = new Date();
  //       await CenterModels.create(data);
  //       return res.json({
  //         success: true,
  //         redirect_url: "/admin/center-list",
  //         message: "Center created successfully",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Update Error:", error);
  //     return res.json({
  //       success: false,
  //       message: "Error saving Center",
  //       error: error.message || error.toString(),
  //     });
  //   }
  // },

  // Update: async (req, res) => {
  //   try {
  //     const postId = req.params.postId;
  //     const {
  //       city_id,
  //       name,
  //       email,
  //       mobile,
  //       roles,
  //       address,
  //       map_url,
  //       status,
  //       password // receive password from form
  //     } = req.body;

  //     // Validations
  //     if (!city_id) return res.json({ success: false, message: "City is required." });
  //     if (!name) return res.json({ success: false, message: "Name is required." });
  //     if (!email) return res.json({ success: false, message: "Email is required." });
  //     if (!mobile) return res.json({ success: false, message: "Mobile number is required." });
  //     if (!roles) return res.json({ success: false, message: "Roles are required." });
  //     if (!address) return res.json({ success: false, message: "Address is required." });
  //     if (!map_url) return res.json({ success: false, message: "Map URL is required." });
  //     if (!status) return res.json({ success: false, message: "Status is required." });

  //     const data = {
  //       city_id,
  //       name,
  //       email,
  //       mobile,
  //       roles,
  //       address,
  //       map_url,
  //       status,
  //       updated_at: new Date(),
  //     };

  //     let hashedPassword = null;
  //     let original_password = "";

  //     // Handle password (hash + store)
  //     if (password && password.trim() !== '') {
  //       hashedPassword = await bcrypt.hash(password, 10);
  //       original_password = password;
  //     }

  //     // Handle logo upload
  //     if (req.files?.logo?.length > 0) {
  //       data.logo = `/uploads/centers/${req.files.logo[0].filename}`;
  //     }

  //     // Check for duplicates
  //     const isDuplicate = await CenterModels.checkDuplicate(city_id, name, email, postId || null);
  //     if (isDuplicate) {
  //       return res.json({ success: false, message: "Duplicate Center found" });
  //     }

  //     if (postId) {
  //       // Update existing center
  //       await CenterModels.update(postId, data, req.files?.logo?.[0] || null);
  //       return res.json({
  //         success: true,
  //         redirect_url: "/admin/center-list",
  //         message: "Center updated successfully",
  //       });
  //     } else {
  //       // Create new center
  //       data.created_at = new Date();

  //       // Save center and get inserted center ID
  //       const centerId = await CenterModels.create(data, req.files?.logo?.[0]);

  //       // Insert user linked to center inside the same function
  //       const insertUserQuery = `
  //         INSERT INTO users 
  //         (center_id, name, email, mobile, password, original_password, role_id) 
  //         VALUES (?, ?, ?, ?, ?, ?, ?)
  //       `;

  //       const userParams = [
  //         centerId,
  //         name,
  //         email,
  //         mobile,
  //         hashedPassword,
  //         original_password,
  //         roles,  // Make sure roles is a single role ID (number/string)
  //       ];

  //       await new Promise((resolve, reject) => {
  //         pool.query(insertUserQuery, userParams, (err, result) => {
  //           if (err) return reject(err);
  //           resolve(result.insertId);
  //         });
  //       });

  //       return res.json({
  //         success: true,
  //         redirect_url: "/admin/center-list",
  //         message: "Center and user created successfully",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Update Error:", error);
  //     return res.json({
  //       success: false,
  //       message: "Error saving Center",
  //       error: error.message || error.toString(),
  //     });
  //   }
  // },

  Update: async (req, res) => {

 
  try {
    const postId = req.params.postId;

    const {
      city_id,
      name,
      email,
      mobile,
      roles,
      address,
      map_url,
      status,
      password,
      description
    } = req.body;

    const slug = Helper.generateSlug(name);

    if (!city_id || !name || !email || !mobile || !roles || !address || !map_url || !status) {
      return res.json({ success: false, message: "All fields are required." });
    }

    let hashedPassword = null;
    let original_password = "";
    if (password?.trim()) {
      hashedPassword = await bcrypt.hash(password, 10);
      original_password = password;
    }

    // Handle logo upload
    let logoPath = null;
    if (req.files?.logo?.length > 0) {
      logoPath = `/uploads/centers/${req.files.logo[0].filename}`;
    }

    if (!postId) {
      // ---------- CREATE ----------

      // Insert into users
      const userQuery = `
        INSERT INTO users (name, email, mobile, password, original_password, role_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const userValues = [name, email, mobile, hashedPassword, original_password, roles, status];

      const userId = await new Promise((resolve, reject) => {
        pool.query(userQuery, userValues, (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        });
      });

      // Insert into user_roles
      await new Promise((resolve, reject) => {
        pool.query(
          `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
          [userId, roles],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });

      // Insert into centers
      const centerQuery = `
        INSERT INTO centers (user_id, city_id, name, slug, email, mobile, roles, address, map_url, status, logo, description, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      const centerValues = [
        userId, city_id, name, slug, email, mobile, roles, address, map_url, status, logoPath, description
      ];

      await new Promise((resolve, reject) => {
        pool.query(centerQuery, centerValues, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      return res.json({
        success: true,
        redirect_url: "/admin/center-list",
        message: "Center created successfully"
      });

    } else {
      // ---------- UPDATE ----------

      // Get user_id from centers
      const [center] = await new Promise((resolve, reject) => {
        pool.query(`SELECT user_id FROM centers WHERE id = ?`, [postId], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      if (!center) {
        return res.json({ success: false, message: "Center not found" });
      }

      const userId = center.user_id;

      // Update users table
      const userUpdateQuery = `
        UPDATE users SET name = ?, email = ?, mobile = ?, role_id = ?, status = ?, updated_at = NOW()
        ${hashedPassword ? ", password = ?, original_password = ?" : ""}
        WHERE id = ?
      `;

      const userUpdateValues = hashedPassword
        ? [name, email, mobile, roles, status, hashedPassword, original_password, userId]
        : [name, email, mobile, roles, status, userId];

      await new Promise((resolve, reject) => {
        pool.query(userUpdateQuery, userUpdateValues, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Update user_roles (replace role if exists)
      await new Promise((resolve, reject) => {
        pool.query(
          `DELETE FROM user_roles WHERE user_id = ?`,
          [userId],
          (err) => {
            if (err) return reject(err);
            pool.query(
              `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
              [userId, roles],
              (err2) => {
                if (err2) return reject(err2);
                resolve();
              }
            );
          }
        );
      });

      // Update centers
      const centerUpdateQuery = `
        UPDATE centers SET city_id = ?, name = ?, slug = ?, email = ?, mobile = ?, roles = ?, address = ?, map_url = ?, status = ?, description = ?, updated_at = NOW()
        ${logoPath ? ", logo = ?" : ""}
        WHERE id = ?
      `;

      const centerUpdateValues = logoPath
        ? [city_id, name, slug, email, mobile, roles, address, map_url, status, description, logoPath, postId]
        : [city_id, name, slug, email, mobile, roles, address, map_url, status, description, postId];

      await new Promise((resolve, reject) => {
        pool.query(centerUpdateQuery, centerUpdateValues, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      return res.json({
        success: true,
        redirect_url: "/admin/center-list",
        message: "Center updated successfully"
      });
    }

  } catch (error) {
    console.error("Error:", error);
    return res.json({
      success: false,
      message: "Something went wrong",
      error: error.message
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
//           redirect_url: "/admin/center-list",
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
//           redirect_url: "/admin/center-list",
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
        if (results.length === 0) return reject(new Error("Center not found or already deleted"));
        resolve(results[0].user_id);
      });
    });

    // ✅ Soft delete center + set status = 1 (inactive)
    const softDeleteCenterQuery = `
      UPDATE centers 
      SET deleted_at = NOW(), status = 0 
      WHERE id = ?
    `;

    // ✅ Soft delete user + set status = 1 (inactive)
    const softDeleteUserQuery = `
      UPDATE users 
      SET deleted_at = NOW(), status = 0 
      WHERE id = ?
    `;

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

    req.flash("success", "Center deleted successfully");
    return res.redirect("/admin/center-list");
  } catch (error) {
    console.error("Delete Error:", error);
    req.flash("error", error.message || "Internal server error");
    return res.redirect("/admin/center-list");
  }
},

 Restore: async (req, res) => {
  try {
    const centerId = req.params.postId;

    // ✅ Restore means set deleted_at = NULL and status back to 0 (active)
    const restoreCenterQuery = `
      UPDATE centers 
      SET deleted_at = NULL, status = 1 
      WHERE id = ?
    `;
    await pool.promise().query(restoreCenterQuery, [centerId]);

    req.flash("success", "Center restored successfully");
    res.redirect("/admin/center-list?status=trashed");
  } catch (error) {
    console.error("Restore Error:", error);
    handleError(res, req, "Error restoring Center", "/admin/center-list?status=trashed");
  }
},

 PermanentDelete: async (req, res) => {
  try {
    const centerId = req.params.postId;

    // First fetch the center to get the user_id
    const userId = await new Promise((resolve, reject) => {
      const fetchCenterQuery = `SELECT user_id FROM centers WHERE id = ?`;
      pool.query(fetchCenterQuery, [centerId], (error, results) => {
        if (error) return reject(error);
        if (results.length === 0) return reject(new Error("Center not found"));
        resolve(results[0].user_id);
      });
    });

    // Permanently delete center
    const deleteCenterQuery = `DELETE FROM centers WHERE id = ?`;
    await new Promise((resolve, reject) => {
      pool.query(deleteCenterQuery, [centerId], (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });

    // Permanently delete user (optional, if required)
    const deleteUserQuery = `DELETE FROM users WHERE id = ?`;
    await new Promise((resolve, reject) => {
      pool.query(deleteUserQuery, [userId], (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });

    req.flash("success", "Center permanently deleted");
    return res.redirect("/admin/center-list?status=trashed");
  } catch (error) {
    console.error("PermanentDelete Error:", error);
    req.flash("error", error.message || "Internal server error");
    return res.redirect("/admin/center-list?status=trashed");
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

    const [centers] = await pool
      .promise()
      .query(`
        SELECT DISTINCT c.id, c.name, c.mobile 
        FROM centers c
        INNER JOIN center_enquiries ce ON c.id = ce.center_id
        ORDER BY c.name ASC
      `);

    const center_enquiries_list = '/admin/center-enquiries-list';

    return res.render("admin/center/enquiry-list", {
      title: "Center Enquiry List",
      request_data: rows,
      req,
      centers,
      center_enquiries_list
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

    const contact_enquiries_list = '/admin/contact-enquiries-list';

    return res.render("admin/contact/enquiry-list", {
      title: "Contact Enquiry List",
      request_data: rows,
      contact_enquiries_list,
      req
    });

  } catch (error) {
    console.error("Error in contactEnquiriesList:", error);
    handleError(res, error, "List");
  }
},
bulkDelete: async (req, res) => {

  const { ids } = req.body; // array of student IDs

  if (!ids || !ids.length) {
    return res.json({ success: false, message: "No Centers selected." });
  }

  // Use placeholders to prevent SQL injection
  const placeholders = ids.map(() => "?").join(",");
  const sql = `UPDATE centers SET deleted_at = NOW(), status = 0 WHERE id IN (${placeholders})`;

  pool.query(sql, ids, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Database error." });
    }

    return res.json({
      success: true,
      message: `${result.affectedRows} Center(s) moved to trash successfully.`,
    });
  });
},

  bulkRestore: async (req, res) => {
  const { ids } = req.body;

  if (!ids || !ids.length) {
    return res.json({ success: false, message: "No Centers selected." });
  }

  const placeholders = ids.map(() => "?").join(",");
  const sql = `UPDATE centers SET deleted_at = NULL, status = 1 WHERE id IN (${placeholders})`;

  pool.query(sql, ids, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Database error." });
    }

    return res.json({
      success: true,
      message: `${result.affectedRows} center(s) restored successfully.`,
    });
  });
},
bulkDelete: async (req, res) => {

  const { ids } = req.body; // array of student IDs

  if (!ids || !ids.length) {
    return res.json({ success: false, message: "No Centers selected." });
  }

  // Use placeholders to prevent SQL injection
  const placeholders = ids.map(() => "?").join(",");
  const sql = `UPDATE centers SET deleted_at = NOW(), status = 0 WHERE id IN (${placeholders})`;

  pool.query(sql, ids, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Database error." });
    }

    return res.json({
      success: true,
      message: `${result.affectedRows} Center(s) moved to trash successfully.`,
    });
  });
},

  bulkRestore: async (req, res) => {
  const { ids } = req.body;

  if (!ids || !ids.length) {
    return res.json({ success: false, message: "No Centers selected." });
  }

  const placeholders = ids.map(() => "?").join(",");
  const sql = `UPDATE centers SET deleted_at = NULL, status = 1 WHERE id IN (${placeholders})`;

  pool.query(sql, ids, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Database error." });
    }

    return res.json({
      success: true,
      message: `${result.affectedRows} center(s) restored successfully.`,
    });
  });
},

exportCenter: async (req, res) => {
  const sql = `
    SELECT 
      c.id,
      c.name,
      c.email,
      c.mobile,
      c.description,
      c.address,
      c.map_url,
      ci.name as city_name,
      CASE WHEN c.status = 1 THEN 'Active' ELSE 'Inactive' END AS status,
      c.created_at
    FROM centers c
    LEFT JOIN cities ci ON c.city_id = ci.id
    WHERE c.deleted_at IS NULL
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error(err.stack);
      return res.status(500).json({ success: false, message: 'Database error.', error: err.message });
    }

    if (!results.length) {
      return res.status(404).json({ success: false, message: 'No center data found.' });
    }

    try {
      const fields = ['id', 'name', 'email', 'mobile', 'description', 'address', 'map_url', 'city_name', 'status', 'created_at'];
      const parser = new Parser({ fields });
      const csv = parser.parse(results);

      // Use local date-time
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
      const filename = `centers_esxport_${timestamp}.csv`;

      res.header('Content-Type', 'text/csv');
      res.attachment(filename);
      return res.send(csv);
    } catch (parseErr) {
      console.error(parseErr.stack);
      return res.status(500).json({ success: false, message: 'Error generating CSV.', error: parseErr.message });
    }
  });
}






}