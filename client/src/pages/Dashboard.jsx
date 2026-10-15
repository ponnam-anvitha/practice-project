 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const menuItems = [
  { label: "Dashboard", icon: "📊" },
  { label: "Students", icon: "👨‍🎓" },
  { label: "Marks", icon: "📝" },
  { label: "Add Marks", icon: "➕" },
  { label: "Analytics", icon: "📈" },
  { label: "Reports", icon: "📑" },
  { label: "Settings", icon: "⚙️" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Student");
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);

  useEffect(() => {
    const name =
      localStorage.getItem("name") ||
      localStorage.getItem("username") ||
      "Student";

    setUserName(name);

    // Read saved counts when available.
    setTotalStudents(
      Number(localStorage.getItem("totalStudents")) || 0
    );

    setTotalMarks(
      Number(localStorage.getItem("totalMarks")) || 0
    );
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function openPage(label) {
    const routes = {
      Dashboard: "/dashboard",
      Students: "/students",
      Marks: "/marks",
      "Add Marks": "/add-marks",
      Analytics: "/analytics",
      Reports: "/reports",
      Settings: "/settings",
    };

    if (label === "Dashboard") {
      navigate("/dashboard");
    } else {
      navigate(routes[label]);
    }
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">🎓</span>
          <span>Marks Management</span>
        </div>

        <nav className="sidebar-navigation">
          {menuItems.map((item) => (
            <button
              type="button"
              key={item.label}
              className={
                item.label === "Dashboard"
                  ? "sidebar-menu-item active"
                  : "sidebar-menu-item"
              }
              onClick={() => openPage(item.label)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              STUDENT ACADEMIC PORTAL
            </p>

            <h1>Dashboard</h1>

            <p className="dashboard-subtitle">
              Internal Marks Management System
            </p>
          </div>

          <div className="dashboard-profile">
            <span className="profile-avatar">👤</span>
            <div>
              <strong>{userName}</strong>
              <span>Student</span>
            </div>
          </div>
        </header>

        <section className="welcome-banner">
          <div className="welcome-text">
            <span className="welcome-label">
              YOUR ACADEMIC WORKSPACE
            </span>

            <h2>Welcome, {userName}! 👋</h2>

            <p>
              Manage student information, internal marks,
              grades and academic performance in one place.
            </p>
          </div>

          <div className="welcome-illustration">
            <span>🎓</span>
            <span>📚</span>
            <span>📈</span>
          </div>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card blue-card">
            <div className="stat-icon">👨‍🎓</div>
            <p>Total Students</p>
            <h3>{totalStudents}</h3>
            <span>Registered student records</span>
          </article>

          <article className="dashboard-stat-card purple-card">
            <div className="stat-icon">📝</div>
            <p>Marks Entries</p>
            <h3>{totalMarks}</h3>
            <span>Internal assessments</span>
          </article>

          <article className="dashboard-stat-card green-card">
            <div className="stat-icon">🏆</div>
            <p>Academic Results</p>
            <h3>Grades</h3>
            <span>Track student performance</span>
          </article>

          <article className="dashboard-stat-card orange-card">
            <div className="stat-icon">📈</div>
            <p>Analytics</p>
            <h3>Insights</h3>
            <span>Review academic progress</span>
          </article>
        </section>

        <section className="dashboard-content-card">
          <div className="section-title-row">
            <div>
              <h2>Quick Access</h2>
              <p>Select a section to continue.</p>
            </div>
            <span>✨</span>
          </div>

          <div className="quick-access-grid">
            {menuItems
              .filter((item) => item.label !== "Dashboard")
              .map((item) => (
                <button
                  type="button"
                  className="quick-access-item"
                  key={item.label}
                  onClick={() => openPage(item.label)}
                >
                  <span className="quick-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  <span className="quick-arrow">→</span>
                </button>
              ))}
          </div>
        </section>

        <section className="dashboard-note">
          <span>💡</span>
          <div>
            <strong>Academic reminder</strong>
            <p>
              Keep student details and internal assessment
              records updated for accurate results.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
