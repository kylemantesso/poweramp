import PulseDot from "react-pulse-dot";
import "react-pulse-dot/dist/index.css";
import {Stack, Typography} from "@mui/material";

export function Consumption({
  powerConsumption,
}: {
  powerConsumption: number;
}) {
  let color = "#333";

  if (powerConsumption > 0) {
    color = "#32ef52";
  }

  if (powerConsumption > 1) {
    color = "#32adef";
  }

  if (powerConsumption > 1.5) {
    color = "#ef7a32";
  }

  if (powerConsumption > 2) {
    color = "#ef3232";
  }

  return (
    <Stack direction="row" alignItems="center">
      <PulseDot color={color} style={{ fontSize: "2em" }} />
      <Typography variant="h4" component="h2">{powerConsumption} kWh</Typography>
    </Stack>
  );
}
