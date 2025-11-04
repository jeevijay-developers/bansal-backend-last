const pool = require("../db/database"); // Ensure this is your configured MySQL pool
const { format } = require("date-fns"); // For date formatting
const { BASE_URL, PUBLIC_PATH } = require("../config/constants");
// Helper function to format dates as "MM/dd/yyyy hh:mm AM/PM"
function formatDate(dateString) {
  const date = new Date(dateString);
  return format(date, "MM/dd/yyyy hh:mm a");
}

// async function getActiveTestSeries(filters = {}) {
//   try {
//     let query = `
//       SELECT
//         ts.*,
//         c.category_name
//       FROM
//         test_series ts
//       JOIN
//         categories c ON ts.category_id = c.id
//       WHERE
//         ts.status = 1
//         AND ts.deleted_at IS NULL
//     `;

//     const params = [];

//     // ✅ Filter by category_id if provided
//     if (filters.category_id) {
//       query += ` AND ts.category_id = ?`;
//       params.push(filters.category_id);
//     }

//     if (filters.course_type) {
//       query += ` AND ts.type = ?`;
//       params.push(filters.course_type);
//     }

//     // ✅ Sorting by price or serial number
//     if (filters.price_range === "low-to-high") {
//       query += ` ORDER BY COALESCE(ts.offer_price) ASC, ts.name ASC`;
//     } else if (filters.price_range === "high-to-low") {
//       query += ` ORDER BY COALESCE(ts.offer_price) DESC, ts.name ASC`;
//     } else {
//       query += ` ORDER BY ts.name ASC`;
//     }

//     // ✅ Execute after full query built
//     const [rows] = await pool.promise().execute(query, params);

//     return rows;
//   } catch (error) {
//     console.error("Error fetching active test series with category:", error);
//     throw error;
//   }
// }

async function getActiveTestSeries(filters = {}, userId) {
  try {
    let query = `
  SELECT 
    ts.id,
     ts.name,
    ts.type,
    ts.price,
    ts.discount,
     ts.category_id,
    ts.offer_price,
    DATE_FORMAT(CONVERT_TZ(ts.start_time, '+00:00', '+05:30'), '%Y-%m-%d %h:%i %p') AS start_time,
        DATE_FORMAT(CONVERT_TZ(ts.end_time, '+00:00', '+05:30'), '%Y-%m-%d %h:%i %p') AS end_time,
    ts.image,
    'price' AS discount_type,
    c.category_name 
  FROM 
    test_series ts
  JOIN 
    categories c ON ts.category_id = c.id
  WHERE 
    ts.status = 1 
    AND ts.deleted_at IS NULL
`;

    const params = [];

    // ✅ Filter by category_id if provided
    if (filters.category_id) {
      query += ` AND ts.category_id = ?`;
      params.push(filters.category_id);
    }

    if (filters.course_type) {
      query += ` AND ts.type = ?`;
      params.push(filters.course_type);
    }

    // ✅ Sorting by price or serial number
    if (filters.price_range === "low-to-high") {
      query += ` ORDER BY COALESCE(ts.offer_price) ASC, ts.name ASC`;
    } else if (filters.price_range === "high-to-low") {
      query += ` ORDER BY COALESCE(ts.offer_price) DESC, ts.name ASC`;
    } else {
      query += ` ORDER BY ts.name ASC`;
    }

    // ✅ Execute after full query built
    const [rows] = await pool.promise().execute(query, params);

    // Add is_paid
    for (let ts of rows) {
      const [order] = await pool.promise().query(
        `SELECT id FROM course_orders 
         WHERE user_id = ? 
           AND course_id = ? 
           AND order_type = 'test' 
          AND (payment_status = 'complete' OR payment_status = 'completed')
           
         LIMIT 1`,
        [userId, ts.id]
      );
      ts.is_paid = order.length > 0;
    }

    return rows;

    return rows;
  } catch (error) {
    console.error("Error fetching active test series with category:", error);
    throw error;
  }
}

const getActiveCourseListing = async (
  columns = [],
  filters = {},
  userId = null
) => {
  try {
    const courseFields =
      columns.length > 0
        ? columns.map((col) => `c.\`${col}\``).join(", ")
        : "c.*";

    const selectFields = `${courseFields}, cat.category_name, cls.name AS class_name`;

    let query = `
      SELECT ${selectFields}
      FROM courses c
      JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN course_classes cls ON cls.id = c.course_class_id
      WHERE c.status = 1 AND c.deleted_at IS NULL
    `;

    const params = [];

    // Filter by category_id if provided
    if (filters.category_id) {
      query += ` AND c.category_id = ?`;
      params.push(filters.category_id);
    }

    // Filter by course_type if provided
    if (filters.course_type) {
      query += ` AND c.course_type = ?`;
      params.push(filters.course_type);
    }

    // Filter by course_class_id if provided
    if (filters.course_class_id) {
      query += ` AND c.course_class_id = ?`;
      params.push(filters.course_class_id);
    }

    // Sorting
    if (filters.price_range === "low-to-high") {
      query += ` ORDER BY COALESCE(c.offer_price, c.price) ASC, c.course_serial_no ASC`;
    } else if (filters.price_range === "high-to-low") {
      query += ` ORDER BY COALESCE(c.offer_price, c.price) DESC, c.course_serial_no ASC`;
    } else {
      query += ` ORDER BY c.course_serial_no ASC`;
    }

    const [courses] = await pool.promise().query(query, params);

    // ✅ If user is logged in, check purchased courses
    if (userId) {
      const [purchased] = await pool.promise().query(
        `
        SELECT course_id 
        FROM course_orders 
        WHERE user_id = ? AND order_type = 'course' 
        AND payment_status IN ('complete', 'completed')
      `,
        [userId]
      );

      const purchasedIds = purchased.map((p) => p.course_id);

      // Attach is_paid flag to each course
      return courses.map((course) => ({
        ...course,
        is_paid: purchasedIds.includes(course.id),
      }));
    }

    // Guest users → always false
    return courses.map((course) => ({
      ...course,
      is_paid: false,
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

const getActiveSubjectByCourseId = async (course_id) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT id, subject_name 
         FROM course_subjects 
         WHERE course_id = ? 
           AND status = 1 
           AND deleted_at IS NULL`,
      [course_id]
    );
    return rows;
  } catch (error) {
    console.error("Error in getActiveSubjectByCourseId:", error);
    throw error;
  }
};

const getActiveChaptersBySubjectId = async (subject_id) => {
  try {
    // 1. Get all active chapters for the subject
    const [chapters] = await pool.promise().query(
      `SELECT id, chapter_name 
         FROM course_chapters 
         WHERE subject_id = ? 
           AND status = 1 
           AND deleted_at IS NULL`,
      [subject_id]
    );

    if (chapters.length === 0) return [];

    // 2. Fetch videoCount and pdfCount for each chapter
    const chapterData = await Promise.all(
      chapters.map(async (chapter) => {
        const [videoCountRows] = await pool.promise().query(
          `SELECT COUNT(*) AS videoCount 
             FROM course_video 
             WHERE chapter_id = ? 
               AND status = 1 
               AND deleted_at IS NULL`,
          [chapter.id]
        );

        const [pdfCountRows] = await pool.promise().query(
          `SELECT COUNT(*) AS pdfCount 
             FROM course_pdf 
             WHERE chapter_id = ? 
               AND status = 1 
               AND deleted_at IS NULL`,
          [chapter.id]
        );

        return {
          ...chapter,
          videoCount: videoCountRows[0].videoCount || 0,
          pdfCount: pdfCountRows[0].pdfCount || 0,
        };
      })
    );

    return chapterData;
  } catch (error) {
    console.error("Error in getActiveChaptersBySubjectId:", error);
    throw error;
  }
};

const getActiveVideoCountBySubjectId = async (subject_id) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT COUNT(*) AS count 
         FROM course_video 
         WHERE subject_id = ? AND status = 1 AND deleted_at IS NULL`,
      [subject_id]
    );
    return rows[0].count || 0;
  } catch (error) {
    console.error("Error in getActiveVideoCountBySubjectId:", error);
    throw error;
  }
};

const getActiveVideoCountByChapterId = async (subject_id) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT COUNT(*) AS count 
         FROM course_video 
         WHERE chapter_id = ? AND status = 1 AND deleted_at IS NULL`,
      [subject_id]
    );
    return rows[0].count || 0;
  } catch (error) {
    console.error("Error in getActiveVideoCountByChapterId:", error);
    throw error;
  }
};
const getActiveVideoBySubjectId = async (
  subject_id,
  page = 1,
  perPage = 10
) => {
  try {
    const offset = (page - 1) * perPage;

    // 1. Get total count
    const [countRows] = await pool.promise().query(
      `SELECT COUNT(*) AS total 
       FROM course_video 
       WHERE subject_id = ? AND status = 1 AND deleted_at IS NULL`,
      [subject_id]
    );
    const total = countRows[0].total || 0;

    // 2. Get paginated data
    const [rows] = await pool.promise().query(
      `SELECT id AS video_title, video_url
       FROM course_video 
       WHERE subject_id = ? AND status = 1 AND deleted_at IS NULL 
       ORDER BY id DESC 
       LIMIT ? OFFSET ?`,
      [subject_id, perPage, offset]
    );

    // 3. Add YouTube thumbnail for each video
    const data = rows.map((video) => {
      const videoIdMatch = video.video_url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/
      );
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      return {
        ...video,
        thumbnail: videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : null,
      };
    });

    return {
      data,
      total,
      per_page: perPage,
      current_page: page,
      total_pages: Math.ceil(total / perPage),
    };
  } catch (error) {
    console.error("Error in getActiveVideoBySubjectId:", error);
    throw error;
  }
};

const getActiveVideoByChapterId = async (
  chapter_id,
  page = 1,
  perPage = 10
) => {
  try {
    // Ensure page and perPage are integers
    page = parseInt(page) || 1;
    perPage = parseInt(perPage) || 10;

    const offset = (page - 1) * perPage;

    // 1. Get total count
    const [countRows] = await pool.promise().query(
      `SELECT COUNT(*) AS total 
       FROM course_video 
       WHERE chapter_id = ? AND status = 1 AND deleted_at IS NULL`,
      [chapter_id]
    );
    const total = countRows[0].total || 0;

    // 2. Get paginated data
    const [rows] = await pool.promise().query(
      `SELECT id, video_title, video_url, video_sub_title 
       FROM course_video 
       WHERE chapter_id = ? AND status = 1 AND deleted_at IS NULL 
       ORDER BY id ASC 
       LIMIT ? OFFSET ?`,
      [chapter_id, perPage, offset]
    );

    // 3. Add YouTube thumbnail for each video
    const data = rows.map((video) => {
      const videoIdMatch = video.video_url
        ? video.video_url.match(
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
          )
        : null;
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      return {
        ...video,
        thumbnail: videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : null,
      };
    });

    // 4. Return paginated response
    return {
      data,
      total,
      per_page: perPage,
      current_page: page,
      total_pages: total > 0 ? Math.ceil(total / perPage) : 0,
    };
  } catch (error) {
    console.error("Error in getActiveVideoByChapterId:", error);
    throw error;
  }
};

const getActivePdfBySubjectId = async (subject_id, page = 1, perPage = 10) => {
  try {
    const offset = (page - 1) * perPage;

    // 1. Get total count
    const [countRows] = await pool.promise().query(
      `SELECT COUNT(*) AS total 
       FROM course_pdf 
       WHERE subject_id = ? AND status = 1 AND deleted_at IS NULL`,
      [subject_id]
    );
    const total = countRows[0].total || 0;

    // 2. Get paginated data
    const [data] = await pool.promise().query(
      `SELECT id AS title,link, pdf,  document_extenstion
       FROM course_pdf 
       WHERE subject_id = ? AND status = 1 AND deleted_at IS NULL 
       ORDER BY id DESC 
       LIMIT ? OFFSET ?`,
      [subject_id, perPage, offset]
    );

    return {
      pdfList: data,
      total,
      per_page: perPage,
      current_page: page,
      total_pages: Math.ceil(total / perPage),
    };
  } catch (error) {
    console.error("Error in getActivePdfBySubjectId:", error);
    throw error;
  }
};

const getActivePdfByChapterId = async (chapter_id, page = 1, perPage = 10) => {
  try {
    const offset = (page - 1) * perPage;

    // 1. Get total count
    const [countRows] = await pool.promise().query(
      `SELECT COUNT(*) AS total 
       FROM course_pdf 
       WHERE chapter_id = ? AND status = 1 AND deleted_at IS NULL`,
      [chapter_id]
    );
    const total = countRows[0].total || 0;

    // 2. Get paginated data
    const [data] = await pool.promise().query(
      `SELECT id AS title,link,pdf, document_extenstion
       FROM course_pdf 
       WHERE chapter_id = ? AND status = 1 AND deleted_at IS NULL 
       ORDER BY id DESC 
       LIMIT ? OFFSET ?`,
      [chapter_id, perPage, offset]
    );

    return {
      pdfList: data,
      total,
      per_page: perPage,
      current_page: page,
      total_pages: Math.ceil(total / perPage),
    };
  } catch (error) {
    console.error("Error in getActivePdfByChapterId:", error);
    throw error;
  }
};

const getPdfCountBySubjectId = async (subject_id) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT COUNT(*) AS count 
         FROM course_pdf 
         WHERE subject_id = ? AND status = 1 AND deleted_at IS NULL`,
      [subject_id]
    );
    return rows[0].count || 0;
  } catch (error) {
    console.error("Error in getPdfCountBySubjectId:", error);
    throw error;
  }
};

const getPdfCountByChapterId = async (chapter_id) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT COUNT(*) AS count 
         FROM course_pdf 
         WHERE chapter_id = ? AND status = 1 AND deleted_at IS NULL`,
      [chapter_id]
    );
    return rows[0].count || 0;
  } catch (error) {
    console.error("Error in getPdfCountByChapterId:", error);
    throw error;
  }
};

const getLiveTestCountBySubjectId = async (subject_id) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT COUNT(*) AS count 
         FROM live_test
         WHERE subject_id = ? AND status = 1 AND deleted_at IS NULL`,
      [subject_id]
    );
    return rows[0].count || 0;
  } catch (error) {
    console.error("Error in getLiveTestCountBySubjectId:", error);
    throw error;
  }
};

const getLiveClassCountBySubjectId = async (subject_id) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT COUNT(*) AS count 
         FROM live_classes 
         WHERE subject_id = ? AND status = 1 AND deleted_at IS NULL`,
      [subject_id]
    );
    return rows[0].count || 0;
  } catch (error) {
    console.error("Error in getLiveClassCountBySubjectId:", error);
    throw error;
  }
};

const getLiveClassCountByChapterId = async (chapter_id) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT COUNT(*) AS count 
         FROM live_classes 
         WHERE chapter_id = ? AND status = 1 AND deleted_at IS NULL`,
      [chapter_id]
    );
    return rows[0].count || 0;
  } catch (error) {
    console.error("Error in getLiveClassCountByChapterId:", error);
    throw error;
  }
};
const getBooksGroupedByCategory = async () => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT 
        b.id,
        b.book_name,
        b.title_heading,
        b.slug,
        b.class_id,
        b.price,
        b.discount,
        b.book_type,
        b.batch_year,
        b.offer_price,
        c.id AS category_id,
        c.category_name
      FROM books b
      JOIN categories c ON b.category_id = c.id
      WHERE b.status = 1 AND b.deleted_at IS NULL
      ORDER BY c.category_name, b.id DESC
    `);

    // Group books by category
    const grouped = new Map();
    rows.forEach((row) => {
      const { category_id, category_name, ...bookDetails } = row;

      if (!grouped.has(category_id)) {
        grouped.set(category_id, {
          type: "book",
          category_id,
          category_name,
          books: [],
        });
      }

      grouped.get(category_id).books.push(bookDetails);
    });

    // Fetch best-selling books (top 6 by order count)
    const [bestSellingRows] = await pool.promise().query(`
      SELECT 
        b.id,
        b.book_name,
        b.title_heading,
        b.slug,
        b.class_id,
        b.price,
        b.discount,
        b.book_type,
        b.batch_year,
        b.offer_price
      FROM books b
      JOIN book_orders bo ON bo.book_id = b.id
      WHERE b.status = 1 AND b.deleted_at IS NULL
      GROUP BY b.id
      ORDER BY COUNT(bo.id) DESC
      LIMIT 6
    `);

    const bestSelling = {
      type: "best_selling",
      category_name: "Best Selling Books",
      books: bestSellingRows,
    };

    // Fetch latest published books (top 6 by ID DESC)
    const [latestBooksRows] = await pool.promise().query(`
      SELECT 
        b.id,
        b.book_name,
        b.title_heading,
        b.slug,
        b.class_id,
        b.price,
        b.discount,
        b.book_type,
        b.batch_year,
        b.offer_price
      FROM books b
      WHERE b.status = 1 AND b.deleted_at IS NULL
      ORDER BY b.id DESC
      LIMIT 6
    `);

    const latestPublished = {
      type: "latest_published",
      category_name: "Latest Published Books",
      books: latestBooksRows,
    };

    // Combine all groups
    return [bestSelling, latestPublished, ...Array.from(grouped.values())];
  } catch (error) {
    console.error("Error in getBooksGroupedByCategory:", error);
    throw error;
  }
};

const getCourseBySlug = async (course_id, userId, columns = ["c.*"]) => {
  try {
    // Step 1: Get main course info

    const [courseRows] = await pool.promise().query(
      `SELECT ${columns.join(", ")}, 
                cat.category_name AS category_name, 
                cls.name AS class_name
         FROM courses c
         LEFT JOIN categories cat ON cat.id = c.category_id
         LEFT JOIN course_classes cls ON cls.id = c.course_class_id
         WHERE c.id = ? 
         AND c.deleted_at IS NULL
         LIMIT 1`,
      [course_id]
    );

    if (courseRows.length === 0) return null;

    const course = courseRows[0];

    if (userId) {
      const [latestOrderRows] = await pool.promise().query(
        `SELECT * FROM course_orders
   WHERE course_id = ? 
     AND user_id = ? 
     AND (payment_status = 'complete' OR payment_status = 'completed')
    
     AND order_type = 'course'
   ORDER BY created_at DESC
   LIMIT 1`,
        [course_id, userId]
      );

      if (latestOrderRows.length > 0) {
        course.is_paid = true;
        course.latest_order = latestOrderRows[0]; // latest order details
      } else {
        course.is_paid = false;
        course.latest_order = latestOrderRows[0]; // latest order details
      }
    } else {
      course.is_paid = false;
    }
    // Step 2: Get subject names and count
    const [subjectData] = await pool.promise().query(
      `SELECT 
           GROUP_CONCAT(subject_name ORDER BY id ASC SEPARATOR ', ') AS subject_names,
           COUNT(*) AS subject_count
         FROM course_subjects 
         WHERE course_id = ?`,
      [course.id]
    );

    course.subject_names = subjectData[0].subject_names || "";

    course.subject_count = subjectData[0].subject_count || 0;

    // Step 3: Get video count
    const [videoData] = await pool
      .promise()
      .query(
        `SELECT COUNT(*) AS video_count FROM course_video WHERE course_id = ?`,
        [course.id]
      );

    course.video_count = videoData[0].video_count || 0;

    // Step 4: Get pdf count
    const [pdfData] = await pool
      .promise()
      .query(
        `SELECT COUNT(*) AS pdf_count FROM course_pdf WHERE course_id = ?`,
        [course.id]
      );

    course.pdf_count = pdfData[0].pdf_count || 0;

    return course;
  } catch (error) {
    console.error("Error in getCourseBySlug:", error);
    throw error;
  }
};

module.exports = {
  formatDate,
  getActiveTestSeries,
  getActiveCourseListing,
  getActiveVideoCountBySubjectId,
  getLiveClassCountBySubjectId,
  getPdfCountBySubjectId,
  getActivePdfBySubjectId,
  getLiveTestCountBySubjectId,
  getActiveVideoBySubjectId,
  getActiveVideoCountBySubjectId,
  getActiveSubjectByCourseId,
  getBooksGroupedByCategory,
  getActiveChaptersBySubjectId,
  getActiveVideoByChapterId,
  getActiveVideoCountByChapterId,
  getActivePdfByChapterId,
  getPdfCountByChapterId,
  getLiveClassCountByChapterId,
  getCourseBySlug,
};
