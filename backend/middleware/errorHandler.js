const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[ERROR] ${req.method} ${req.url} → ${message}`);
  res.status(status).json({ message });
};

module.exports = errorHandler;
