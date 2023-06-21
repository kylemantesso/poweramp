import {AppBar, Box, Button, Container, Stack, Toolbar, Typography} from "@mui/material";

import { Logo } from "./Logo/Logo";
import { useAppContext } from "../AppContext";

export const AuthNavbar = () => {
  const { logout, publicAddress } = useAppContext();

  return (
    <AppBar
      elevation={2}
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
          <Logo width={160} />
          <Box sx={{ flexGrow: 1 }} />
          <Stack spacing={-1}>
            <Typography variant="overline" m={0}>Account</Typography>
            <Typography>{publicAddress}</Typography>

          </Stack>
          <Button onClick={logout} size="medium" sx={{ ml: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
