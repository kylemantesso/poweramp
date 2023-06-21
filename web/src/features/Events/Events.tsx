import { useAppContext } from "../../AppContext";
import { useEvents } from "./useEvents";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Logo } from "../../components/Logo/Logo";
import { optInToEvent } from "../../service/contract";
import {useOptInEvents} from "./useOptInEvents";

export function Events() {
  const { magicWallet, userMetadata } = useAppContext();

  const events = useEvents(magicWallet!);
  const test = useOptInEvents(magicWallet!);

  if (!events) {
    return (
      <Stack alignItems="center">
        <Box p={8}>
          <Logo />
          <Typography align="center" variant="h5">
            Loading events...
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
        <Typography variant="h5">Upcoming events</Typography>
        {events?.map((event, ix) => (
          <div key={ix}>
            <div>{event.name}</div>
            <div>{new Date(event.startTimestamp * 1000).toString()}</div>
            <div>{new Date(event.endTimestamp * 1000).toString()}</div>
            <div>
              <Button
                variant="contained"
                onClick={() => optInToEvent(ix + 1, magicWallet!)}
              >
                Join event
              </Button>
            </div>
          </div>
        ))}
      </Stack>
    </Stack>
  );
}
