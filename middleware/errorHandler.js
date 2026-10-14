import multer from "multer";

// catches any request that didn't match a route
export const notFound = (req, res, next) => {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// four parameters is what makes Express treat this as an error handler
export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message;

  if (err instanceof multer.MulterError) {
    status = 400;
    if (err.code === "LIMIT_FILE_SIZE") message = "Image must be under 2 MB";
  } else if (err.name === "ValidationError") {
    status = 400; // mongoose schema validation
  } else if (err.name === "CastError") {
    status = 400; // e.g. GET /api/posts/abc, where "abc" isn't a valid ObjectId
    message = "Invalid ID format";
  } else if (err.code === 11000) {
    status = 409; // duplicate key, e.g. an email that already exists
    message = "That value already exists";
  } else if (err.type === "entity.parse.failed") {
    status = 400; // malformed JSON in the request body
    message = "Invalid JSON in request body";
  }

  console.error(err); // full details stay in your terminal

  // never leak internals for real server errors in production
  if (status === 500 && process.env.NODE_ENV === "production") {
    message = "Something went wrong";
  }

  res.status(status).json({ message });
};
