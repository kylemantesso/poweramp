import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export function Screen() {
  return (
    <Box
        display="flex"
        flex={1}
      sx={{
        height: "100%",
        backgroundColor: "grey.100",
      }}
    >
      <Outlet />
    </Box>
  );
}
