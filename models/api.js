const express = require('express');

const router = express.Router();

const studentRoutes = require('./studentRoutes');
const marksRoutes = require('./marksRoutes');
const authRoutes = require('./authRoutes');


// Student routes
router.use('/students', studentRoutes);

// Marks routes
router.use('/marks', marksRoutes);

// Authentication routes
router.use('/auth', authRoutes);


module.exports = router;