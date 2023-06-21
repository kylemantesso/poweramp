import { useAppContext } from "../AppContext";
import { Navigate, useLocation } from "react-router-dom";
import { Loader } from "./Loader/Loader";

export function RequireAuth({ children }: { children: JSX.Element }) {
  let { isLoggedIn } = useAppContext();
  let location = useLocation();

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function RedirectAuth({ children }: { children: JSX.Element }) {
  let { isLoggedIn, isLoading } = useAppContext();
  let location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
}
