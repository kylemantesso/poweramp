import { Graph } from "./components/Graph";
import { Consumption } from "./components/Consumption";
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useUsage } from "../../UsageContext";
import { DataTable } from "./components/DataTable";
import { CarbonEmissions } from "./components/CarbonEmissions";
import { Logo } from "../../components/Logo/Logo";

// const magic = new Magic("pk_live_C8037E2E6520BBDF", {
//   extensions: [
//     new HederaExtension({
//       network: "testnet",
//     }),
//   ],
// });

export function Usage() {
  const { usage, aggregatedUsage } = useUsage();

  const powerUsage = usage[usage.length - 1]?.powerUsage;

  // const handleHederaSignTransaction = async () => {
  //   const { publicKeyDer } = await magic.hedera.getPublicKey();
  //   const magicSign = (message: Uint8Array) => magic.hedera.sign(message);
  //   const magicWallet = new MagicWallet(
  //     publicAddress,
  //     new MagicProvider("testnet"),
  //     publicKeyDer,
  //     magicSign
  //   );
  //
  //   let transaction = await new TransferTransaction()
  //     .setNodeAccountIds([new AccountId(3)])
  //     .addHbarTransfer(publicAddress, -1 * sendAmount)
  //     .addHbarTransfer(destinationAddress, sendAmount)
  //     .freezeWithSigner(magicWallet as unknown as Signer);
  //
  //   transaction = await transaction.signWithSigner(
  //     magicWallet as unknown as Signer
  //   );
  //   const result = await transaction.executeWithSigner(
  //     magicWallet as unknown as Signer
  //   );
  //   const receipt = await result.getReceiptWithSigner(
  //     magicWallet as unknown as Signer
  //   );
  //
  //   setSendingTransaction(true);
  //
  //   console.log(receipt.status.toString());
  // };

  return (
    <>
      {usage.length > 0 ? (
        <Stack spacing={4}>
          <Alert severity="info">
            For the purposes of demoing for the hackathon, all accounts are
            linked to the prototype device
          </Alert>
          <Stack
            direction={{

              md: "row",
            }}
            spacing={8}
          >
            <Stack>
              <Typography variant="h5">Current consumption</Typography>
              <Consumption powerConsumption={powerUsage} />
            </Stack>
            <Stack>
              <Typography variant="h5">Carbon emissions</Typography>
              <CarbonEmissions powerConsumption={powerUsage} />
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h5">Hourly usage</Typography>
            <Graph messages={aggregatedUsage} />
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h5">Latest usage data</Typography>
            <DataTable usage={usage} />
          </Stack>
        </Stack>
      ) : (
        <Stack alignItems="center">
          <Box p={8}>
            <Logo />

            <Typography align="center" variant="h5">
              Loading usage data...
            </Typography>
          </Box>
          <CircularProgress size={50} />
        </Stack>
      )}
    </>
  );
}
