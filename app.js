const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/routesFile');
const errorHandler = require('./middlewares/errorHandlers'); // Import error handler

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB with proper error handling
mongoose.connect('mongodb://localhost:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  // Exit the process if DB connection fails
});

// Use routes
app.use('/api', bookRoutes);

// Centralized error handling
app.use(errorHandler); // Add error-handling middleware

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
