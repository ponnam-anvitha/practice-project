
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentDetails.css";

export default function StudentDetails() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    year: "",
  });

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setStudent((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/students",
        {
          studentName: student.name.trim(),
          email: student.email.trim(),
          rollNumber: student.rollNumber.trim(),
          department: student.department.trim(),
          year: student.year,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const savedStudents = JSON.parse(
        localStorage.getItem("students") || "[]"
      );

      const updatedStudents = [
        response.data.data,
        ...savedStudents.filter(
          (item) => item.rollNumber !== response.data.data.rollNumber
        ),
      ];

      localStorage.setItem("students", JSON.stringify(updatedStudents));

      setMessage("Student details saved successfully in MongoDB!");

      setStudent({
        name: "",
        email: "",
        rollNumber: "",
        department: "",
        year: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to save. Check login and backend server."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="student-page">
      <div className="student-card">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h1>Student Details</h1>
        <p className="student-subtitle">
          Enter the student information below.
        </p>

        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter full name"
            value={student.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={student.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="rollNumber">Roll Number</label>
          <input
            id="rollNumber"
            name="rollNumber"
            type="text"
            placeholder="Enter roll number"
            value={student.rollNumber}
            onChange={handleChange}
            required
          />

          <label htmlFor="department">Department</label>
          <input
            id="department"
            name="department"
            type="text"
            placeholder="Example: CSE"
            value={student.department}
            onChange={handleChange}
            required
          />

          <label htmlFor="year">Academic Year</label>
          <select
            id="year"
            name="year"
            value={student.year}
            onChange={handleChange}
            required
          >
            <option value="">Select year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <button type="submit" className="save-button" disabled={saving}>
            {saving ? "Saving..." : "Save Student Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
