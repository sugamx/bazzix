const express = require('express');
const courseRoutes = require('./routes/courses');
const path = require('path');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads directory)
app.use('/uploads', express.static(path.join(__dirname, 'public/')));

// Routes
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
