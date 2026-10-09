import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "/api";

// Internal exam maximum marks
const MAX_MARKS = 30;

// Pass percentage
const PASS_PERCENTAGE = 40;

// --------------------------------------------------
// GRADE CALCULATION
// --------------------------------------------------
const calculatePercentage = (marks) => {
  const value = Number(marks);

  if (Number.isNaN(value)) {
    return 0;
  }

  return (value / MAX_MARKS) * 100;
};

const calculateGrade = (marks) => {
  const percentage = calculatePercentage(marks);

  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= PASS_PERCENTAGE) return "D";

  return "F";
};

const calculateResult = (marks) => {
  const percentage = calculatePercentage(marks);

  return percentage >= PASS_PERCENTAGE ? "Pass" : "Fail";
};

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingMarks, setLoadingMarks] = useState(false);

  const [studentSearch, setStudentSearch] = useState("");
  const [marksSearch, setMarksSearch] = useState("");

  const [showStudentModal, setShowStudentModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editingStudent, setEditingStudent] =
    useState(null);

  const [studentForm, setStudentForm] = useState({
    studentName: "",
    rollNumber: "",
    department: "",
    semester: "",
  });

  const [marksForm, setMarksForm] = useState({
    student: "",
    subject: "",
    marks: "",
  });

  // ==================================================
  // FETCH STUDENTS
  // ==================================================

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const response = await fetch(
        `${API_URL}/students`
      );

      const data = await response.json();

      if (data.success) {
        setStudents(data.data || []);
      }
    } catch (error) {
      console.error(
        "Error fetching students:",
        error
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  // ==================================================
  // FETCH MARKS
  // ==================================================

  const fetchMarks = async () => {
    try {
      setLoadingMarks(true);

      const response = await fetch(
        `${API_URL}/marks`
      );

      const data = await response.json();

      setMarks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Error fetching marks:",
        error
      );
    } finally {
      setLoadingMarks(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchMarks();
  }, []);

  // ==================================================
  // STUDENT HELPER
  // ==================================================

  const getStudent = (studentId) => {
    if (!studentId) {
      return null;
    }

    const id =
      typeof studentId === "object"
        ? studentId._id
        : studentId;

    return students.find(
      (student) => student._id === id
    );
  };

  const getStudentName = (studentId) => {
    const student = getStudent(studentId);

    return student
      ? student.studentName
      : "Unknown Student";
  };

  // ==================================================
  // ADD STUDENT
  // ==================================================

  const handleAddStudent = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/students`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to add student"
        );
        return;
      }

      alert(
        "Student added successfully!"
      );

      setStudentForm({
        studentName: "",
        rollNumber: "",
        department: "",
        semester: "",
      });

      setShowStudentModal(false);

      fetchStudents();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // ==================================================
  // EDIT STUDENT
  // ==================================================

  const openEditStudent = (student) => {
    setEditingStudent(student);

    setStudentForm({
      studentName:
        student.studentName || "",
      rollNumber:
        student.rollNumber || "",
      department:
        student.department || "",
      semester:
        student.semester || "",
    });

    setShowEditModal(true);
  };

  const handleEditStudent = async (event) => {
    event.preventDefault();

    if (!editingStudent) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/students/${editingStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update student"
        );
        return;
      }

      alert(
        "Student updated successfully!"
      );

      setShowEditModal(false);
      setEditingStudent(null);

      setStudentForm({
        studentName: "",
        rollNumber: "",
        department: "",
        semester: "",
      });

      fetchStudents();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // ==================================================
  // DELETE STUDENT
  // ==================================================

  const handleDeleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete student"
        );
        return;
      }

      alert(
        "Student deleted successfully!"
      );

      fetchStudents();
      fetchMarks();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // ==================================================
  // ADD MARKS
  // ==================================================

  const handleAddMarks = async (event) => {
    event.preventDefault();

    const markValue = Number(
      marksForm.marks
    );

    if (!marksForm.student) {
      alert("Please select a student");
      return;
    }

    if (!marksForm.subject.trim()) {
      alert("Please enter subject");
      return;
    }

    if (
      marksForm.marks === "" ||
      Number.isNaN(markValue) ||
      markValue < 0 ||
      markValue > MAX_MARKS
    ) {
      alert(
        `Marks must be between 0 and ${MAX_MARKS}`
      );
      return;
    }

    const grade =
      calculateGrade(markValue);

    const result =
      calculateResult(markValue);

    try {
      const response = await fetch(
        `${API_URL}/marks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student:
              marksForm.student,

            subject:
              marksForm.subject.trim(),

            marks: markValue,

            grade,

            result,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to add marks"
        );
        return;
      }

      alert(
        "Marks added successfully!"
      );

      setMarksForm({
        student: "",
        subject: "",
        marks: "",
      });

      await fetchMarks();

      setActivePage("Marks");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // ==================================================
  // FILTER STUDENTS
  // ==================================================

  const filteredStudents = useMemo(() => {
    const search =
      studentSearch
        .toLowerCase()
        .trim();

    if (!search) {
      return students;
    }

    return students.filter(
      (student) =>
        [
          student.studentName,
          student.rollNumber,
          student.department,
          student.semester,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search)
    );
  }, [students, studentSearch]);

  // ==================================================
  // FILTER MARKS
  // ==================================================

  const filteredMarks = useMemo(() => {
    const search =
      marksSearch
        .toLowerCase()
        .trim();

    if (!search) {
      return marks;
    }

    return marks.filter((mark) => {
      const student =
        getStudent(mark.student);

      const studentName =
        student?.studentName || "";

      const rollNumber =
        student?.rollNumber || "";

      return [
        studentName,
        rollNumber,
        mark.subject,
        mark.grade,
        mark.result,
        mark.marks,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [marks, marksSearch, students]);

  // ==================================================
  // DASHBOARD STATISTICS
  // ==================================================

  const totalStudents =
    students.length;

  const totalMarks =
    marks.length;

  const passedMarks =
    marks.filter(
      (mark) =>
        calculateResult(mark.marks) ===
        "Pass"
    ).length;

  const failedMarks =
    marks.filter(
      (mark) =>
        calculateResult(mark.marks) ===
        "Fail"
    ).length;

  const averageMarks =
    marks.length > 0
      ? (
          marks.reduce(
            (sum, mark) =>
              sum +
              Number(mark.marks || 0),
            0
          ) / marks.length
        ).toFixed(1)
      : "0.0";

  const averagePercentage =
    marks.length > 0
      ? Math.round(
          (Number(averageMarks) /
            MAX_MARKS) *
            100
        )
      : 0;

  const passPercentage =
    marks.length > 0
      ? Math.round(
          (passedMarks /
            marks.length) *
            100
        )
      : 0;

  // ==================================================
  // GRADE DISTRIBUTION
  // ==================================================

  const gradeCounts = {
    "A+": marks.filter(
      (mark) =>
        calculateGrade(mark.marks) ===
        "A+"
    ).length,

    A: marks.filter(
      (mark) =>
        calculateGrade(mark.marks) ===
        "A"
    ).length,

    B: marks.filter(
      (mark) =>
        calculateGrade(mark.marks) ===
        "B"
    ).length,

    C: marks.filter(
      (mark) =>
        calculateGrade(mark.marks) ===
        "C"
    ).length,

    D: marks.filter(
      (mark) =>
        calculateGrade(mark.marks) ===
        "D"
    ).length,

    F: marks.filter(
      (mark) =>
        calculateGrade(mark.marks) ===
        "F"
    ).length,
  };

  // ==================================================
  // PAGE NAVIGATION
  // ==================================================

  const goToPage = (page) => {
    setActivePage(page);
  };

  // ==================================================
  // DASHBOARD
  // ==================================================

  const renderDashboard = () => (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Internal Marks Management
            System
          </p>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            👤
          </div>

          <div>
            <strong>Admin</strong>
            <small>
              Administrator
            </small>
          </div>
        </div>
      </div>

      <div className="welcome-banner">
        <div>
          <h2>
            Welcome back, Admin 👋
          </h2>

          <p>
            Here's what's happening
            with your academic records
            today.
          </p>
        </div>

        <div className="welcome-icon">
          🎓
        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">
            🎓
          </div>

          <div>
            <span>
              Total Students
            </span>

            <strong>
              {totalStudents}
            </strong>

            <small>
              Registered students
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            📝
          </div>

          <div>
            <span>
              Marks Records
            </span>

            <strong>
              {totalMarks}
            </strong>

            <small>
              Total records
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            📈
          </div>

          <div>
            <span>
              Average Marks
            </span>

            <strong>
              {averageMarks}
            </strong>

            <small>
              Out of {MAX_MARKS}
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            ✅
          </div>

          <div>
            <span>
              Pass Percentage
            </span>

            <strong>
              {passPercentage}%
            </strong>

            <small>
              Current performance
            </small>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">

        <div className="dashboard-panel">
          <h2>
            Quick Actions
          </h2>

          <p>
            Frequently used actions
          </p>

          <div className="quick-actions">

            <button
              onClick={() => {
                setStudentForm({
                  studentName: "",
                  rollNumber: "",
                  department: "",
                  semester: "",
                });

                setShowStudentModal(
                  true
                );
              }}
            >
              🎓

              <span>
                <strong>
                  Add Student
                </strong>

                <small>
                  Register a new student
                </small>
              </span>
            </button>

            <button
              onClick={() =>
                setActivePage(
                  "Add Marks"
                )
              }
            >
              📝

              <span>
                <strong>
                  Add Marks
                </strong>

                <small>
                  Enter student marks
                </small>
              </span>
            </button>

            <button
              onClick={() =>
                setActivePage(
                  "Students"
                )
              }
            >
              👥

              <span>
                <strong>
                  View Students
                </strong>

                <small>
                  Manage student records
                </small>
              </span>
            </button>

            <button
              onClick={() =>
                setActivePage(
                  "Marks"
                )
              }
            >
              📊

              <span>
                <strong>
                  View Marks
                </strong>

                <small>
                  Check marks records
                </small>
              </span>
            </button>

          </div>
        </div>

        <div className="dashboard-panel">
          <h2>
            Performance Overview
          </h2>

          <p>
            Current marks summary
          </p>

          <div className="performance-row">
            <span>
              Passed
            </span>

            <strong>
              {passedMarks}
            </strong>
          </div>

          <div className="progress-bar">
            <div
              style={{
                width: `${
                  totalMarks
                    ? (passedMarks /
                        totalMarks) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>

          <div className="performance-row">
            <span>
              Failed
            </span>

            <strong>
              {failedMarks}
            </strong>
          </div>

          <div className="progress-bar fail">
            <div
              style={{
                width: `${
                  totalMarks
                    ? (failedMarks /
                        totalMarks) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>
                Recent Students
              </h2>

              <p>
                Recently registered
                students
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                setActivePage(
                  "Students"
                )
              }
            >
              View All
            </button>
          </div>

          {students
            .slice(0, 4)
            .map((student) => (
              <div
                className="recent-item"
                key={student._id}
              >
                <div className="recent-avatar">
                  {student.studentName
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div>
                  <strong>
                    {student.studentName}
                  </strong>

                  <small>
                    {student.rollNumber} •{" "}
                    {student.department}
                  </small>
                </div>
              </div>
            ))}

          {students.length === 0 && (
            <p>
              No students available.
            </p>
          )}
        </div>

        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>
                Recent Marks
              </h2>

              <p>
                Latest marks entries
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                setActivePage(
                  "Marks"
                )
              }
            >
              View All
            </button>
          </div>

          {marks
            .slice(-4)
            .reverse()
            .map((mark) => (
              <div
                className="recent-item"
                key={mark._id}
              >
                <div className="recent-avatar">
                  📝
                </div>

                <div>
                  <strong>
                    {mark.subject}
                  </strong>

                  <small>
                    {getStudentName(
                      mark.student
                    )}{" "}
                    • Marks:{" "}
                    {mark.marks}/
                    {MAX_MARKS}
                  </small>
                </div>

                <span
                  className={
                    calculateResult(
                      mark.marks
                    ) === "Pass"
                      ? "status-pass"
                      : "status-fail"
                  }
                >
                  {calculateResult(
                    mark.marks
                  )}
                </span>
              </div>
            ))}

          {marks.length === 0 && (
            <p>
              No marks available.
            </p>
          )}
        </div>

      </div>
    </>
  );

  // ==================================================
  // STUDENTS PAGE
  // ==================================================

  const renderStudents = () => (
    <>
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>
            Internal Marks Management
            System
          </p>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            👤
          </div>

          <div>
            <strong>Admin</strong>
            <small>
              Administrator
            </small>
          </div>
        </div>
      </div>

      <div className="content-card">

        <div className="content-card-header">

          <div>
            <h2>
              Students
            </h2>

            <p>
              Manage registered students
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              setStudentForm({
                studentName: "",
                rollNumber: "",
                department: "",
                semester: "",
              });

              setShowStudentModal(
                true
              );
            }}
          >
            + Add Student
          </button>

        </div>

        <div className="search-box">
          🔍

          <input
            type="text"
            placeholder="Search by name, roll number, branch or semester..."
            value={studentSearch}
            onChange={(event) =>
              setStudentSearch(
                event.target.value
              )
            }
          />
        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>
                  STUDENT ID
                </th>

                <th>
                  NAME
                </th>

                <th>
                  ROLL NUMBER
                </th>

                <th>
                  BRANCH
                </th>

                <th>
                  SEMESTER
                </th>

                <th>
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.map(
                (student) => (
                  <tr
                    key={student._id}
                  >
                    <td>
                      {student._id}
                    </td>

                    <td>
                      {student.studentName}
                    </td>

                    <td>
                      {student.rollNumber}
                    </td>

                    <td>
                      {student.department}
                    </td>

                    <td>
                      {student.semester}
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="edit-button"
                          onClick={() =>
                            openEditStudent(
                              student
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeleteStudent(
                              student._id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>

          {loadingStudents && (
            <div className="empty-state">
              Loading students...
            </div>
          )}

          {!loadingStudents &&
            filteredStudents.length ===
              0 && (
              <div className="empty-state">
                No students found.
              </div>
            )}

        </div>

      </div>
    </>
  );

  // ==================================================
  // MARKS PAGE
  // ==================================================

  const renderMarks = () => (
    <>
      <div className="page-header">

        <div>
          <h1>
            Marks
          </h1>

          <p>
            Internal Marks Management
            System
          </p>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            👤
          </div>

          <div>
            <strong>
              Admin
            </strong>

            <small>
              Administrator
            </small>
          </div>
        </div>

      </div>

      <div className="content-card">

        <div className="content-card-header">

          <div>
            <h2>
              Marks Records
            </h2>

            <p>
              View student academic
              performance
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              setActivePage(
                "Add Marks"
              )
            }
          >
            + Add Marks
          </button>

        </div>

        {/* SEARCH MARKS */}

        <div className="search-box">
          🔍

          <input
            type="text"
            placeholder="Search by student name, roll number or subject..."
            value={marksSearch}
            onChange={(event) =>
              setMarksSearch(
                event.target.value
              )
            }
          />
        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>

                <th>
                  STUDENT
                </th>

                <th>
                  ROLL NUMBER
                </th>

                <th>
                  SUBJECT
                </th>

                <th>
                  EXAM
                </th>

                <th>
                  MARKS
                </th>

                <th>
                  PERCENTAGE
                </th>

                <th>
                  GRADE
                </th>

                <th>
                  RESULT
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredMarks.map(
                (mark) => {
                  const student =
                    getStudent(
                      mark.student
                    );

                  const percentage =
                    calculatePercentage(
                      mark.marks
                    ).toFixed(1);

                  const grade =
                    calculateGrade(
                      mark.marks
                    );

                  const result =
                    calculateResult(
                      mark.marks
                    );

                  return (
                    <tr
                      key={
                        mark._id
                      }
                    >

                      <td>

                        <div className="student-cell">

                          <div className="table-avatar">
                            {student
                              ?.studentName
                              ?.charAt(
                                0
                              )
                              ?.toUpperCase() ||
                              "?"}
                          </div>

                          <div>

                            <strong>
                              {student
                                ?.studentName ||
                                "Unknown Student"}
                            </strong>

                            <small>
                              {student
                                ?.department ||
                                "-"}
                            </small>

                          </div>

                        </div>

                      </td>

                      <td>
                        {student
                          ?.rollNumber ||
                          "-"}
                      </td>

                      <td>
                        {mark.subject}
                      </td>

                      <td>
                        {mark.exam ||
                          "Internal 1"}
                      </td>

                      <td>
                        <strong>
                          {mark.marks}
                        </strong>

                        <span>
                          {" "}
                          / {MAX_MARKS}
                        </span>
                      </td>

                      <td>
                        {percentage}%
                      </td>

                      <td>

                        <span className="grade-badge">
                          {grade}
                        </span>

                      </td>

                      <td>

                        <span
                          className={
                            result ===
                            "Pass"
                              ? "status-pass"
                              : "status-fail"
                          }
                        >
                          {result}
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

          {loadingMarks && (
            <div className="empty-state">
              Loading marks...
            </div>
          )}

          {!loadingMarks &&
            filteredMarks.length ===
              0 && (
              <div className="empty-state">
                No marks records found.
              </div>
            )}

        </div>

      </div>
    </>
  );

  // ==================================================
  // ADD MARKS PAGE
  // ==================================================

  const renderAddMarks = () => {
    const enteredMarks =
      marksForm.marks !== ""
        ? Number(
            marksForm.marks
          )
        : null;

    const previewPercentage =
      enteredMarks !== null &&
      !Number.isNaN(
        enteredMarks
      )
        ? calculatePercentage(
            enteredMarks
          ).toFixed(1)
        : "-";

    const previewGrade =
      enteredMarks !== null &&
      !Number.isNaN(
        enteredMarks
      )
        ? calculateGrade(
            enteredMarks
          )
        : "-";

    const previewResult =
      enteredMarks !== null &&
      !Number.isNaN(
        enteredMarks
      )
        ? calculateResult(
            enteredMarks
          )
        : "-";

    return (
      <>
        <div className="page-header">

          <div>
            <h1>
              Add Marks
            </h1>

            <p>
              Internal Marks Management
              System
            </p>
          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              👤
            </div>

            <div>
              <strong>
                Admin
              </strong>

              <small>
                Administrator
              </small>
            </div>

          </div>

        </div>

        <div className="content-card form-card">

          <div className="content-card-header">

            <div>
              <h2>
                Enter Student Marks
              </h2>

              <p>
                Internal examination
                maximum marks:
                <strong>
                  {" "}
                  {MAX_MARKS}
                </strong>
              </p>
            </div>

          </div>

          <form
            onSubmit={
              handleAddMarks
            }
          >

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Student
                </label>

                <select
                  value={
                    marksForm.student
                  }
                  onChange={(event) =>
                    setMarksForm({
                      ...marksForm,
                      student:
                        event.target
                          .value,
                    })
                  }
                  required
                >

                  <option value="">
                    Select Student
                  </option>

                  {students.map(
                    (student) => (
                      <option
                        key={
                          student._id
                        }
                        value={
                          student._id
                        }
                      >
                        {
                          student.studentName
                        }{" "}
                        -{" "}
                        {
                          student.rollNumber
                        }
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Enter subject"
                  value={
                    marksForm.subject
                  }
                  onChange={(event) =>
                    setMarksForm({
                      ...marksForm,
                      subject:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Obtained Marks
                </label>

                <input
                  type="number"
                  min="0"
                  max={MAX_MARKS}
                  step="0.5"
                  placeholder={`Enter marks (0-${MAX_MARKS})`}
                  value={
                    marksForm.marks
                  }
                  onChange={(event) =>
                    setMarksForm({
                      ...marksForm,
                      marks:
                        event.target
                          .value,
                    })
                  }
                  required
                />

                <small>
                  Maximum:{" "}
                  {MAX_MARKS} marks
                </small>

              </div>

            </div>

            {/* MARKS PREVIEW */}

            <div className="marks-preview">

              <div>
                <span>
                  Marks
                </span>

                <strong>
                  {enteredMarks !==
                  null
                    ? `${enteredMarks}/${MAX_MARKS}`
                    : `-/${MAX_MARKS}`}
                </strong>
              </div>

              <div>
                <span>
                  Percentage
                </span>

                <strong>
                  {previewPercentage}%
                </strong>
              </div>

              <div>
                <span>
                  Grade
                </span>

                <strong>
                  {previewGrade}
                </strong>
              </div>

              <div>
                <span>
                  Result
                </span>

                <strong
                  className={
                    previewResult ===
                    "Pass"
                      ? "preview-pass"
                      : previewResult ===
                        "Fail"
                      ? "preview-fail"
                      : ""
                  }
                >
                  {previewResult}
                </strong>
              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setMarksForm({
                    student: "",
                    subject: "",
                    marks: "",
                  })
                }
              >
                Clear
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Save Marks
              </button>

            </div>

          </form>

        </div>
      </>
    );
  };

  // ==================================================
  // ANALYTICS PAGE
  // ==================================================

  const renderAnalytics = () => (
    <>
      <div className="page-header">

        <div>
          <h1>
            Analytics
          </h1>

          <p>
            Student performance
            analysis
          </p>
        </div>

      </div>

      <div className="analytics-grid">

        <div className="analytics-card">
          <h3>
            Total Students
          </h3>

          <strong>
            {totalStudents}
          </strong>
        </div>

        <div className="analytics-card">
          <h3>
            Total Records
          </h3>

          <strong>
            {totalMarks}
          </strong>
        </div>

        <div className="analytics-card">
          <h3>
            Passed
          </h3>

          <strong>
            {passedMarks}
          </strong>
        </div>

        <div className="analytics-card">
          <h3>
            Failed
          </h3>

          <strong>
            {failedMarks}
          </strong>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-panel">

          <h2>
            Grade Distribution
          </h2>

          <p>
            Current grade performance
          </p>

          {Object.entries(
            gradeCounts
          ).map(
            ([grade, count]) => {

              const percentage =
                totalMarks > 0
                  ? (count /
                      totalMarks) *
                    100
                  : 0;

              return (
                <div
                  className="analytics-bar-row"
                  key={grade}
                >

                  <span>
                    {grade}
                  </span>

                  <div className="analytics-bar">

                    <div
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                  <strong>
                    {count}
                  </strong>

                </div>
              );
            }
          )}

        </div>

        <div className="dashboard-panel">

          <h2>
            Performance Summary
          </h2>

          <p>
            Overall academic
            performance
          </p>

          <div className="result-summary-grid">

            <div className="summary-box">

              <span>
                Average Marks
              </span>

              <strong>
                {averageMarks}/
                {MAX_MARKS}
              </strong>

              <small>
                {averagePercentage}%
              </small>

            </div>

            <div className="summary-box">

              <span>
                Pass Rate
              </span>

              <strong>
                {passPercentage}%
              </strong>

              <small>
                current rate
              </small>

            </div>

          </div>

        </div>

      </div>
    </>
  );

  // ==================================================
  // REPORTS PAGE
  // ==================================================

  const renderReports = () => (
    <>
      <div className="page-header">

        <div>
          <h1>
            Reports
          </h1>

          <p>
            Academic performance
            reports
          </p>
        </div>

      </div>

      <div className="result-summary-grid">

        <div className="summary-box">
          <span>
            Total Students
          </span>

          <strong>
            {totalStudents}
          </strong>
        </div>

        <div className="summary-box">
          <span>
            Total Records
          </span>

          <strong>
            {totalMarks}
          </strong>
        </div>

        <div className="summary-box">
          <span>
            Passed
          </span>

          <strong>
            {passedMarks}
          </strong>
        </div>

        <div className="summary-box">
          <span>
            Failed
          </span>

          <strong>
            {failedMarks}
          </strong>
        </div>

      </div>

      <div className="content-card">

        <div className="content-card-header">

          <div>
            <h2>
              Student Performance
            </h2>

            <p>
              Marks summary for
              registered students
            </p>
          </div>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>

                <th>
                  STUDENT
                </th>

                <th>
                  ROLL NUMBER
                </th>

                <th>
                  RECORDS
                </th>

                <th>
                  AVERAGE
                </th>

                <th>
                  STATUS
                </th>

              </tr>
            </thead>

            <tbody>

              {students.map(
                (student) => {

                  const studentMarks =
                    marks.filter(
                      (mark) => {

                        const id =
                          typeof mark.student ===
                          "object"
                            ? mark.student
                                ?._id
                            : mark.student;

                        return (
                          id ===
                          student._id
                        );
                      }
                    );

                  const average =
                    studentMarks.length >
                    0
                      ? (
                          studentMarks.reduce(
                            (
                              sum,
                              mark
                            ) =>
                              sum +
                              Number(
                                mark.marks ||
                                  0
                              ),
                            0
                          ) /
                          studentMarks.length
                        ).toFixed(1)
                      : "0.0";

                  const hasFailed =
                    studentMarks.some(
                      (mark) =>
                        calculateResult(
                          mark.marks
                        ) ===
                        "Fail"
                    );

                  return (
                    <tr
                      key={
                        student._id
                      }
                    >

                      <td>
                        {
                          student.studentName
                        }
                      </td>

                      <td>
                        {
                          student.rollNumber
                        }
                      </td>

                      <td>
                        {
                          studentMarks.length
                        }
                      </td>

                      <td>
                        {average}/
                        {MAX_MARKS}
                      </td>

                      <td>

                        <span
                          className={
                            studentMarks.length ===
                            0
                              ? ""
                              : hasFailed
                              ? "status-fail"
                              : "status-pass"
                          }
                        >
                          {studentMarks.length ===
                          0
                            ? "No Marks"
                            : hasFailed
                            ? "Needs Improvement"
                            : "Pass"}
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );

  // ==================================================
  // SETTINGS PAGE
  // ==================================================

  const renderSettings = () => (
    <>
      <div className="page-header">

        <div>
          <h1>
            Settings
          </h1>

          <p>
            Manage application
            settings
          </p>
        </div>

      </div>

      <div className="settings-grid">

        <div className="settings-card">

          <div className="settings-icon">
            👤
          </div>

          <h3>
            Administrator
          </h3>

          <p>
            Admin account
          </p>

          <small>
            Administrator access
            enabled
          </small>

        </div>

        <div className="settings-card">

          <div className="settings-icon">
            🎓
          </div>

          <h3>
            Student Management
          </h3>

          <p>
            Student records
          </p>

          <small>
            Add, edit and delete
            student information
          </small>

        </div>

        <div className="settings-card">

          <div className="settings-icon">
            📝
          </div>

          <h3>
            Marks Management
          </h3>

          <p>
            Academic records
          </p>

          <small>
            Manage student marks
            and performance
          </small>

        </div>

        <div className="settings-card">

          <div className="settings-icon">
            📊
          </div>

          <h3>
            Analytics
          </h3>

          <p>
            Performance tracking
          </p>

          <small>
            View academic
            performance statistics
          </small>

        </div>

      </div>
    </>
  );

  // ==================================================
  // SIDEBAR
  // ==================================================

  const menuItems = [
    ["Dashboard", "📊"],
    ["Students", "🎓"],
    ["Marks", "📝"],
    ["Add Marks", "➕"],
    ["Analytics", "📈"],
    ["Reports", "📄"],
    ["Settings", "⚙️"],
  ];

  // ==================================================
  // MAIN RETURN
  // ==================================================

  return (
    <div className="app-container">

      <aside className="sidebar">

        <div className="logo">
          <span>
            📚
          </span>

          <strong>
            Marks Management
          </strong>
        </div>

        <nav>

          {menuItems.map(
            ([page, icon]) => (
              <button
                key={page}
                className={
                  activePage === page
                    ? "menu-item active"
                    : "menu-item"
                }
                onClick={() =>
                  goToPage(page)
                }
              >

                <span>
                  {icon}
                </span>

                {page}

              </button>
            )
          )}

        </nav>

      </aside>

      <main className="main-content">

        {activePage ===
          "Dashboard" &&
          renderDashboard()}

        {activePage ===
          "Students" &&
          renderStudents()}

        {activePage ===
          "Marks" &&
          renderMarks()}

        {activePage ===
          "Add Marks" &&
          renderAddMarks()}

        {activePage ===
          "Analytics" &&
          renderAnalytics()}

        {activePage ===
          "Reports" &&
          renderReports()}

        {activePage ===
          "Settings" &&
          renderSettings()}

      </main>

      {/* ==================================================
          ADD STUDENT MODAL
          ================================================== */}

      {showStudentModal && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>
                  Add Student
                </h2>

                <p>
                  Register a new
                  student
                </p>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowStudentModal(
                    false
                  )
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleAddStudent
              }
            >

              <div className="form-group">

                <label>
                  Student Name
                </label>

                <input
                  type="text"
                  value={
                    studentForm.studentName
                  }
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      studentName:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Roll Number
                </label>

                <input
                  type="text"
                  value={
                    studentForm.rollNumber
                  }
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      rollNumber:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Department /
                  Branch
                </label>

                <input
                  type="text"
                  value={
                    studentForm.department
                  }
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      department:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Semester
                </label>

                <input
                  type="text"
                  value={
                    studentForm.semester
                  }
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      semester:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowStudentModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Add Student
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ==================================================
          EDIT STUDENT MODAL
          ================================================== */}

      {showEditModal && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>
                  Edit Student
                </h2>

                <p>
                  Update student
                  information
                </p>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowEditModal(
                    false
                  )
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleEditStudent
              }
            >

              <div className="form-group">

                <label>
                  Student Name
                </label>

                <input
                  type="text"
                  value={
                    studentForm.studentName
                  }
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      studentName:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Roll Number
                </label>

                <input
                  type="text"
                  value={
                    studentForm.rollNumber
                  }
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      rollNumber:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Department /
                  Branch
                </label>

                <input
                  type="text"
                  value={
                    studentForm.department
                  }
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      department:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Semester
                </label>

                <input
                  type="text"
                  value={
                    studentForm.semester
                  }
                  onChange={(event) =>
                    setStudentForm({
                      ...studentForm,
                      semester:
                        event.target
                          .value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowEditModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Update Student
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;