import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";
import { useAuth } from "../context/AuthContext";
import { pillInput, primaryButton } from "../theme/styles";

// only follow ?next= links inside this site, never to another domain
function safeNext(value) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/shop";
}

function LoginPage() {
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isSignIn = mode === "signin";

  if (!loading && user) return <Navigate to={next} replace></Navigate>;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!isSignIn && password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setBusy(true);
    try {
      if (isSignIn) await login(email, password);
      else await register(email, password);
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function switchMode() {
    setMode(isSignIn ? "register" : "signin");
    setError("");
    setConfirm("");
  }

  return (
    <PageLayout>
      <Box sx={{ maxWidth: 420, mx: "auto", py: { md: 4 } }}>
        <Typography component="h1" sx={{ fontFamily: "Brzo-Basic, sans-serif", fontWeight: 800, fontSize: { xs: 34, md: 44 } }}>
          {isSignIn ? "Welcome back" : "Join the squad"}
        </Typography>
        <Typography sx={{ mb: 4 }}>
          {isSignIn ? "Sign in to check out and see your orders." : "Create an account to start ordering."}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={pillInput}
          ></TextField>
          <TextField
            label="Password"
            type="password"
            autoComplete={isSignIn ? "current-password" : "new-password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText={isSignIn ? "" : "At least 8 characters"}
            slotProps={{ htmlInput: { minLength: isSignIn ? undefined : 8 } }}
            sx={pillInput}
          ></TextField>
          {!isSignIn && (
            <TextField
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              sx={pillInput}
            ></TextField>
          )}
          <Button type="submit" disabled={busy} sx={{ ...primaryButton, py: 1.5, mt: 1 }}>
            {busy ? "Please wait…" : isSignIn ? "Sign in" : "Create account"}
          </Button>
        </Box>

        <Typography sx={{ mt: 3, textAlign: "center" }}>
          {isSignIn ? "New here? " : "Already have an account? "}
          <Link component="button" type="button" onClick={switchMode} sx={{ color: "black", fontWeight: 700, verticalAlign: "baseline" }}>
            {isSignIn ? "Create an account" : "Sign in"}
          </Link>
        </Typography>
      </Box>
    </PageLayout>
  );
}
export default LoginPage;
