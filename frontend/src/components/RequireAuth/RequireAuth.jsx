import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../PageLayout/PageLayout";

// sends signed-out visitors to /login, then back here once they've signed in.
// Someone who just pressed "Log out" goes to the home page instead.
function RequireAuth({ children }) {
  const { user, loading, signedOut } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <PageLayout>
        <CircularProgress color="inherit"></CircularProgress>
      </PageLayout>
    );
  }
  if (!user && signedOut) return <Navigate to="/" replace></Navigate>;
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace></Navigate>;
  }
  return children;
}
export default RequireAuth;
