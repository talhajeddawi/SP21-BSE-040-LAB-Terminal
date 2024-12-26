module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log the error (optional, for debugging)

    // Default error response
    res.status(err.status || 500).send({
        error: err.message || 'Internal Server Error',
    });
};
