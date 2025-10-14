const pool = require("../../db/database");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");
const Helper = require('../../helpers/Helper');
const { validateRequiredFields } = require("../../helpers/validationsHelper");
const fs = require("fs");
const path = require("path");

const List = async (req, res) => {
  try {
    const table_name = "galleries";
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
      status === "trashed" ? "Trashed Galleries List" : "Galleries List";

    const galleries = await new Promise((resolve, reject) => {
      pool.query(query, (err, result) => {
        if (err) {
          req.flash("error", err.message);
          return reject(err);
        }
        resolve(result);
      });
    });

    res.render("admin/gallery/list", {
      success: req.flash("success"),
      error: req.flash("error"),
      data: galleries,
      req,
      page_name,
      list_url: "/admin/gallery-list",
      trashed_list_url: "/admin/gallery-list/?status=trashed",
      create_url: "/admin/gallery-create",
    });

  } catch (error) {
    console.error("Gallery List Error:", error);
    req.flash("error", error.message);
    res.redirect(req.get("Referrer") || "/admin/gallery-list");
  }
};

const Create = async (req, res) => {
  try {
    let post = {};
    res.render("admin/gallery/create", {
      success: req.flash("success"),
      error: req.flash("error"),
      form_url: "/admin/gallery-store",
      page_name: "Create Gallery",
      action: "Create",
      title: "Gallery",
      post: post,
    });
  } catch (error) {
    console.log(error.message);
    req.flash("error", "An error occurred while fetching data.");
    res.redirect("/admin/gallery-list");
  }
};

const checkImagePath = (relativePath) => {
  const normalizedPath = path.normalize(relativePath);
  const fullPath = path.join(__dirname, "..", "public", normalizedPath);
  return fs.existsSync(fullPath);
};

const Store = async (req, res) => {
 try {
    const { title, status, type } = req.body; // Add type here
    const files = req.files || [];
    const errors = {};
    const created_by = req.user.id;

    // Validations
    if (!title?.trim()) errors.title = ["Title is required"];
    if (!type || (type !== "image" && type !== "video")) errors.type = ["Type must be image or video"];
    if (!files || files.length === 0) errors.gallery = ["At least one file is required"];

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        success: false,
        errors,
        message: Object.values(errors)[0][0],
      });
    }

    for (const file of files) {
      const ext = path.extname(file.originalname).slice(1);
      const filePath = `/uploads/gallery/${file.filename}`;

      await pool.promise().query(
        `INSERT INTO galleries (title, status, type, gallery, extension, created_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, status, type, filePath, ext, created_by]
      );
    }

    return res.json({
      success: true,
      redirect_url: `/admin/gallery-list/`,
      message: "Gallery uploaded successfully",
    });

  } catch (error) {
    console.error("Gallery Store Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const Delete = async (req, res) => {
  try {
    const galleryId = req.params.postId;
    const softDeleteQuery = "UPDATE galleries SET deleted_at = NOW() WHERE id = ?";

    pool.query(softDeleteQuery, [galleryId], (error, result) => {
      if (error) {
        console.error(error);
        return req.flash("success", "Internal server error");
      }
    });

    req.flash("success", "Gallery soft deleted successfully");
    return res.redirect("/admin/gallery-list");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect(`/admin/gallery-list`);
  }
};

const Restore = async (req, res) => {
  try {
    const galleryId = req.params.galleryId;
    const RestoreQuery = "UPDATE galleries SET deleted_at = NULL WHERE id = ?";

    pool.query(RestoreQuery, [galleryId], (error, result) => {
      if (error) {
        console.error(error);
        return req.flash("success", "Internal server error");
      }
    });

    req.flash("success", "Gallery Restored successfully");
    return res.redirect("/admin/gallery-list");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect(`/admin/gallery-list`);
  }
};

const PermanentDelete = async (req, res) => {
  try {
    const galleryId = req.params.galleryId;
    const DeleteQuery = "DELETE FROM galleries WHERE id = ?";

    pool.query(DeleteQuery, [galleryId], (error, result) => {
      if (error) {
        console.error(error);
        return req.flash("success", "Internal server error");
      }
    });

    req.flash("success", "Gallery deleted permanently");
    return res.redirect("/admin/gallery-list");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect(`/admin/gallery-list`);
  }
};

module.exports = {
  Create,
  List,
  Delete,
  Restore,
  PermanentDelete,
  Store,
};
