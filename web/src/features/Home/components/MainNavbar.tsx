import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

import { Logo } from "../../../components/Logo/Logo";

export const MainNavbar = () => {
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottomColor: "divider",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        color: "text.secondary",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          <Button component={Link} to="/dashboard" size="medium" sx={{ ml: 2 }}>
            Dashboard
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
