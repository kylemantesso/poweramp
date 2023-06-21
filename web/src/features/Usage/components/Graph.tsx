import { Stack, Typography } from "@mui/material";
import {
  Bar,
  XAxis,
  YAxis,
  BarChart,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { AggregatedUsage } from "../../../service/Hedera";

export function Graph({ messages }: { messages: Array<AggregatedUsage> }) {
  return (
    <Stack>
      <Typography textAlign="center" variant="h6">
        Usage
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={messages}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          {/*<Bar dataKey="consumption" fill="#8884d8" />*/}
          <Bar dataKey="totalConsumption" fill="#3022C3" label="Hello">
            <LabelList
              dataKey="totalConsumption"
              position="top"
              formatter={(value: number) => `${(value).toFixed(2)} kWh`}
              fontWeight="bold"
              offset={10}
            />
          </Bar>
          <XAxis dataKey="label" />
          <YAxis
            label={{
              value: "kWh",
              angle: -90,
              position: "insideLeft",
              offset: 8, // Adjust the offset to prevent overlapping
            }}
            tickMargin={10} // Increase the tick margin for better label visibility
          />
        </BarChart>
      </ResponsiveContainer>
    </Stack>
  );
}
