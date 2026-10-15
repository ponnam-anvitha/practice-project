
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// CREATE STUDENT
router.post("/", async (req, res) => {
  try {
    const { studentName, email, rollNumber, department, year } = req.body;

    if (!studentName?.trim() || !email?.trim() ||
        !rollNumber?.trim() || !department?.trim() || !year?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All student fields are required",
      });
    }

    const existingStudent = await Student.findOne({
      rollNumber: rollNumber.trim(),
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Roll number already exists",
      });
    }

    const student = await Student.create({
      studentName: studentName.trim(),
      email: email.trim().toLowerCase(),
      rollNumber: rollNumber.trim(),
      department: department.trim(),
      year: year.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Student saved successfully",
      data: student,
    });
  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to save student",
    });
  }
});

// GET ALL STUDENTS
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch students",
    });
  }
});

module.exports = router;
