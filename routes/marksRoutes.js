const express = require("express");
const Marks = require("../models/Marks");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Received marks:", req.body);

    const { student, subject, marks, grade, result } = req.body;

    if (!student || !subject || marks === undefined || !grade || !result) {
      return res.status(400).json({
        message: "All fields are required",
        required: ["student", "subject", "marks", "grade", "result"]
      });
    }

    const newMarks = new Marks({
      student,
      subject,
      marks,
      grade,
      result
    });

    const savedMarks = await newMarks.save();

    res.status(201).json({
      message: "Marks added successfully",
      data: savedMarks
    });

  } catch (error) {
    console.error("MARKS ERROR:", error);

    res.status(500).json({
      message: "Error adding marks",
      error: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const marks = await Marks.find();

    res.status(200).json(marks);
  } catch (error) {
    res.status(500).json({
      message: "Error getting marks",
      error: error.message
    });
  }
});

module.exports = router;