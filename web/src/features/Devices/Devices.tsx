import {
  Box,
  CircularProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material";

import { Logo } from "../../components/Logo/Logo";
import {useEffect, useState} from "react";


const TEST_DEVICE = '6081F910A956EC6D';
export function Devices() {

  const [devices, setDevices] = useState<any>();

  useEffect(() => {
    fetch('https://helix-grid-default-rtdb.asia-southeast1.firebasedatabase.app/device.json')
      .then(res => res.json())
      .then(devices => setDevices(devices))
  }, []);

  if (!devices) {
    return (
      <Stack alignItems="center">
        <Box p={8}>
          <Logo/>
          <Typography align="center" variant="h5">
            Loading devices...
          </Typography>
        </Box>
        <CircularProgress size={50}/>
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Typography variant="h5">Devices</Typography>
        <Link href={`https://testnet.hederaexplorer.io/search-details/topic/${devices[TEST_DEVICE].topic}`}>View on Hedera Explorer</Link>

      </Stack>
    </Stack>
  );
}