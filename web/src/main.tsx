import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContextProvider } from "./AppContext";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "./theme";
import { Home } from "./features/Home/Home";
import { Login } from "./features/Auth/Login";

import { Dashboard } from "./features/Dashboard/Dashboard";
import { RedirectAuth } from "./components/Auth";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider
      theme={createTheme({
        mode: "light",
      })}
    >
      <CssBaseline />
      <AppContextProvider network="testnet">
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AppContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <RedirectAuth>
            <Login />
          </RedirectAuth>
        }
      />
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}
