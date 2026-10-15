import "./Settings.css";

export default function Settings() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="simple-page">
      <h1>⚙️ Settings</h1>
      <p>Manage your account settings.</p>
      <div className="simple-card">
        <h3>Account Information</h3>
        <p>Name: {user.name || "Student"}</p>
        <p>Email: {user.email || "Not available"}</p>
        <p>Role: {user.role || "Student"}</p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}