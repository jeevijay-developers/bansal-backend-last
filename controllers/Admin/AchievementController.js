const pool = require("../../db/database");
const path = require("path");
const fs = require("fs");
const Helper = require("../../helpers/Helper");

const table_name = "achievements";
const folder_path = "achievement";
const module_name = "Achievements";
const route = "achievement";
const actions_url = `/admin/${folder_path}`;

const runQuery = (query, params = []) =>
  new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
const List = async (req, res) => {
  try {
    const table_name = "achievements";
    const status = req.query.status;

    let where =
      status === "trashed"
        ? `WHERE ${table_name}.deleted_at IS NOT NULL`
        : `WHERE ${table_name}.deleted_at IS NULL`;

    const query = `
      SELECT ${table_name}.*
      FROM ${table_name}
      ${where}
      ORDER BY ${table_name}.id DESC
    `;

    const page_name =
      status === "trashed" ? "Trashed Achievements List" : "Achievements List";

    const achievements = await pool.promise().query(query);
    res.render("admin/achievement/list", {
      success: req.flash("success"),
      error: req.flash("error"),
      data: achievements[0],
      req,
      page_name,
      list_url: "/admin/achievement-list",
      trashed_list_url: "/admin/achievement-list/?status=trashed",
      create_url: "/admin/achievement-create",
    });
  } catch (error) {
    console.error("Achievement List Error:", error);
    req.flash("error", error.message);
    res.redirect(req.get("Referrer") || "/admin/achievement-list");
  }
};

// ✅ Create Achievement View
const Create = async (req, res) => {
  try {
    let post = {};
    res.render("admin/achievement/create", {
      success: req.flash("success"),
      error: req.flash("error"),
      form_url: "/admin/achievement-store",
      page_name: "Achievement",
      action: "Create",
      title: "Achievement",
      post,
    });
  } catch (error) {
    console.error(error.message);
    req.flash("error", "An error occurred while fetching data.");
    res.redirect("/admin/achievement-list");
  }
};
const Store = async (req, res) => {
  console.log("📌 Store function called"); // Debug entry log

  try {
    const { title, sort_order, status } = req.body;
    const files = req.files || [];

    console.log("📥 Request Body:", req.body);
    console.log("📂 Uploaded Files:", files);

    const errors = {};
    const created_by = req.user?.id || null;

    if (!title?.trim()) errors.title = ["Title is required"];
    if (!sort_order?.toString().trim()) errors.sort_order = ["Sort Order is required"];
    if (!status?.toString().trim()) errors.status = ["Status is required"];
    if (!files || files.length === 0)
      errors.gallery = ["At least one image is required"];

    if (Object.keys(errors).length > 0) {
      console.warn("⚠️ Validation Errors:", errors);
      return res.status(422).json({
        success: false,
        errors,
        message: Object.values(errors)[0][0],
      });
    }

    // Ensure sort_order is stored as integer
    const sortOrderVal = parseInt(sort_order, 10) || 0;

    for (const file of files) {
      const ext = path.extname(file.originalname).slice(1);
      const filePath = `/uploads/achievement/${file.filename}`;

      console.log(`📝 Inserting file into DB: ${file.originalname}`);

      await pool
        .promise()
        .query(
          `INSERT INTO achievements 
           (title, sort_order, gallery, extension, status, created_by, created_by_role)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [title, sortOrderVal, filePath, ext, status || 1, created_by, "Super Admin"]
        );
    }

   

    return res.json({
      success: true,
      redirect_url: `/admin/achievement-list`,
      message: "Achievement(s) uploaded successfully",
    });
  } catch (error) {
    console.error("❌ Achievement Store Error:", error.sqlMessage || error.message, error);
    return res.status(500).json({
      success: false,
      message: error.sqlMessage || "Server error",
    });
  }
};

const Edit = async (req, res) => {
  try {
    const postId = req.params.postId;
    const result = await runQuery(`SELECT * FROM ${table_name} WHERE id = ?`, [
      postId,
    ]);

    if (result.length === 0) {
      req.flash("error", `${module_name} not found`);
      return res.redirect(`/admin/${folder_path}-list`);
    }

    const post = result[0];
    const action = "Edit";
    res.render(`admin/${folder_path}/edit`, {
      success: req.flash("success"),
      error: req.flash("error"),
      form_url: `/admin/${route}-update/${postId}`,
      page_name: `Edit ${module_name}`,
      action: action,
      title: `${module_name}`,
      post,
    });
  } catch (error) {
    handleError(res, error, "Edit");
  }
};




const Update = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, sort_order, status } = req.body;
     const errors = {};
    if (!title?.trim()) errors.title = ["Title is required"];
    if (!sort_order?.toString().trim()) errors.sort_order = ["Sort Order is required"];
    if (!status?.toString().trim()) errors.status = ["Status is required"];
    if (Object.keys(errors).length > 0) {
      console.warn("⚠️ Validation Errors:", errors);
      return res.status(422).json({
        success: false,
        errors,
        message: Object.values(errors)[0][0],
      });
    }

    let gallery = null;
    let extension = null;

    // Check if post exists
    const rows = await runQuery(`SELECT * FROM ${table_name} WHERE id = ?`, [
      postId,
    ]);

    if (!rows || rows.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Post not found" });
    }

    // Keep old values by default
    gallery = rows[0].gallery;
    extension = rows[0].extension;

    // If new file uploaded, override
    if (req.file) {
      gallery = `/uploads/achievement/${req.file.filename}`;
      extension = path.extname(req.file.originalname).toLowerCase();
    }

    // Build update query (include extension too!)
    let updateFields = `title = ?,sort_order = ?, status = ?, gallery = ?, extension = ?`;
    let updateValues = [title,sort_order, status, gallery, extension, postId];

    await runQuery(
      `UPDATE ${table_name} SET ${updateFields} WHERE id = ?`,
      updateValues
    );

    res.send({ success: true, message: "Post updated successfully" });

  } catch (error) {
    console.error("Update Post Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Soft Delete
const Delete = async (req, res) => {
  try {
    const id = req.params.postId;
    await pool.promise().query(
      "UPDATE achievements SET deleted_at = NOW() WHERE id = ?",
      [id]
    );
    req.flash("success", "Achievement deleted successfully");
    res.redirect("/admin/achievement-list");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/admin/achievement-list");
  }
};

// ✅ Restore
const Restore = async (req, res) => {
  try {
    const id = req.query.id;
    await pool.promise().query(
      "UPDATE achievements SET deleted_at = NULL WHERE id = ?",
      [id]
    );
    req.flash("success", "Achievement restored successfully");
    res.redirect("/admin/achievement-list?status=trashed");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/admin/achievement-list?status=trashed");
  }
};

// ✅ Permanent Delete
const PermanentDelete = async (req, res) => {
  try {
    const id = req.query.id;
    await pool.promise().query("DELETE FROM achievements WHERE id = ?", [id]);
    req.flash("success", "Achievement permanently deleted");
    res.redirect("/admin/achievement-list?status=trashed");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/admin/achievement-list?status=trashed");
  }
};

module.exports = {
  List,
  Create,
  Store,
  Delete,
  Restore,
  Edit,
  Update,
  PermanentDelete,
};
