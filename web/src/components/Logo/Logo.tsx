import { Stack } from "@mui/material";

export const Logo = ({ width }: { width?: number }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
      <img src="/poweramp-logo-small.png" width={width || 200} />
    </Stack>
  );
};
