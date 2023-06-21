import { useAppContext } from "../../AppContext";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { Logo } from "../../components/Logo/Logo";
import { useBalance } from "./useBalance";

export function Account() {
  const { userMetadata, magicWallet } = useAppContext();

  const balance = useBalance(magicWallet!);


  if (!userMetadata) {
    return (
      <Stack alignItems="center">
        <Box p={8}>
          <Logo />
          <Typography align="center" variant="h5">
            Loading account...
          </Typography>
        </Box>
        <CircularProgress size={50} />
      </Stack>
    );
  }

  return (
    <Stack>
      {JSON.stringify(userMetadata)}
      <Stack spacing={2}>
        <Typography variant="h5">Balance</Typography>
        <Typography variant="h5">{balance.hbars.toString()}</Typography>
      </Stack>
    </Stack>
  );
}
