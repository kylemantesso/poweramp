import { DataGrid } from "@mui/x-data-grid";
import { Usage } from "../../../service/Hedera";

export function DataTable({ usage }: { usage: Array<Usage> }) {
  // Get the last 10 items and reverse the order
  const lastTenMessages = usage.slice(-10).reverse();

  // Map the data to the format expected by DataGrid
  const rows = lastTenMessages.map((message, index) => {
    // Convert the date to the desired format
    const formattedDate = new Date(message.date).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return {
      id: index, // This can be changed to a unique id if available
      consumption: (message.consumption * 1000).toFixed(2),
      date: formattedDate, // Use the formatted date
      powerUsage: message.powerUsage,
    };
  });

  const columns = [
    { field: "date", headerName: "Date", width: 200 },
    { field: "consumption", headerName: "Consumption (W)", width: 200 },
    { field: "powerUsage", headerName: "Power Usage (kWh)", width: 200 },
  ];

  return <DataGrid rows={rows} columns={columns} />;
}
