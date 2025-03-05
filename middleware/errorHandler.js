export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message); // Log error for debugging

    res.status(err.status || 500).json({
        code: err.status || 500,
        message: err.message || "Internal Server Error"
    });
};
