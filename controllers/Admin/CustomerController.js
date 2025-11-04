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

    const userRoles = req.session.userRole || [];
  const userId = req.user.id;
    const queryParams = [];

    let getQuery = `
  SELECT 
    fu.*,
    c.category_name,
    cl.name AS class_name,
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
  WHERE 1 = 1
`;

 if (userRoles.includes("Center")) {
      getQuery += ` AND fu.center_id = ? `;
      queryParams.push(userId);
    }

    if (status1 === "trashed") {
      getQuery += ` AND fu.deleted_at IS NOT NULL `;
    } else if (status1 === "active") {
      getQuery += ` AND fu.deleted_at IS NULL AND fu.status = 1 `;
    } else if (status1 === "inactive") {
      getQuery += ` AND fu.deleted_at IS NULL AND fu.status = 0 `;
    } 
  
    if (search) {
      getQuery += ` AND (fu.name LIKE ? OR fu.mobile LIKE ? OR fu.email LIKE ?) `;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    getQuery += ` ORDER BY fu.id DESC `;

    const page_name =
      status1 === "trashed"
        ? "Trashed Student List"
        : status1 === "inactive"
        ? "Inactive Student List"
        : "Student List";

    const customers = await new Promise((resolve, reject) => {
      pool.query(getQuery, queryParams, (error, result) => {
        if (error) {
          req.flash("error", error.message);
          return reject(error);
        }
        resolve(result);
      });
    });
    courses = await Helper.getActiveCourses();
    res.render("admin/customer/list", {
      success: req.flash("success"),
      error: req.flash("error"),
      customers,
      req,
      page_name,
      status1,
      search,
      courses
    });
  } catch (error) {
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
      center_id,
      status,
    } = req.body;

    const created_by = req.session.adminUserId; // admin creating this user

    name = name?.trim();
    email = email?.trim();
    mobile = mobile?.trim();

    // Always set registration_type = admin
    const registration_type = "admin";

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
        (name, email, mobile, category_id, class_id, registration_type, center_id, status, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      pool.query(
        insertQuery,
        [
          name,
          email,
          mobile,
          category_id,
          class_id,
          registration_type, // always "admin"
          center_id,
          status, // always 1
          created_by, // admin id
        ],
        (err) => {
          if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({
              success: false,
              errors: [{ message: `Database error: ${err.message}` }],
            });
          }

          return res.status(200).json({
            success: true,
            redirect_url: "/admin/student-list",
            message: "Admin user saved successfully",
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
    center_id,
    status,
    course,
    city
  } = req.body;

  // Trim inputs
  name = name?.trim();
  email = email?.trim();
  mobile = mobile?.trim();
  registration_type = registration_type?.trim();
  center_id = center_id?.trim();
  const updated_by = req.user.id; // Logged-in admin ID
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
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    // Process each student row
    for (const row of sheetData) {
      const mobile = (String(row["STUDENT NO"] || "")).trim()
      const email = (String(row["email ids"] || "")).trim()

      if (!mobile && !email) continue;

      const [existingUser] = await pool
        .promise()
        .query(
          `SELECT id FROM front_users WHERE mobile = ? OR email = ? LIMIT 1`,
          [mobile, email]
        );

      if (existingUser.length > 0) {
        await pool.promise().query(
          `UPDATE front_users 
           SET name = ?, 
               parent_no = ?, 
               category_id = ?, 
               class_id = ?, 
               center_id = ?, 
               father_name = ?, 
               city = ?, 
               registration_source = ?, 
               updated_at = NOW()
           WHERE id = ?`,
          [
            row["Name of the Students"] || "",
            row["PARENT NO"] || "",
            row["STREAM"] || "",
            row["CLASS"] || "",
            row["Center"] || "",
            row["FATHERS NAME"] || "",
            row["ADDRESS CITY"] || "",
            "excel",
            existingUser[0].id,
          ]
        );
      } else {
        await pool.promise().query(
          `INSERT INTO front_users 
           (name, email, mobile, parent_no, category_id, class_id, center_id, father_name, city, registration_source, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            row["Name of the Students"] || "",
            email,
            mobile,
            row["PARENT NO"] || "",
            row["STREAM"] || "",
            row["CLASS"] || "",
            row["Center"] || "",
            row["FATHERS NAME"] || "",
            row["ADDRESS CITY"] || "",
            "excel",
          ]
        );
      }
    }

    fs.unlinkSync(req.file.path);

    return res.status(200).json({ message: "Students imported/updated successfully" });
  } catch (error) {
    console.error("Error importing students:", error);

    // send stack + error message in response
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      stack: error.stack,  // ⚡ shows full stack trace
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
