const pool = require("../../db/database");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");
const XLSX = require('xlsx');
const fs = require('fs');
const Helper = require("../../helpers/Helper");
const { validateRequiredFields } = require("../../helpers/validationsHelper");

const List = async (req, res) => {
  try {
    const status1 = req.query.status || "active";

    const search = req.query.search;
    const searchTerm = `%${search}%`;
    
    // Filter parameters
    const centerFilter = req.query.center_id;
    const categoryFilter = req.query.category_id;
    const classFilter = req.query.class_id;
    const fromDate = req.query.from_date;
    const toDate = req.query.to_date;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const offset = (page - 1) * limit;

    const userRoles = req.session.userRole || [];
    const userId = req.user.id;
    const queryParams = [];
    const countParams = [];

    let countQuery = `
  SELECT COUNT(*) as total
  FROM front_users fu
  WHERE 1 = 1
`;

    let getQuery = `
  SELECT 
    fu.*,
    c.category_name,
    cl.name AS class_name,
    cent.name AS center_name,
    crs.course_name,
    (
      SELECT COUNT(*) 
      FROM course_orders co 
      WHERE co.user_id = fu.id 
        AND co.payment_status = 'complete'
        AND co.order_type = 'course'
    ) AS ordersCount
  FROM front_users fu
  LEFT JOIN categories c ON fu.category_id = c.id
  LEFT JOIN course_classes cl ON fu.class_id = cl.id
  LEFT JOIN centers cent ON fu.center_id = cent.id
  LEFT JOIN courses crs ON fu.course_id = crs.id
  WHERE 1 = 1
`;

    // Filter by center for center users
    if (userRoles.includes("Center")) {
      console.log('🔍 ===== CENTER USER DEBUGGING START =====');
      console.log('🔍 Center user detected - User ID:', userId);
      
      // First, get user info
      const [userData] = await pool.promise().query(
        `SELECT id, name, email, role_id, center_id FROM users WHERE id = ? LIMIT 1`,
        [userId]
      );
      
      console.log('📋 User data:', userData[0]);
      
      // Check if center with ID 63 exists
      const [tirupatiCenter] = await pool.promise().query(
        `SELECT id, name, status, deleted_at FROM centers WHERE id = 63 LIMIT 1`
      );
      console.log('🏢 Tirupati Center (ID 63):', tirupatiCenter[0]);
      
      // Count students for center 63
      const [studentCount] = await pool.promise().query(
        `SELECT COUNT(*) as count FROM front_users WHERE center_id = 63 AND deleted_at IS NULL`
      );
      console.log('👥 Students in center 63:', studentCount[0].count);
      
      let centerIdToUse = null;
      
      // Check if user has direct center_id
      if (userData.length > 0 && userData[0].center_id) {
        centerIdToUse = userData[0].center_id;
        console.log('✅ Found direct center_id in users table:', centerIdToUse);
      } else {
        console.log('⚠️ No center_id in users table, trying name matching...');
        
        // Get user's name for matching
        const userName = userData[0].name;
        console.log('👤 User name to match: "' + userName + '"');
        console.log('📏 User name length:', userName.length);
        
        // Try exact match with center name
        const [nameMatch] = await pool.promise().query(
          `SELECT u.name as user_name, c.id AS center_id, c.name AS center_name
           FROM users u
           LEFT JOIN centers c ON TRIM(u.name) COLLATE utf8mb4_unicode_ci = TRIM(c.name) COLLATE utf8mb4_unicode_ci
           WHERE u.id = ? AND c.status = 1 AND c.deleted_at IS NULL
           LIMIT 1`,
          [userId]
        );
        
        console.log('🔍 Name match result:', nameMatch[0]);
        
        if (nameMatch.length > 0 && nameMatch[0].center_id) {
          centerIdToUse = nameMatch[0].center_id;
          console.log('✅ Found center via name match:', centerIdToUse);
          console.log('🏢 Matched center name: "' + nameMatch[0].center_name + '"');
        } else {
          console.log('❌ Name matching failed!');
          
          // Show centers that partially match
          const [similarCenters] = await pool.promise().query(
            `SELECT id, name FROM centers 
             WHERE name LIKE ? AND status = 1 AND deleted_at IS NULL
             ORDER BY name`,
            ['%' + userName + '%']
          );
          console.log('🔎 Centers with similar names:', similarCenters);
          
          // Show all active centers
          const [allCenters] = await pool.promise().query(
            `SELECT id, name FROM centers WHERE status = 1 AND deleted_at IS NULL ORDER BY name LIMIT 10`
          );
          console.log('🏢 First 10 active centers:', allCenters);
        }
      }
      
      if (centerIdToUse) {
        countQuery += ` AND fu.center_id = ? `;
        getQuery += ` AND fu.center_id = ? `;
        countParams.push(centerIdToUse);
        queryParams.push(centerIdToUse);
        console.log('✅ Filtering students by center_id:', centerIdToUse);
      } else {
        console.log('❌ ERROR: Center user has no matching center_id!');
        console.log('💡 SOLUTION: Either:');
        console.log('   1. Add center_id=63 to users table for this user');
        console.log('   2. Ensure user.name exactly matches center.name');
        // Show no results for safety
        countQuery += ` AND fu.center_id = -1 `;
        getQuery += ` AND fu.center_id = -1 `;
      }
      
      console.log('🔍 ===== CENTER USER DEBUGGING END =====');
    }

    if (status1 === "trashed") {
      countQuery += ` AND fu.deleted_at IS NOT NULL `;
      getQuery += ` AND fu.deleted_at IS NOT NULL `;
    } else if (status1 === "active") {
      countQuery += ` AND fu.deleted_at IS NULL AND fu.status = 1 `;
      getQuery += ` AND fu.deleted_at IS NULL AND fu.status = 1 `;
    } else if (status1 === "inactive") {
      countQuery += ` AND fu.deleted_at IS NULL AND fu.status = 0 `;
      getQuery += ` AND fu.deleted_at IS NULL AND fu.status = 0 `;
    } 
  
    if (search) {
      countQuery += ` AND (fu.name LIKE ? OR fu.mobile LIKE ? OR fu.email LIKE ?) `;
      getQuery += ` AND (fu.name LIKE ? OR fu.mobile LIKE ? OR fu.email LIKE ?) `;
      countParams.push(searchTerm, searchTerm, searchTerm);
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (centerFilter) {
      countQuery += ` AND fu.center_id = ? `;
      getQuery += ` AND fu.center_id = ? `;
      countParams.push(centerFilter);
      queryParams.push(centerFilter);
    }

    if (categoryFilter) {
      countQuery += ` AND fu.category_id = ? `;
      getQuery += ` AND fu.category_id = ? `;
      countParams.push(categoryFilter);
      queryParams.push(categoryFilter);
    }

    if (classFilter) {
      countQuery += ` AND fu.class_id = ? `;
      getQuery += ` AND fu.class_id = ? `;
      countParams.push(classFilter);
      queryParams.push(classFilter);
    }

    if (fromDate) {
      countQuery += ` AND DATE(fu.created_at) >= ? `;
      getQuery += ` AND DATE(fu.created_at) >= ? `;
      countParams.push(fromDate);
      queryParams.push(fromDate);
    }

    if (toDate) {
      countQuery += ` AND DATE(fu.created_at) <= ? `;
      getQuery += ` AND DATE(fu.created_at) <= ? `;
      countParams.push(toDate);
      queryParams.push(toDate);
    }

    getQuery += ` ORDER BY fu.id DESC `;
    getQuery += ` LIMIT ? OFFSET ? `;
    queryParams.push(limit, offset);

    const page_name =
      status1 === "trashed"
        ? "Trashed Student List"
        : status1 === "inactive"
        ? "Inactive Student List"
        : "Student List";

    // Get total count for pagination
    const totalCount = await new Promise((resolve, reject) => {
      pool.query(countQuery, countParams, (error, result) => {
        if (error) {
          req.flash("error", error.message);
          return reject(error);
        }
        resolve(result[0].total);
      });
    });

    const customers = await new Promise((resolve, reject) => {
      pool.query(getQuery, queryParams, (error, result) => {
        if (error) {
          req.flash("error", error.message);
          return reject(error);
        }
        console.log(`✓ Retrieved ${result.length} students for page ${page}`);
        if (userRoles.includes("Center") && result.length > 0) {
          console.log('Sample student center_id:', result[0].center_id);
        }
        resolve(result);
      });
    });

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
    
    // Fetch filter options
    const courses = await Helper.getActiveCourses();
    const categories = await Helper.getActiveCategories() || [];
    const classes = await Helper.getActiveClasses() || [];
    
    // Filter centers based on user role
    let centers = [];
    if (userRoles.includes("Center")) {
      // Center user can only see their own center
      console.log('Center user detected. User ID:', userId);
      
      // Get user's name from users table
      const [adminProfile] = await pool.promise().query(
        `SELECT name FROM users WHERE id = ? LIMIT 1`,
        [userId]
      );
      console.log('Admin profile result:', adminProfile);
      
      if (adminProfile.length > 0 && adminProfile[0].name) {
        const userName = adminProfile[0].name;
        console.log('User name:', userName);
        console.log('User name length:', userName.length);
        console.log('User name trimmed:', userName.trim());
        
        // First, let's see ALL active centers
        const [allCenters] = await pool.promise().query(
          `SELECT id, name FROM centers WHERE deleted_at IS NULL`
        );
        console.log('All active centers:', allCenters);
        
        // Find center by matching the user's name with center's name (using COLLATE for case-insensitive matching)
        const [centerInfo] = await pool.promise().query(
          `SELECT id, name FROM centers 
           WHERE name COLLATE utf8mb4_unicode_ci = ? COLLATE utf8mb4_unicode_ci 
           AND status = 1 
           AND deleted_at IS NULL`,
          [userName]
        );
        centers = centerInfo || [];
        console.log('Found center by name match:', centers);
        
        // If no match found with exact name, try trimming whitespace
        if (centers.length === 0) {
          console.log('No exact match found, trying with TRIM pattern...');
          const [centerInfoLike] = await pool.promise().query(
            `SELECT id, name FROM centers 
             WHERE TRIM(name) COLLATE utf8mb4_unicode_ci = TRIM(?) COLLATE utf8mb4_unicode_ci 
             AND status = 1 
             AND deleted_at IS NULL`,
            [userName]
          );
          centers = centerInfoLike || [];
          console.log('Found center with TRIM:', centers);
        }
        
        // If still no match, try with LIKE
        if (centers.length === 0) {
          console.log('Still no match, trying with LIKE...');
          const [centerInfoLike] = await pool.promise().query(
            `SELECT id, name FROM centers 
             WHERE name LIKE ? 
             AND status = 1 
             AND deleted_at IS NULL`,
            [`%${userName.trim()}%`]
          );
          centers = centerInfoLike || [];
          console.log('Found center with LIKE:', centers);
        }
      } else {
        console.log('No user found with this ID');
        centers = [];
      }
    } else {
      // Super admin can see all centers
      centers = await Helper.getCenters(['id', 'name']) || [];
    }
    
    res.render("admin/customer/list", {
      success: req.flash("success"),
      error: req.flash("error"),
      customers,
      req,
      page_name,
      status1,
      search: search || '',
      courses,
      centers,
      categories,
      classes,
      centerFilter: centerFilter || '',
      categoryFilter: categoryFilter || '',
      classFilter: classFilter || '',
      fromDate: fromDate || '',
      toDate: toDate || '',
      permissions: req.session.permissions || [],
      userRoles: userRoles,
      userId: userId,
      pagination: pagination
    });
  } catch (error) {
    console.error('Error in List function:', error);
    req.flash("error", error.message);
    res.redirect("/admin/student-list");
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

const Create = async (req, res) => {
  try {
    const customer = undefined;
    const categories = await getCategoriesFromTable();
    const course_classes = await getCourseClassesFromTable();
    const centers = await Helper.getCenters();
 let courses = [];
 const user = req.user;
 const userRoles = req.session.userRole || [];
    // Check if userRoles includes "center"
    if (userRoles.includes("Center")) {
      courses = await Helper.getCenterCourses(req.user.id);
    } else {
      courses = await Helper.getActiveCourses();
    }
    res.render("admin/customer/create", {
      success: req.flash("success"),
      error: req.flash("error"),
      customer: customer,
      categories: categories,
      course_classes: course_classes,
      centers: centers,
      courses,
      user,
      userRoles,
      form_url: "/admin/student-store",
      page_name: "Create Student",
      action: "Create",
    });
  } catch (error) {
    console.log(error.message);
  }
};

// const Store = async (req, res) => {
//   try {
//     let {
//       name,
//       email,
//       mobile,
//       category_id,
//       class_id,
//       registration_type,
//       center_id,
//       status,
//     } = req.body;

//     name = name?.trim();
//     email = email?.trim();
//     mobile = mobile?.trim();
//     registration_type = registration_type?.trim();

//     const errors = {};

//     // Validation checks
//     if (!name) {
//       errors.name = errors.name || [];
//       errors.name.push("Name is required");
//     }

//     if (!email) {
//       errors.email = errors.email || [];
//       errors.email.push("Email is required");
//     }

//     if (!mobile) {
//       errors.mobile = errors.mobile || [];
//       errors.mobile.push("Mobile is required");
//     } else if (!/^\d{10}$/.test(mobile)) {
//       errors.mobile = errors.mobile || [];
//       errors.mobile.push("Mobile number must be 10 digits");
//     }

//     if (!category_id) {
//       errors.category_id = errors.category_id || [];
//       errors.category_id.push("Category is required");
//     }

//     if (!class_id) {
//       errors.class_id = errors.class_id || [];
//       errors.class_id.push("Class is required");
//     }

//     if (!registration_type) {
//       errors.registration_type = errors.registration_type || [];
//       errors.registration_type.push("Registration Type is required");
//     }

//     if (status === undefined || status === null || status === "") {
//       errors.status = errors.status || [];
//       errors.status.push("Status is required");
//     }

//     const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//     const isValidMobile = /^\d{10}$/.test(mobile);

//     if (email && !isValidEmail) {
//       errors.email = errors.email || [];
//       errors.email.push("Invalid email format");
//     }

//     // if (mobile && !isValidMobile) {
//     //   errors.mobile = errors.mobile || [];
//     //   errors.mobile.push("Mobile number must be 10 digits");
//     // }

//     // Check if the email already exists
//     pool.query(
//       "SELECT COUNT(*) AS email_count FROM front_users WHERE email = ?",
//       [email],
//       (err, results) => {
//         if (err) {
//           console.error("Error executing query:", err.stack);
//           return res.status(500).json({
//             success: false,
//             errors: [{ message: "Database error" }],
//           });
//         }

//         // if (results[0].email_count > 0) {
//         //   return res.status(409).json({
//         //     success: false,
//         //     errors: [{ field: "email", msg: "Email already exists" }],
//         //   });
//         // }

//         if (Object.keys(errors).length > 0) {
//           return res.status(422).json({
//             status: false,
//             errors,
//             message: Object.values(errors)[0][0], // This will return the first error message
//           });
//         }

//         // If email doesn't exist, proceed with insertion
//         const insertQuery = `
//           INSERT INTO front_users (name, email, mobile, category_id, class_id,registration_type,center_id, status)
//           VALUES (?, ?, ?, ?, ?, ?,?,?)
//         `;

//         pool.query(
//           insertQuery,
//           [
//             name,
//             email,
//             mobile,
//             category_id,
//             class_id,
//             registration_type,
//             center_id,
//             status,
//           ],
//           (err) => {
//             if (err) {
//               console.error("Error executing query:", err); // Log the full error
//               return res.status(500).json({
//                 success: false,
//                 errors: [{ message: `Database error: ${err.message}` }], // Return the actual error message
//               });
//             }

//             return res.status(200).json({
//               success: true,
//               redirect_url: "/admin/student-list",
//               message: "Student saved successfully",
//             });
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error(error); // Log actual error
//     return res.status(500).json({
//       success: false,
//       errors: [{ message: error.message || "Unexpected server error" }],
//     });
//   }
// };


// const Store = async (req, res) => {
//   try {
//     let {
//       name,
//       email,
//       mobile,
//       category_id,
//       class_id,
//       center_id,
//       status,
//     } = req.body;

//     name = name?.trim();
//     email = email?.trim();
//     mobile = mobile?.trim();

//     // Always set registration_type = admin
//     const registration_type = "admin";

//     const errors = {};

//     // 🔹 Validation checks
//     if (!name) errors.name = ["Name is required"];

//     if (!email) {
//       errors.email = ["Email is required"];
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       errors.email = ["Invalid email format"];
//     }

//     if (!mobile) {
//       errors.mobile = ["Mobile is required"];
//     } else if (!/^\d{10}$/.test(mobile)) {
//       errors.mobile = ["Mobile number must be 10 digits"];
//     }

//     if (!category_id) errors.category_id = ["Category is required"];
//     if (!class_id) errors.class_id = ["Class is required"];

//     // Always force admin -> status = 1
//     status = 1;

//     // ✅ Now check duplicates in DB
    
//     const checkQuery = `
//       SELECT email, mobile 
//       FROM front_users 
//       WHERE email = ? OR mobile = ?
//     `;

//     pool.query(checkQuery, [email, mobile], (err, results) => {
//       if (err) {
//         console.error("Error executing query:", err.stack);
//         return res.status(500).json({
//           success: false,
//           errors: [{ message: "Database error" }],
//         });
//       }

//     if (email || mobile) {
//   if (results.length > 0) {
//     results.forEach((row) => {
//       if (email && row.email === email) {
//         errors.email = ["Email already exists"];
//       }
//       if (mobile && row.mobile === mobile) {
//         errors.mobile = ["Mobile already exists"];
//       }
//     });
//   }
// }

//       // 🔹 Final error check (only once, after validation + duplicates)
//       if (Object.keys(errors).length > 0) {
//         return res.status(422).json({
//           success: false,
//           errors,
//           message: Object.values(errors)[0][0], // first error msg
//         });
//       }

//       // ✅ Insert if no errors
//       const insertQuery = `
//         INSERT INTO front_users 
//         (name, email, mobile, category_id, class_id, registration_type, center_id, status)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//       pool.query(
//         insertQuery,
//         [
//           name,
//           email,
//           mobile,
//           category_id,
//           class_id,
//           registration_type, // always "admin"
//           center_id,
//           status, // always 1
//         ],
//         (err) => {
//           if (err) {
//             console.error("Error executing query:", err);
//             return res.status(500).json({
//               success: false,
//               errors: [{ message: `Database error: ${err.message}` }],
//             });
//           }

//           return res.status(200).json({
//             success: true,
//             redirect_url: "/admin/student-list",
//             message: "Admin user saved successfully",
//           });
//         }
//       );
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       errors: [{ message: error.message || "Unexpected server error" }],
//     });
//   }
// };


const Store = async (req, res) => {
  try {
    let {
      name,
      email,
      mobile,
      category_id,
      class_id,
      status,
      course,
      city
    } = req.body;

    let created_by = req.session.adminUserId; // admin creating this user
    let center_id = req.body.center_id; // Will be overridden for center users
    const userRoles = req.session.userRole || [];
    const userId = req.user.id;

    name = name?.trim();
    email = email?.trim();
    mobile = mobile?.trim();
    city = city?.trim();

    // Set registration_type = default (not admin)
    const registration_type = "default";

    // 🏢 Auto-assign center_id for center users (override any form value)
    if (userRoles.includes("Center")) {
      console.log('🏢 Center user creating student - User ID:', userId);
      console.log('🏢 Form center_id (will be overridden):', center_id);
      
      // First check if user has direct center_id
      const [userData] = await pool.promise().query(
        `SELECT center_id, name FROM users WHERE id = ? LIMIT 1`,
        [userId]
      );
      
      if (userData.length > 0 && userData[0].center_id) {
        center_id = userData[0].center_id;
        created_by = center_id; // Set created_by to center_id for center users
        console.log('✅ Using direct center_id from users table:', center_id);
        console.log('✅ Center from centers table ID:', center_id);
        console.log('✅ Setting created_by to center_id:', created_by);
      } else if (userData.length > 0 && userData[0].name) {
        // Fallback to name matching (including inactive centers for student creation)
        const userName = userData[0].name;
        console.log('⚠️ User has no center_id, trying name matching for:', userName);
        
        const [centerMatch] = await pool.promise().query(
          `SELECT id, status FROM centers 
           WHERE TRIM(name) COLLATE utf8mb4_unicode_ci = TRIM(?) COLLATE utf8mb4_unicode_ci 
           AND deleted_at IS NULL
           LIMIT 1`,
          [userName]
        );
        
        if (centerMatch.length > 0) {
          center_id = centerMatch[0].id;
          created_by = center_id; // Set created_by to center_id for center users
          
          // Warn if center is inactive
          if (centerMatch[0].status != 1) {
            console.log('⚠️ WARNING: Center is inactive (status=' + centerMatch[0].status + ')');
            console.log('💡 SOLUTION: Run SQL: UPDATE centers SET status = 1 WHERE id = ' + center_id + ';');
          }
        } else {
          console.log('❌ ERROR: Cannot find center for this center user');
          console.log('💡 User name:', userName);
          console.log('💡 SOLUTION: Run SQL: UPDATE users SET center_id = <correct_center_id> WHERE id = ' + userId + ';');
          return res.status(400).json({
            success: false,
            errors: { center_id: ["Center not found for this user. Please contact admin."] },
            message: "Center not found for this user"
          });
        }
      } else {
        console.log('❌ ERROR: User data not found');
        return res.status(400).json({
          success: false,
          errors: { center_id: ["User information not found. Please contact admin."] },
          message: "User information not found"
        });
      }
    }

    const errors = {};

    // 🔹 Validation checks
    if (!name) errors.name = ["Name is required"];
    if (!email) {
      errors.email = ["Email is required"];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = ["Invalid email format"];
    }
    if (!mobile) {
      errors.mobile = ["Mobile is required"];
    } else if (!/^\d{10}$/.test(mobile)) {
      errors.mobile = ["Mobile number must be 10 digits"];
    }
    if (!category_id) errors.category_id = ["Category is required"];
    if (!class_id) errors.class_id = ["Class is required"];
    if (!city) errors.city = ["City is required"];

    // Always force admin -> status = 1
    status = 1;

    // 🔹 Check duplicates in DB
    const checkQuery = `
      SELECT email, mobile 
      FROM front_users 
      WHERE email = ? OR mobile = ?
    `;

    pool.query(checkQuery, [email, mobile], (err, results) => {
      if (err) {
        console.error("Error executing query:", err.stack);
        return res.status(500).json({
          success: false,
          errors: [{ message: "Database error" }],
        });
      }

      if (results.length > 0) {
        results.forEach((row) => {
          if (email && row.email === email) {
            errors.email = ["Email already exists"];
          }
          if (mobile && row.mobile === mobile) {
            errors.mobile = ["Mobile already exists"];
          }
        });
      }

      // 🔹 Final error check
      if (Object.keys(errors).length > 0) {
        return res.status(422).json({
          success: false,
          errors,
          message: Object.values(errors)[0][0],
        });
      }

      // ✅ Insert if no errors
      const insertQuery = `
        INSERT INTO front_users 
        (name, email, mobile, category_id, class_id, registration_type, center_id, status, created_by, city, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      pool.query(
        insertQuery,
        [
          name,
          email,
          mobile,
          category_id,
          class_id,
          registration_type,
          center_id,
          status,
          created_by,
          city
        ],
        async (err, result) => {
          if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({
              success: false,
              errors: [{ message: `Database error: ${err.message}` }],
            });
          }

          const newUserId = result.insertId;

          // 📚 Handle course assignment - insert into course_orders table
          if (Array.isArray(course) && course.length > 0) {
            const dayjs = require("dayjs");
            const durationPlugin = require("dayjs/plugin/duration");
            dayjs.extend(durationPlugin);

            for (const courseId of course) {
              try {
                const [courseRows] = await pool.promise().query(
                  "SELECT course_name, offer_price, course_type, duration FROM courses WHERE id = ?",
                  [courseId]
                );

                if (courseRows.length === 0) continue;

                const courseData = courseRows[0];
                const transactionId = "admin" + Math.floor(100000 + Math.random() * 900000);
                const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000) + "-admin";

                const durationInMonths = parseInt(courseData.duration);
                const safeDuration = isNaN(durationInMonths) ? 0 : durationInMonths;
                const expiredDate = dayjs().add(safeDuration, 'month').format('YYYY-MM-DD');

                await pool.promise().query(
                  `INSERT INTO course_orders (
                    user_id, course_id, transaction_id, course_name, course_expired_date,
                    course_amount, total_amount, payment_type, order_status,
                    source, assign_by, payment_status, order_id, order_type
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    newUserId,
                    courseId,
                    transactionId,
                    courseData.course_name,
                    expiredDate,
                    courseData.offer_price,
                    0,
                    "online",
                    "complete",
                    "web",
                    "admin",
                    "complete",
                    orderId,
                    "course"
                  ]
                );
              } catch (err) {
                console.error(`Error inserting course order for course ID ${courseId}:`, err.message);
              }
            }
          }

          return res.status(200).json({
            success: true,
            redirect_url: "/admin/student-list",
            message: "Student saved successfully",
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errors: [{ message: error.message || "Unexpected server error" }],
    });
  }
};



const Edit = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const getCustomerQuery = "SELECT * FROM front_users WHERE id = ?";

    const customer = await new Promise((resolve, reject) => {
      pool.query(getCustomerQuery, [customerId], function (error, result) {
        if (error) {
          console.error(error);
          req.flash("error", error.message);
          reject(error);
        } else {
          resolve(result[0]);
        }
      });
    });


    const categories = await getCategoriesFromTable();
    const course_classes = await getCourseClassesFromTable();
    const centers = await Helper.getCenters();
   // const courses = await Helper.getActiveCourses();
const userRoles = req.session.userRole || [];
    const user = req.user;
    const [courses] = await pool.promise().query(
  `SELECT 
     c.id,
     c.course_name,
     c.offer_price,
     c.course_type,
     c.duration,
     CASE 
       WHEN co.id IS NOT NULL THEN 1
       ELSE 0
     END AS is_paid
   FROM courses c
   LEFT JOIN course_orders co 
     ON co.course_id = c.id 
     AND co.user_id = ? 
     AND co.payment_status = 'complete'
     AND co.assign_by = 'admin'
   WHERE c.status = 1 AND c.deleted_at IS NULL`,
  [customerId]
);
    res.render("admin/customer/create", {
      success: req.flash("success"),
      error: req.flash("error"),
      customer: customer,
      categories: categories,
      course_classes: course_classes,
      centers: centers,
      courses,
      user,
      userRoles,
      form_url: "/admin/student-update/" + customerId,
      page_name: "Edit Student",
      action: "Update ",
    });
  } catch (error) {
    console.log(error.message);
  }
};
// const Update = async (req, res) => {
//   const userId = req.params.customerId;
//   let {
//     name,
//     email,
//     mobile,
//     category_id,
//     class_id,
//     registration_type,
//     center_id,
//     status,
//     course,
//     city
//   } = req.body;

//   // Trim inputs
//   name = name?.trim();
//   email = email?.trim();
//   mobile = mobile?.trim();
//   registration_type = registration_type?.trim();
//   center_id = center_id?.trim();

//   const errors = {};

//   // Validations
//   if (!name) errors.name = ["Name is required"];
//   if (!email) errors.email = ["Email is required"];
//   else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ["Invalid email format"];
//   if (!mobile) errors.mobile = ["Mobile is required"];
//   else if (!/^\d{10}$/.test(mobile)) errors.mobile = ["Mobile number must be 10 digits"];
//   if (!category_id) errors.category_id = ["Category is required"];
//   if (!class_id) errors.class_id = ["Class is required"];
//   if (!registration_type) errors.registration_type = ["Registration Type is required"];
//   if (status === undefined || status === null || status === "") errors.status = ["Status is required"];
//  if (!city) errors.city = ["City is required"];
//   if (Object.keys(errors).length > 0) {
//     return res.status(422).json({
//       success: false,
//       errors,
//       message: Object.values(errors)[0][0]
//     });
//   }

//   try {

//     if(!userId)
//     {
//     const [emailCheck] = await pool.promise().query(
//       "SELECT COUNT(*) AS email_count FROM front_users WHERE email = ? AND id != ?",
//       [email, userId]
//     );

//     if (emailCheck[0].email_count > 0) {
//       return res.status(409).json({
//         success: false,
//         errors: { email: ["Email already exists"] },
//         message: "Email already exists"
//       });
//     }
//   }

//     // Update front_users
//     await pool.promise().query(
//       `UPDATE front_users
//        SET name = ?, email = ?, mobile = ?, category_id = ?, class_id = ?, city = ?,  registration_type = ?, center_id = ?, status = ?
//        WHERE id = ?`,
//       [name, email, mobile, category_id, class_id, city, registration_type, center_id, status, userId]
//     );

//     // Handle course re-assignment
//     const dayjs = require("dayjs");
// const durationPlugin = require("dayjs/plugin/duration");
// const advancedFormat = require("dayjs/plugin/advancedFormat");
// const utc = require("dayjs/plugin/utc");
// const timezone = require("dayjs/plugin/timezone");

// dayjs.extend(durationPlugin);
// dayjs.extend(advancedFormat);
// dayjs.extend(utc);
// dayjs.extend(timezone);

// // ✅ Inside the function
// if (Array.isArray(course) && course.length > 0) {
//   await pool.promise().query(
//     "DELETE FROM course_orders WHERE user_id = ? AND assign_by = 'admin'",
//     [userId]
//   );

//   for (const courseId of course) {
//     try {
//       const [courseRows] = await pool.promise().query(
//         "SELECT course_name, offer_price, course_type, duration FROM courses WHERE id = ?",
//         [courseId]
//       );

//       if (courseRows.length === 0) continue;

//       const courseData = courseRows[0];
//       const transactionId = "admin" + Math.floor(100000 + Math.random() * 900000);
//       const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000) + "-admin";

//       const durationInMonths = parseInt(courseData.duration);
//       const safeDuration = isNaN(durationInMonths) ? 0 : durationInMonths;
//       const expiredDate = dayjs().add(safeDuration, 'month').format('YYYY-MM-DD');

//       await pool.promise().query(
//         `INSERT INTO course_orders (
//           user_id, course_id, transaction_id, course_name, course_expired_date,
//           course_amount, total_amount, payment_type, order_status,
//           source, assign_by, payment_status, order_id, order_type
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           userId,
//           courseId,
//           transactionId,
//           courseData.course_name,
//           expiredDate,
//           courseData.offer_price,
//           0,
//           "online",
//           "complete",
//           "web",
//           "admin",
//           "complete",
//           orderId,
//           "course"
//         ]
//       );
//     } catch (err) {
//       console.error(`Error inserting course order for course ID ${courseId}:`, err.message);
//     }
//   }
// }

//     return res.status(200).json({
//       success: true,
//       redirect_url: "/admin/student-list",
//       message: "Student updated successfully"
//     });
//   } catch (error) {
//     console.error("Update Error:", error);
//     return res.status(500).json({
//       success: false,
//       errors: { message: error.message || "Unexpected server error" }
//     });
//   }
// };

const Update = async (req, res) => {
  const userId = req.params.customerId;
  let {
    name,
    email,
    mobile,
    category_id,
    class_id,
    registration_type,
    status,
    course,
    city
  } = req.body;

  // Trim inputs
  name = name?.trim();
  email = email?.trim();
  mobile = mobile?.trim();
  registration_type = registration_type?.trim();
  
  let center_id = req.body.center_id; // Will be overridden for center users
  const updated_by = req.user.id; // Logged-in admin ID
  const userRoles = req.session.userRole || [];
  const loggedInUserId = req.user.id;
  
  // 🏢 Auto-assign center_id for center users (same logic as Store)
  if (userRoles.includes("Center")) {
    console.log('🏢 Center user updating student - User ID:', loggedInUserId);
    console.log('🏢 Form center_id (will be overridden):', center_id);
    
    // First check if user has direct center_id
    const [userData] = await pool.promise().query(
      `SELECT center_id, name FROM users WHERE id = ? LIMIT 1`,
      [loggedInUserId]
    );
    
    if (userData.length > 0 && userData[0].center_id) {
      center_id = userData[0].center_id;
      console.log('✅ Using direct center_id from users table:', center_id);
    } else if (userData.length > 0 && userData[0].name) {
      // Fallback to name matching
      const userName = userData[0].name;
      console.log('⚠️ User has no center_id, trying name matching for:', userName);
      
      const [centerMatch] = await pool.promise().query(
        `SELECT id FROM centers 
         WHERE TRIM(name) COLLATE utf8mb4_unicode_ci = TRIM(?) COLLATE utf8mb4_unicode_ci 
         AND deleted_at IS NULL
         LIMIT 1`,
        [userName]
      );
      
      if (centerMatch.length > 0) {
        center_id = centerMatch[0].id;
        console.log('✅ Using center_id from name match:', center_id);
      } else {
        console.log('❌ ERROR: Cannot find center for this center user');
        return res.status(400).json({
          success: false,
          errors: { center_id: ["Center not found for this user. Please contact admin."] },
          message: "Center not found for this user"
        });
      }
    }
  }
  
  const errors = {};

  // Validations
  if (!name) errors.name = ["Name is required"];
  if (!email) errors.email = ["Email is required"];
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ["Invalid email format"];
  if (!mobile) errors.mobile = ["Mobile is required"];
  else if (!/^\d{10}$/.test(mobile)) errors.mobile = ["Mobile number must be 10 digits"];
  if (!category_id) errors.category_id = ["Category is required"];
  if (!class_id) errors.class_id = ["Class is required"];
  if (!registration_type) errors.registration_type = ["Registration Type is required"];
  if (status === undefined || status === null || status === "") errors.status = ["Status is required"];
  if (!city) errors.city = ["City is required"];

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      success: false,
      errors,
      message: Object.values(errors)[0][0]
    });
  }

  try {
    // ✅ Duplicate check for email + mobile (ignore current user)
    if (userId) {
      const [duplicateCheck] = await pool.promise().query(
        `SELECT email, mobile 
         FROM front_users 
         WHERE (email = ? OR mobile = ?) AND id != ?`,
        [email, mobile, userId]
      );

      if (duplicateCheck.length > 0) {
        duplicateCheck.forEach((row) => {
          //if (row.email === email) errors.email = ["Email already exists"];
          //if (row.mobile === mobile) errors.mobile = ["Mobile already exists"];
        });

        // return res.status(409).json({
        //   success: false,
        //   errors,
        //   message: Object.values(errors)[0][0]
        // });
      }
    }

    // ✅ Update front_users
    await pool.promise().query(
      // `UPDATE front_users
      //  SET name = ?, email = ?, mobile = ?, category_id = ?, class_id = ?, city = ?, registration_type = ?, center_id = ?, status = ?
      //  WHERE id = ?`,
      // [name, email, mobile, category_id, class_id, city, registration_type, center_id, status, userId]

      `UPDATE front_users
       SET name = ?, email = ?, mobile = ?, category_id = ?, class_id = ?, city = ?, registration_type = ?, center_id = ?, status = ?, updated_by = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, email, mobile, category_id, class_id, city, registration_type, center_id, status, updated_by, userId]
    );
 

    // ✅ Re-assign courses
    const dayjs = require("dayjs");
    const durationPlugin = require("dayjs/plugin/duration");
    const advancedFormat = require("dayjs/plugin/advancedFormat");
    const utc = require("dayjs/plugin/utc");
    const timezone = require("dayjs/plugin/timezone");

    dayjs.extend(durationPlugin);
    dayjs.extend(advancedFormat);
    dayjs.extend(utc);
    dayjs.extend(timezone);

    if (Array.isArray(course) && course.length > 0) {
      await pool.promise().query(
        "DELETE FROM course_orders WHERE user_id = ? AND assign_by = 'admin'",
        [userId]
      );

      for (const courseId of course) {
        try {
          const [courseRows] = await pool.promise().query(
            "SELECT course_name, offer_price, course_type, duration FROM courses WHERE id = ?",
            [courseId]
          );

          if (courseRows.length === 0) continue;

          const courseData = courseRows[0];
          const transactionId = "admin" + Math.floor(100000 + Math.random() * 900000);
          const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000) + "-admin";

          const durationInMonths = parseInt(courseData.duration);
          const safeDuration = isNaN(durationInMonths) ? 0 : durationInMonths;
          const expiredDate = dayjs().add(safeDuration, "month").format("YYYY-MM-DD");

          await pool.promise().query(
            `INSERT INTO course_orders (
              user_id, course_id, transaction_id, course_name, course_expired_date,
              course_amount, total_amount, payment_type, order_status,
              source, assign_by, payment_status, order_id, order_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              courseId,
              transactionId,
              courseData.course_name,
              expiredDate,
              courseData.offer_price,
              0,
              "online",
              "complete",
              "web",
              "admin",
              "complete",
              orderId,
              "course"
            ]
          );
        } catch (err) {
          console.error(`Error inserting course order for course ID ${courseId}:`, err.message);
        }
      }
    }

    return res.status(200).json({
      success: true,
      redirect_url: "/admin/student-list",
      message: "Student updated successfully"
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      success: false,
      errors: { message: error.message || "Unexpected server error" }
    });
  }
};



const Delete = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const softDeleteQuery = `
      UPDATE front_users SET deleted_at = NOW(), status = 0 WHERE id = ?
    `;

    pool.query(softDeleteQuery, [customerId], (error, result) => {
      if (error) {
        console.error(error);
        req.flash("error", "Internal server error");
        return res.redirect("/admin/student-list");
      }

      req.flash("success", "Student soft deleted successfully");
      return res.redirect("/admin/student-list");
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect(`/admin/student-list`);
  }
};


const Restore = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const restoreQuery = `
      UPDATE front_users SET deleted_at = NULL, status = 0 WHERE id = ?
    `;

    pool.query(restoreQuery, [customerId], (error, result) => {
      if (error) {
        console.error(error);
        req.flash("error", "Internal server error");
        return res.redirect("/admin/student-list");
      }

      req.flash("success", "Student restored successfully");
      return res.redirect("/admin/student-list");
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect(`/admin/student-list`);
  }
};


const PermanentDelete = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const DeleteQuery = "DELETE FROM front_users WHERE id = ?";

    pool.query(DeleteQuery, [customerId], (error, result) => {
      if (error) {
        console.error(error);
        return req.flash("success", "Internal server error");
      }
    });

    req.flash("success", "Student deleted successfully");
    return res.redirect("/admin/student-list");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect(`/admin/student-list`);
  }
};

const Show = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    console.log(customerId);
    const getCustomerQuery = "SELECT * FROM front_users WHERE id = ?";
    const customer = await new Promise((resolve, reject) => {
      pool.query(getCustomerQuery, [customerId], function (error, result) {
        if (error) {
          console.error(error);
          req.flash("error", error.message);
          reject(error);
        } else {
          resolve(result[0]);
        }
      });
    });
    const categoryDetails = customer.category_id ? await Helper.getCategoryDetailsById(customer.category_id) : null;
    const centerDetails = customer.center_id ? await Helper.getCenterDetailsById(customer.center_id) : null;
    const courseClassDetails = customer.center_id ? await Helper.getCourseClassDetailsById(customer.class_id) : null;
    res.render("admin/customer/show", {
      success: req.flash("success"),
      error: req.flash("error"),
      customer: customer,
      form_url: "/admin/student-show/" + customerId,
      page_name: "Student Details",
      categoryDetails,
      centerDetails,
      courseClassDetails
    });
  } catch (error) {
    console.log(error.message);
  }
}
const Booking = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    

    const getCustomerQuery = "SELECT * FROM front_users WHERE id = ?";
    const customer = await new Promise((resolve, reject) => {
      pool.query(getCustomerQuery, [customerId], function (error, result) {
        if (error) {
          console.error(error);
          req.flash("error", error.message);
          reject(error);
        } else {
          resolve(result[0]);
        }
      });
    });

    const status = req.query.status || "active";
    const page_name = "Student Course Booking List";

    const query = `
      SELECT
        co.*,
        ts.course_name
      FROM course_orders co
      JOIN courses ts ON ts.id = co.course_id
      WHERE co.user_id = ? AND co.order_type = 'course'
      ORDER BY co.created_at DESC
    `;

    const [bookings] = await pool.promise().query(query, [customerId]);

    res.render("admin/customer/booking", {
      success: req.flash("success"),
      error: req.flash("error"),
      bookings,
      req,
      page_name,
      customerId,
      customer,
      list_url: "/admin/customer/list",
      trashed_list_url: "/admin/course-booking-list?status=trashed",
      create_url: "/admin/course-booking-create",
    });
  } catch (error) {
    console.error("CourseBooking List Error:", error);
    req.flash("error", "Server error in listing course bookings");
    res.redirect(req.get("Referrer") || "/");
  }
};


const testSeriesBooking = async (req, res) => {
  try {
    const customerId = req.params.customerId;
   
    const status = req.query.status || "active";
    const page_name = "Test Series Booking";

    const query = `
  SELECT
    co.*,
    ts.name AS course_name,
    fu.name AS student_name
  FROM course_orders co
  JOIN test_series ts ON ts.id = co.course_id
  JOIN front_users fu ON fu.id = co.user_id
  WHERE co.user_id = ? AND co.order_type = 'test'
  ORDER BY co.created_at DESC
`;

    const [bookings] = await pool.promise().query(query, [customerId]);
  
    
    res.render("admin/customer/booking", {
      success: req.flash("success"),
      error: req.flash("error"),
      bookings,
      req,
      page_name,
      customerId,
      list_url: "/admin/customer/list",
      trashed_list_url: "/admin/course-booking-list?status=trashed",
      create_url: "/admin/course-booking-create",
    });
  } catch (error) {
    console.error("Booking List Error:", error);
    req.flash("error", "Server error in listing course bookings");
    res.redirect(req.get("Referrer") || "/");
  }
};
// const importStudents = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Read the Excel file
//     const workbook = XLSX.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     if (!sheetData.length) {
//       return res.status(400).json({ error: "Excel file is empty" });
//     }

//     // Process each student row
//     for (const row of sheetData) {
//       const mobile = row["STUDENT NO"] || "";
//       const email = row["email ids"] || "";

//       // Skip rows without both mobile and email
//       if (!mobile && !email) continue;

//       // Check if mobile or email already exists
//       const [existingUser] = await pool
//         .promise()
//         .query(
//           `SELECT id FROM front_users WHERE mobile = ? OR email = ? LIMIT 1`,
//           [mobile, email]
//         );

//       if (existingUser.length > 0) {
       
//         continue;
//       }

//       // Insert new student
//       await pool.promise().query(
//         `INSERT INTO front_users (name, email, mobile, parent_no, category_id, class_id, center_id, father_name, city)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           row["Name of the Students"] || "",
//           email,
//           mobile,
//           row["PARENT NO"] || "",
//           row["STREAM"] || "",
//           row["CLASS"] || "",
//           row["Center"] || "",
//           row["FATHERS NAME"] || "",
//           row["ADDRESS CITY"] || "",
//         ]
//       );
//     }

//     // Remove uploaded file
//     fs.unlinkSync(req.file.path);

//     return res.status(200).json({ message: "Students imported successfully" });
//   } catch (error) {
//     console.error("Error importing students:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };
const importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Get form data from request
    const { center_id, category_id, class_id, course_id } = req.body;
    
    // Get user info
    const userRoles = req.session.userRole || [];
    const userId = req.user.id;

    // Determine registration_type based on user role
    const registration_type = userRoles.includes("Center") ? "center" : "admin";

    // Validate required dropdown selections
    if (!center_id) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Center is required" });
    }

    if (!category_id) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Stream is required" });
    }

    if (!class_id) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Class is required" });
    }

    // Optional: Validate course_id if provided
    if (course_id) {
      const [courseCheck] = await pool.promise().query(
        `SELECT id FROM courses WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
        [course_id]
      );
      
      if (courseCheck.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, message: "Invalid course selected" });
      }
    }

    // Role-based validation: Center users can only import to their own center
    if (userRoles.includes("Center")) {
      // Get user's name
      const [adminProfile] = await pool.promise().query(
        `SELECT name FROM users WHERE id = ? LIMIT 1`,
        [userId]
      );
      
      if (adminProfile.length > 0 && adminProfile[0].name) {
        // Get the center name by ID
        const [centerInfo] = await pool.promise().query(
          `SELECT name FROM centers WHERE id = ? LIMIT 1`,
          [center_id]
        );
        
        if (centerInfo.length === 0) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ 
            success: false, 
            message: "Invalid center selected" 
          });
        }
        
        // Check if user's name matches the center's name
        if (adminProfile[0].name !== centerInfo[0].name) {
          fs.unlinkSync(req.file.path);
          return res.status(403).json({ 
            success: false, 
            message: "You can only import students to your own center" 
          });
        }
      } else {
        fs.unlinkSync(req.file.path);
        return res.status(403).json({ 
          success: false, 
          message: "User profile not found" 
        });
      }
    }

    // Read the Excel/CSV file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Excel file is empty" });
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    console.log(`Starting import: Center ID=${center_id}, Category ID=${category_id}, Class ID=${class_id}, Course ID=${course_id || 'None'}`);
    console.log(`Registration Type: ${registration_type}`);

    // Process each student row
    for (const row of sheetData) {
      const mobile = (String(row["student_no"] || "")).trim();
      const email = (String(row["email"] || "")).trim();
      const name = (String(row["name"] || "")).trim();

      // Skip rows without both mobile and email
      if (!mobile && !email) {
        skipped++;
        continue;
      }

      // Check if mobile or email already exists
      const [existingUser] = await pool
        .promise()
        .query(
          `SELECT id FROM front_users WHERE mobile = ? OR email = ? LIMIT 1`,
          [mobile, email]
        );

      if (existingUser.length > 0) {
        // Update existing user
        await pool.promise().query(
          `UPDATE front_users 
           SET name = ?, 
               parent_no = ?, 
               category_id = ?, 
               class_id = ?, 
               center_id = ?, 
               course_id = ?,
               father_name = ?, 
               city = ?, 
               registration_source = ?,
               registration_type = ?,
               updated_at = NOW()
           WHERE id = ?`,
          [
            name,
            row["parent_no"] || "",
            category_id,  // From dropdown
            class_id,     // From dropdown
            center_id,    // From dropdown (validated)
            course_id || null,  // Optional course from dropdown
            row["fathers_name"] || "",
            row["address_city"] || "",
            "excel",
            registration_type,  // "admin" or "center" based on user role
            existingUser[0].id,
          ]
        );
        updated++;
        console.log(`Updated student: ${name} (${email}) - Center ID: ${center_id}, Registration Type: ${registration_type}`);
      } else {
        // Insert new student
        await pool.promise().query(
          `INSERT INTO front_users 
           (name, email, mobile, parent_no, category_id, class_id, center_id, course_id, father_name, city, registration_source, registration_type, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            name,
            email,
            mobile,
            row["parent_no"] || "",
            category_id,  // From dropdown
            class_id,     // From dropdown
            center_id,    // From dropdown (validated)
            course_id || null,  // Optional course from dropdown
            row["fathers_name"] || "",
            row["address_city"] || "",
            "excel",
            registration_type,  // "admin" or "center" based on user role
            1,  // Active by default
          ]
        );
        inserted++;
        console.log(`Inserted student: ${name} (${email}) - Center ID: ${center_id}, Registration Type: ${registration_type}`);
      }
    }

    // Remove uploaded file
    fs.unlinkSync(req.file.path);

    console.log(`Import completed - Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`);

    return res.status(200).json({ 
      success: true, 
      message: `Import completed successfully!`,
      inserted: inserted,
      updated: updated,
      skipped: skipped
    });
  } catch (error) {
    console.error("Error importing students:", error);

    // Clean up file on error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message
    });
  }
};
const bulkDelete = (req, res) => {
  const { ids } = req.body; // array of student IDs

  if (!ids || !ids.length) {
    return res.json({ success: false, message: "No students selected." });
  }

  // Use placeholders to prevent SQL injection
  const placeholders = ids.map(() => "?").join(",");
  const sql = `UPDATE front_users SET deleted_at = NOW(), status = 0 WHERE id IN (${placeholders})`;

  pool.query(sql, ids, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Database error." });
    }

    return res.json({
      success: true,
      message: `${result.affectedRows} student(s) moved to trash successfully.`,
    });
  });
};
const bulkRestore = (req, res) => {
  const { ids } = req.body;

  if (!ids || !ids.length) {
    return res.json({ success: false, message: "No students selected." });
  }

  const placeholders = ids.map(() => "?").join(",");
  const sql = `UPDATE front_users SET deleted_at = NULL, status = 1 WHERE id IN (${placeholders})`;

  pool.query(sql, ids, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Database error." });
    }

    return res.json({
      success: true,
      message: `${result.affectedRows} student(s) restored successfully.`,
    });
  });
};

const { Parser } = require('json2csv');
// const exportFrontUsers = (req, res) => {
//   const userId = req.user.id
//   const sql = `
//     SELECT 
//       fu.id,
//       fu.name,
//       fu.email,
//       fu.mobile,
//       cat.category_name,
//       cl.name AS class_name,
//       fu.city,
//       CASE WHEN fu.status = '1' THEN 'Active' ELSE 'Inactive' END AS status,
//       fu.registration_source,
//       cent.name AS center_name,
//       fu.created_at,
//       fu.registration_type
//     FROM front_users fu
//     LEFT JOIN categories cat ON fu.category_id = cat.id
//     LEFT JOIN course_classes cl ON fu.class_id = cl.id
//     LEFT JOIN centers cent ON fu.center_id = cent.id
//     WHERE fu.deleted_at IS NULL
//   `;
//    const userRoles = req.session.userRole || [];
// if (userRoles.includes("Center")) {
//       getQuery += ` AND fu.center_id = ? `;
//       queryParams.push(userId);
//     }
//   pool.query(sql, (err, results) => {
//     if (err) {
//       console.error(err.stack);
//       return res.status(500).json({ success: false, message: 'Database error.', error: err.message });
//     }

//     if (!results.length) {
//       return res.status(404).json({ success: false, message: 'No user data found.' });
//     }

//     try {
//       const fields = [
//         'id',
//         'name',
//         'email',
//         'mobile',
//         'category_name',
//         'class_name',
//         'city',
//         'status',
//         'registration_source',
//         'center_name',
//         'created_at',
//         'registration_type'
//       ];

//       const parser = new Parser({ fields });
//       const csv = parser.parse(results);

//       // Generate filename with timestamp
//       const now = new Date();
//       const pad = (n) => n.toString().padStart(2, '0');
//       const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
//       const filename = `front_users_export_${timestamp}.csv`;

//       res.header('Content-Type', 'text/csv');
//       res.attachment(filename);
//       return res.send(csv);
//     } catch (parseErr) {
//       console.error(parseErr.stack);
//       return res.status(500).json({ success: false, message: 'Error generating CSV.', error: parseErr.message });
//     }
//   });
// };

const exportFrontUsers = (req, res) => {
  const userId = req.user.id;
  let sql = `
    SELECT 
      fu.id,
      fu.name,
      fu.email,
      fu.mobile,
      cat.category_name,
      cl.name AS class_name,
      fu.city,
      CASE WHEN fu.status = '1' THEN 'Active' ELSE 'Inactive' END AS status,
      fu.registration_source,
      cent.name AS center_name,
      fu.created_at,
      fu.registration_type
    FROM front_users fu
    LEFT JOIN categories cat ON fu.category_id = cat.id
    LEFT JOIN course_classes cl ON fu.class_id = cl.id
    LEFT JOIN centers cent ON fu.center_id = cent.id
    WHERE fu.deleted_at IS NULL
  `;

  const userRoles = req.session.userRole || [];
  const queryParams = [];

  if (userRoles.includes("Center")) {
    sql += ` AND fu.center_id = ? `;
    queryParams.push(userId);
  }

  pool.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error(err.stack);
      return res.status(500).json({ success: false, message: 'Database error.', error: err.message });
    }

    if (!results.length) {
      return res.status(404).json({ success: false, message: 'No user data found.' });
    }

    try {
      const fields = [
        'id',
        'name',
        'email',
        'mobile',
        'category_name',
        'class_name',
        'city',
        'status',
        'registration_source',
        'center_name',
        'created_at',
        'registration_type'
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(results);

      // Generate filename with timestamp
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
      const filename = `front_users_export_${timestamp}.csv`;

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
  Store,
  Edit,
  Update,
  Delete,
  Restore,
  PermanentDelete,
  Show,
  Booking,
  testSeriesBooking,
  importStudents,
  bulkDelete,
  bulkRestore,
  exportFrontUsers
};
