import {
  Routes,
  useNavigate,
  useLocation,
  Route,
  Navigate,
} from "react-router-dom";
import { Tabs, Tab, Container, Box } from "@mui/material";
import { UsageProvider } from "../../UsageContext";
import { useAppContext } from "../../AppContext";
import { RequireAuth } from "../../components/Auth";
import { AuthNavbar } from "../../components/MainNavbar";
import { Usage } from "../Usage/Usage";
import React from "react";
import { Events } from "../Events/Events";
import {Account} from "../Account/Account";

export function Dashboard() {
  const { publicAddress } = useAppContext();

  return (
    <RequireAuth>
      <UsageProvider accountId={publicAddress} limitHours={4}>
        <main>
          <AuthNavbar />
          <Container
            maxWidth="md"
            sx={{
              backgroundColor: "white",
              margin: "92px auto",
              borderRadius: 2,
              py: "24px",
              maxWidth: "700px",
            }}
          >
            <NavigationTabs />
            <Box pt={4}>
              <Routes>
                <Route index element={<Navigate to="usage" />} />
                <Route path="usage" element={<Usage />} />
                <Route path="events" element={<Events />} />
                <Route path="account" element={<Account />} />
              </Routes>
            </Box>
          </Container>
        </main>
      </UsageProvider>
    </RequireAuth>
  );
}

interface LinkTabProps {
  label: string;
  to: string;
  value: string;
}

const NavigationTabs: React.FC = () => {
  const location = useLocation();
  const currentPath =
    location.pathname !== "/dashboard" ? location.pathname : "/dashboard/usage";

  return (
    <Tabs value={currentPath}>
      <LinkTab label="Usage" value="/dashboard/usage" to="/dashboard/usage" />
      <LinkTab
        label="Events"
        value="/dashboard/events"
        to="/dashboard/events"
      />
      <LinkTab
        label="Account"
        value="/dashboard/account"
        to="/dashboard/account"
      />
    </Tabs>
  );
};

const LinkTab: React.FC<LinkTabProps> = ({ label, to, value }) => {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(to);
  };

  return (
    <Tab
      component="a"
      onClick={handleClick}
      label={label}
      value={value}
      href={to}
      sx={{
        fontSize: "1.2rem", // Larger font size
        padding: "1rem", // More padding
      }}
    />
  );
};
