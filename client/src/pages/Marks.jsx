
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Marks.css";

export default function Marks() {
  const navigate = useNavigate();
  const [marksList, setMarksList] = useState([]);
  const [search, setSearch] = useState("");

  const loadMarks = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("marks") || "[]"
      );
      setMarksList(Array.isArray(saved) ? saved : []);
    } catch {
      setMarksList([]);
    }
  };

  useEffect(() => {
    loadMarks();
  }, []);

  const deleteMark = (id) => {
    const updated = marksList.filter((item) => item.id !== id);

    localStorage.setItem("marks", JSON.stringify(updated));
    setMarksList(updated);
  };

  const filteredMarks = marksList.filter((item) =>
    [
      item.studentName,
      item.rollNumber,
      item.subject,
      item.grade,
      item.result,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="marks-page">
      <header className="marks-header">
        <p>INTERNAL MARKS MANAGEMENT SYSTEM</p>
        <h1>Student Marks</h1>
        <span>View and manage student marks.</span>
      </header>

      <div className="marks-toolbar">
        <input
          type="search"
          placeholder="Search name, roll number or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search student marks"
        />

        <button
          className="marks-add-button"
          onClick={() => navigate("/add-marks")}
        >
          + Add Marks
        </button>
      </div>

      <div className="marks-summary">
        <div className="marks-summary-card">
          <span>Total Records</span>
          <h2>{marksList.length}</h2>
        </div>

        <div className="marks-summary-card">
          <span>Passed</span>
          <h2>
            {marksList.filter((item) => item.result === "Pass").length}
          </h2>
        </div>

        <div className="marks-summary-card">
          <span>Failed</span>
          <h2>
            {marksList.filter((item) => item.result === "Fail").length}
          </h2>
        </div>
      </div>

      <div className="marks-table-card">
        <div className="marks-table-heading">
          <h2>Marks List</h2>
          <span>{filteredMarks.length} records</span>
        </div>

        <div className="marks-table-scroll">
          <table className="marks-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Result</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredMarks.map((item) => (
                <tr key={item.id}>
                  <td>{item.studentName}</td>
                  <td>{item.rollNumber}</td>
                  <td>{item.subject}</td>
                  <td>{item.marks}/100</td>
                  <td>
                    <span className="marks-grade">
                      {item.grade || "-"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        item.result === "Pass"
                          ? "marks-result pass"
                          : "marks-result fail"
                      }
                    >
                      {item.result || "-"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="marks-delete-button"
                      onClick={() => deleteMark(item.id)}
                      aria-label={`Delete marks for ${item.studentName}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMarks.length === 0 && (
                <tr>
                  <td colSpan="7" className="marks-empty">
                    {search
                      ? "No matching records found."
                      : "No marks added yet. Click Add Marks to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <button
        className="marks-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
