export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);
    console.error("Stack Trace:", err.stack);

    res.status(err.status || 500).json({
        code: err.status || 500,
        message: err.message || "Internal Server Error"
    });
};
