import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

type AuthMode = "login" | "register";

interface AuthForm {
  email: string;
  password: string;
  confirmPassword?: string;
}

const API_BASE = "http://localhost:5000/api";

export default function LandingPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<AuthForm>({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
        setError("All fields are required.");
        return;
    }

    if (!validateEmail(form.email)) {
        setError("Please enter a valid email address.");
        return;
    }

    if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    if (mode === "register" && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      // Store token and redirect (replace with your router navigation)
      localStorage.setItem("token", data.token);
      const decoded = jwtDecode<{ role: string }>(data.token);
      navigate(decoded.role === 'admin' ? '/admin' : '/dashboard');
    } catch {
      setError("Unable to reach the server. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setForm({ email: "", password: "", confirmPassword: "" });
    setError(null);
  };

  return (
    <div style={styles.root}>
      {/* Background grid */}
      <div style={styles.gridOverlay} aria-hidden="true" />

      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logoMark}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="9" height="9" rx="2" fill="#6EE7B7" />
              <rect x="12" y="1" width="9" height="9" rx="2" fill="#6EE7B7" opacity="0.4" />
              <rect x="1" y="12" width="9" height="9" rx="2" fill="#6EE7B7" opacity="0.4" />
              <rect x="12" y="12" width="9" height="9" rx="2" fill="#6EE7B7" opacity="0.2" />
            </svg>
            <span style={styles.logoText}>Trackr</span>
          </div>
        </header>

        <div style={styles.content}>
          {/* Left — hero */}
          <section style={styles.hero} aria-labelledby="hero-heading">
            <p style={styles.eyebrow}>Job Application Tracker</p>
            <h1 id="hero-heading" style={styles.heroTitle}>
              Every application,<br />
              <span style={styles.heroAccent}>in one place.</span>
            </h1>
            <p style={styles.heroSub}>
              Track where you've applied, follow up on time, and land the role you want.
            </p>
            <div style={styles.stats}>
              {[
                { label: "Applied", value: "Track" },
                { label: "Interviews", value: "Follow" },
                { label: "Offers", value: "Win" },
              ].map((s) => (
                <div key={s.label} style={styles.statItem}>
                  <span style={styles.statValue}>{s.value}</span>
                  <span style={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Right — auth card */}
          <section style={styles.authCard} aria-label="Authentication">
            {/* Tab switcher */}
            <div style={styles.tabs} role="tablist">
              {(["login", "register"] as AuthMode[]).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={mode === t}
                  onClick={() => switchMode(t)}
                  style={{
                    ...styles.tab,
                    ...(mode === t ? styles.tabActive : {}),
                  }}
                >
                  {t === "login" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={styles.form} noValidate>
              {/* Email */}
              <div style={styles.fieldGroup}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  placeholder={mode === "register" ? "Min. 6 characters" : "••••••••"}
                  value={form.password}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              {/* Confirm password */}
              {mode === "register" && (
                <div style={styles.fieldGroup}>
                  <label htmlFor="confirmPassword" style={styles.label}>Confirm password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              )}

              {/* Error */}
              {error && (
                <p role="alert" style={styles.errorMsg}>
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  ...(loading ? styles.submitBtnDisabled : {}),
                }}
              >
                {loading
                  ? "Please wait…"
                  : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              </button>
            </form>

            <p style={styles.switchPrompt}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => switchMode(mode === "login" ? "register" : "login")}
                style={styles.switchLink}
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0f",
    color: "#e8e8ec",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(110,231,183,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,183,0.04) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  },
  main: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 2rem",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "2rem 0 1rem",
    display: "flex",
    alignItems: "center",
  },
  logoMark: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: 600,
    letterSpacing: "-0.3px",
    color: "#f0f0f4",
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "5rem",
    padding: "3rem 0 4rem",
    flexWrap: "wrap" as const,
  },
  hero: {
    flex: "1 1 340px",
  },
  eyebrow: {
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#6EE7B7",
    marginBottom: "1.25rem",
  },
  heroTitle: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    color: "#f0f0f4",
    margin: "0 0 1.25rem",
  },
  heroAccent: {
    color: "#6EE7B7",
  },
  heroSub: {
    fontSize: "16px",
    lineHeight: 1.7,
    color: "#8888a0",
    maxWidth: "360px",
    margin: "0 0 2.5rem",
  },
  stats: {
    display: "flex",
    gap: "2rem",
  },
  statItem: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  statValue: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#6EE7B7",
    letterSpacing: "-0.01em",
  },
  statLabel: {
    fontSize: "12px",
    color: "#5a5a72",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  authCard: {
    flex: "0 0 380px",
    backgroundColor: "#111118",
    border: "1px solid #1e1e2e",
    borderRadius: "16px",
    padding: "2rem",
  },
  tabs: {
    display: "flex",
    gap: "4px",
    backgroundColor: "#0a0a0f",
    borderRadius: "10px",
    padding: "4px",
    marginBottom: "2rem",
  },
  tab: {
    flex: 1,
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 500,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "#5a5a72",
    transition: "all 0.15s ease",
  },
  tabActive: {
    backgroundColor: "#1a1a28",
    color: "#e8e8ec",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.25rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#8888a0",
    letterSpacing: "0.01em",
  },
  input: {
    backgroundColor: "#0a0a0f",
    border: "1px solid #1e1e2e",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "14px",
    color: "#e8e8ec",
    outline: "none",
    transition: "border-color 0.15s ease",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  errorMsg: {
    fontSize: "13px",
    color: "#f87171",
    backgroundColor: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.2)",
    borderRadius: "8px",
    padding: "10px 14px",
    margin: 0,
  },
  submitBtn: {
    backgroundColor: "#6EE7B7",
    color: "#0a0a0f",
    border: "none",
    borderRadius: "8px",
    padding: "11px 16px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.25rem",
    transition: "opacity 0.15s ease",
    letterSpacing: "0.01em",
  },
  submitBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  switchPrompt: {
    fontSize: "13px",
    color: "#5a5a72",
    textAlign: "center" as const,
    margin: "1.25rem 0 0",
  },
  switchLink: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6EE7B7",
    fontSize: "13px",
    fontWeight: 500,
    padding: 0,
  },
};