import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthPage() {
  const { signUp, logIn, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await logIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDemo = async () => {
    setError("");
    try {
      await logIn(process.env.REACT_APP_DEMO_EMAIL, process.env.REACT_APP_DEMO_PASSWORD);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>TripChecker</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={styles.primaryButton}>
          {mode === "login" ? "Log in" : "Sign up"}
        </button>

        <button type="button" style={styles.googleButton} onClick={handleGoogle}>
          Sign in with Google
        </button>

        <button type="button" style={styles.googleButton} onClick={handleDemo}>
          Try demo
        </button>

        <button
          type="button"
          style={styles.switchButton}
          onClick={() => {
            setError("");
            setMode(mode === "login" ? "signup" : "login");
          }}
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1a1a1a"
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: 300,
    padding: 24,
    background: "#2B2A2A",
    borderRadius: 8
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 10
  },
  input: {
    padding: "10px",
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #555",
    background: "#1a1a1a",
    color: "#fff"
  },
  error: {
    color: "#C73428",
    fontSize: 13
  },
  primaryButton: {
    padding: "10px",
    fontSize: 14,
    borderRadius: 4,
    border: "none",
    background: "#2C46B0",
    color: "#fff",
    cursor: "pointer"
  },
  googleButton: {
    padding: "10px",
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #555",
    background: "transparent",
    color: "#fff",
    cursor: "pointer"
  },
  switchButton: {
    padding: "6px",
    fontSize: 12,
    border: "none",
    background: "none",
    color: "#9db0ff",
    cursor: "pointer"
  }
};
