import { useEffect, useState } from "react";
import { DemandResponseEvent, getEvents } from "../../service/contract";
import { MagicWallet } from "../../MagicWallet";

export function useEvents(magicWallet: MagicWallet) {
  const [events, setEvents] = useState<DemandResponseEvent[]>();

  useEffect(() => {
    getEvents(magicWallet).then((events) => {
      setEvents(events);
    });
  }, []);

  return events;
}
