import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      if (!data?.token) {
        setError(data?.message || "Login response did not contain a token.");
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.response
            ? "Login failed. Please check your email and password."
            : "Cannot connect to the server. Please check the backend.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-background-glow login-glow-one" />
      <div className="login-background-glow login-glow-two" />

      <Link to="/" className="login-brand">
        <span className="login-brand-icon">🎓</span>
        <span>
          <strong>MarkSphere</strong>
          <small>INTERNAL MARKS SYSTEM</small>
        </span>
      </Link>

      <section className="login-layout">
        <div className="login-intro">
          <span className="login-eyebrow">
            <span className="login-status-dot" />
            YOUR ACADEMIC PORTAL
          </span>

          <h1>
            Welcome
            <br />
            <span>back.</span>
          </h1>

          <p>
            Sign in to access your academic dashboard, view marks, and keep
            track of your learning progress—all in one place.
          </p>

          <div className="login-benefits">
            <div>
              <span>✓</span>
              Secure account access
            </div>
            <div>
              <span>✓</span>
              Academic records in one place
            </div>
            <div>
              <span>✓</span>
              Simple performance tracking
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-icon">🔐</div>

          <h2>Sign in to MarkSphere</h2>
          <p className="login-card-subtitle">
            Enter your account details to continue.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>

              <div className="login-password-wrap">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-show-password"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <div className="login-register">
            Don’t have an account?{" "}
            <Link to="/register">Create account</Link>
          </div>

          <div className="login-security-note">
            <span>🛡️</span>
            Your academic journey, securely managed.
          </div>
        </div>
      </section>

      <footer className="login-footer">
        © {new Date().getFullYear()} MarkSphere · Internal Marks Management
        System
      </footer>
    </main>
  );
}
