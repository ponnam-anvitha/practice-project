
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddMarks.css";

export default function AddMarks() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentName: "",
    rollNumber: "",
    subject: "",
    marks: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = Number(form.marks);

    if (form.marks === "" || value < 0 || value > 100) {
      setMessage("Marks must be between 0 and 100.");
      return;
    }

    const grade =
      value >= 90 ? "A+" :
      value >= 80 ? "A" :
      value >= 70 ? "B" :
      value >= 60 ? "C" :
      value >= 40 ? "D" : "F";

    const result = value >= 40 ? "Pass" : "Fail";

    const existing = JSON.parse(
      localStorage.getItem("marks") || "[]"
    );

    existing.push({
      id: Date.now(),
      studentName: form.studentName.trim(),
      rollNumber: form.rollNumber.trim(),
      subject: form.subject.trim(),
      marks: value,
      grade,
      result,
    });

    localStorage.setItem("marks", JSON.stringify(existing));

    setMessage("Marks saved successfully!");

    setForm({
      studentName: "",
      rollNumber: "",
      subject: "",
      marks: "",
    });
  };

  return (
    <div className="add-marks-page">
      <header className="add-marks-header">
        <p>INTERNAL MARKS MANAGEMENT SYSTEM</p>
        <h1>Add Student Marks</h1>
        <span>Enter student details and subject marks.</span>
      </header>

      <div className="add-marks-card">
        <h2>Student Marks Form</h2>
        <p className="add-marks-description">
          Fill in the details below.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="studentName">Student Name</label>
          <input
            id="studentName"
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="Enter student name"
            required
          />

          <label htmlFor="rollNumber">Roll Number</label>
          <input
            id="rollNumber"
            name="rollNumber"
            value={form.rollNumber}
            onChange={handleChange}
            placeholder="Enter roll number"
            required
          />

          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            required
          />

          <label htmlFor="marks">Marks (0–100)</label>
          <input
            id="marks"
            name="marks"
            type="number"
            min="0"
            max="100"
            value={form.marks}
            onChange={handleChange}
            placeholder="Enter marks"
            required
          />

          {message && (
            <div className="add-marks-message" role="status">
              {message}
            </div>
          )}

          <div className="add-marks-actions">
            <button type="submit" className="add-marks-save">
              Save Marks
            </button>

            <button
              type="button"
              className="add-marks-cancel"
              onClick={() => {
                setForm({
                  studentName: "",
                  rollNumber: "",
                  subject: "",
                  marks: "",
                });
                setMessage("");
              }}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      <button
        className="add-marks-back"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
