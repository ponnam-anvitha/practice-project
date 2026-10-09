const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// =========================
// CREATE STUDENT
// =========================

router.post("/", async (req, res) => {
  try {
    const {
      studentName,
      rollNumber,
      rollNo,
      department,
      branch,
      semester,
    } = req.body;

    const finalRollNumber = rollNumber || rollNo;
    const finalDepartment = department || branch;

    if (
      !studentName?.trim() ||
      !finalRollNumber?.trim() ||
      !finalDepartment?.trim() ||
      !String(semester || "").trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All student fields are required",
      });
    }

    const existingStudent = await Student.findOne({
      rollNumber: finalRollNumber.trim(),
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Roll number already exists",
      });
    }

    const student = await Student.create({
      studentName: studentName.trim(),
      rollNumber: finalRollNumber.trim(),
      department: finalDepartment.trim(),
      semester: String(semester).trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// GET ALL STUDENTS
// =========================

router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// UPDATE STUDENT
// =========================

router.put("/:id", async (req, res) => {
  try {
    const {
      studentName,
      rollNumber,
      rollNo,
      department,
      branch,
      semester,
    } = req.body;

    const finalRollNumber = rollNumber || rollNo;
    const finalDepartment = department || branch;

    if (
      !studentName?.trim() ||
      !finalRollNumber?.trim() ||
      !finalDepartment?.trim() ||
      !String(semester || "").trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All student fields are required",
      });
    }

    const duplicateStudent = await Student.findOne({
      rollNumber: finalRollNumber.trim(),
      _id: { $ne: req.params.id },
    });

    if (duplicateStudent) {
      return res.status(409).json({
        success: false,
        message: "Roll number already exists",
      });
    }

    const updatedStudent =
      await Student.findByIdAndUpdate(
        req.params.id,
        {
          studentName: studentName.trim(),
          rollNumber: finalRollNumber.trim(),
          department: finalDepartment.trim(),
          semester: String(semester).trim(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// DELETE STUDENT
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const deletedStudent =
      await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: deletedStudent,
    });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;