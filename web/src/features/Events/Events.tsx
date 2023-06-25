import { useAppContext } from "../../AppContext";
import { useEvents } from "./useEvents";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { Logo } from "../../components/Logo/Logo";
import {
  DemandResponseEvent,
  OptInDemandResponseEvent,
  optInToEvent,
} from "../../service/contract";
import { useOptInEvents } from "./useOptInEvents";
import { useState } from "react";

function formatDate(date: Date): string {
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString("en-AU", options as any);

  return formattedDate;
}

export function Events() {
  const { magicWallet } = useAppContext();

  const events = useEvents(magicWallet!);
  const optInEvents = useOptInEvents(magicWallet!);

  console.log(optInEvents);

  if (!events || !optInEvents) {
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

  const upcomingEvents = events
    .filter((e) => e.startTimestamp > Date.now() / 1000)
    .filter((e) => !optInEvents.find((o) => o.eventId === e.id));

  const optedInEvents = optInEvents.filter(
    (e) => events[e.eventId].startTimestamp > Date.now() / 1000
  );
  const pastEvents = optInEvents.filter(
    (e) => events[e.eventId].startTimestamp < Date.now() / 1000
  );

  return (
    <Stack spacing={4}>
      <Typography>
        Opt in to upcoming events. Reduce your consumption during the event to
        earn AMPs.
      </Typography>
      <Stack spacing={2}>
        <Typography variant="h5">Upcoming events</Typography>
        {upcomingEvents.length === 0 && (
          <Typography>No upcoming events</Typography>
        )}
        {upcomingEvents?.map((event, ix) => (
          <div key={ix}>
            <Event event={event} showJoin={true} />
          </div>
        ))}
      </Stack>
      <Stack spacing={2}>
        <Typography variant="h5">Opted in events</Typography>
        {optedInEvents.length === 0 && (
          <Typography>No opted in events</Typography>
        )}
        {optedInEvents?.map((optInEvent) => (
          <div key={optInEvent.eventId}>
            <OptInEvent
              event={events[optInEvent.eventId]}
              optInEvent={optInEvent}
            />
          </div>
        ))}
      </Stack>
      <Stack spacing={2}>
        <Typography variant="h5">Past events</Typography>
        {pastEvents.length === 0 && <Typography>No past events</Typography>}
        {pastEvents.map((optInEvent) => (
          <div key={optInEvent.eventId}>
            <OptInEvent
              isPast={true}
              optInEvent={optInEvent}
              event={events[optInEvent.eventId]}
            />
          </div>
        ))}
      </Stack>
    </Stack>
  );
}

function OptInEvent({
  optInEvent,
  event,
  isPast = false,
}: {
  optInEvent: OptInDemandResponseEvent;
  event: DemandResponseEvent;
  isPast?: boolean;
}) {
  return (
    <Paper
      elevation={4}
      sx={{
        padding: 4,
        border: "1px solid #eee",
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Chip color="secondary" label={isPast ? "Completed" : "Joined"}></Chip>
        </Box>

        <Stack>
          <Typography variant="h6">Joined</Typography>
          <div>{formatDate(new Date(optInEvent.optedInTimestamp * 1000))}</div>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Stack sx={{ width: "100%" }}>
            <Typography variant="h6">Estimated usage</Typography>
            <Typography>
              {`${optInEvent.estimatedEnergyUsage || "1.45"} kWh`}
            </Typography>
            {!isPast && (
              <Typography variant="caption">
                Beat your estimated usage to earn AMP tokens
              </Typography>
            )}
          </Stack>
          {isPast && (
            <Stack sx={{ width: "100%" }}>
              <Typography variant="h6">Actual energy usage</Typography>
              <Typography>{`${
                optInEvent.actualEnergyUsage || "0.45"
              } kWh`}</Typography>
            </Stack>
          )}
          {isPast && (
            <Stack sx={{ width: "100%" }}>
              <Typography variant="h6">Energy saved</Typography>
              <Typography>{`${optInEvent.energySaving || "1"} kWh`}</Typography>
            </Stack>
          )}
        </Stack>
        <Divider />
        {isPast && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <img
              src="/amp-logo.png"
              style={{ width: 40, objectFit: "cover" }}
            />
            <Stack>
              <Typography variant="h4">Your reward</Typography>
              <Typography variant="h6">{`${((optInEvent.energySaving || 1) * 100).toFixed(
                0
              )} AMPs`}</Typography>
            </Stack>
          </Stack>
        )}
        <Divider />
        <Stack direction="row" spacing={4}>
          <Stack>
            <Typography variant="h6">Start</Typography>
            <div>{formatDate(new Date(event.startTimestamp * 1000))}</div>
          </Stack>
          <Stack>
            <Typography variant="h6">End</Typography>
            <div>{formatDate(new Date(event.endTimestamp * 1000))}</div>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}

function Event({
  event,
  showJoin = false,
}: {
  event: DemandResponseEvent;
  showJoin?: boolean;
}) {
  const { magicWallet } = useAppContext();
  const [loading, setLoading] = useState(false);

  return (
    <Paper
      elevation={4}
      sx={{
        padding: 4,
        border: "1px solid #eee",
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Chip
            color={showJoin ? "primary" : "info"}
            label="Demand response event"
          ></Chip>
        </Box>
        <Stack direction="row" spacing={4}>
          <Stack>
            <Typography variant="h6">Start</Typography>
            <div>{formatDate(new Date(event.startTimestamp * 1000))}</div>
          </Stack>
          <Stack>
            <Typography variant="h6">End</Typography>
            <div>{formatDate(new Date(event.endTimestamp * 1000))}</div>
          </Stack>
        </Stack>
        {showJoin ? (
          <div>
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={async () => {
                setLoading(true);
                await optInToEvent(event.id, magicWallet!);
                setLoading(false);
              }}
            >
              Join event
            </LoadingButton>
          </div>
        ) : null}
      </Stack>
    </Paper>
  );
}
