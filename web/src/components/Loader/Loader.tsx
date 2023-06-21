import { Box, CircularProgress, Typography } from "@mui/material";
import { Logo } from "../Logo/Logo";

export function Loader() {
  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box p={8}>
        <Logo />

        <Typography align="center" variant="h5">
          Connect, conserve, earn!
        </Typography>
      </Box>
      <CircularProgress size={50} />
    </Box>
  );
}
