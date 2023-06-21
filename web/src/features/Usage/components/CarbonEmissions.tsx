import { Stack, Typography } from "@mui/material";
import PulseDot from "react-pulse-dot";
import "react-pulse-dot/dist/index.css";

// Define the emissions factor for coal electricity generation in Australia
const emissionsFactorCoal = 0.95; // kgCO2/kWh

// Convert power consumption (kWh) to carbon emissions (kgCO2)
const convertToCarbonEmissions = (powerConsumption: number) => {
  return (powerConsumption * emissionsFactorCoal).toFixed(2);
};

export function CarbonEmissions({
  powerConsumption,
}: {
  powerConsumption: number;
}) {
  // Convert power consumption to carbon emissions
  const carbonEmissions = convertToCarbonEmissions(powerConsumption);

  let color = "#333";

  return (
    <Stack direction="row" alignItems="center">
      <PulseDot color={color} style={{ fontSize: "2em" }} />
      <Typography variant="h4" component="h2">
        {carbonEmissions} kgCO₂
      </Typography>
    </Stack>
  );
}
