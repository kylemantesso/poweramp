import { useAppContext } from "../../AppContext";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Logo } from "../../components/Logo/Logo";
import { useBalance } from "./useBalance";

export function Account() {
  const { userMetadata, magicWallet, publicAddress } = useAppContext();

  const balance = useBalance(magicWallet!);

  if (!userMetadata || !balance) {
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
    <Stack spacing={4}>
      <Stack>
        <Stack direction="row" alignItems="start" spacing={2}>
          <img src="/amp-logo.png" style={{ width: 40, objectFit: "cover" }} />
          <Stack>
            <Typography variant="h5">PowerAmp Balance</Typography>
            <a
              target="_blank"
              href={`https://testnet.hederaexplorer.io/search-details/token/${balance.tokens[0].tokenId}`}
            >
              <Typography variant="subtitle2">
                {balance.tokens[0].tokenId}
              </Typography>
            </a>
            <Typography variant="h3">
              {balance.tokens[0].balance} AMPs
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2}>
        <img
          src="/hedera-hbar-logo.png"
          style={{ width: 40, objectFit: "cover" }}
        />
        <Stack>
          <Typography variant="h5">HBAR Balance</Typography>
          <Typography variant="h6">{balance.hbars}</Typography>
        </Stack>
      </Stack>
      <Box>
        <Button variant="contained" color="primary" href={`https://testnet.hederaexplorer.io/search-details/account/${publicAddress}`}>
          View My Account on Hedera Explorer
        </Button>
      </Box>
    </Stack>
  );
}
