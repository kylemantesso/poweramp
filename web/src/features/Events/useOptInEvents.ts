import { useEffect, useState } from "react";
import {
  getOptInEvents, OptInDemandResponseEvent,
} from "../../service/contract";
import { MagicWallet } from "../../MagicWallet";

export function useOptInEvents(magicWallet: MagicWallet) {
  const [events, setEvents] = useState<OptInDemandResponseEvent[]>();

  useEffect(() => {
    getOptInEvents(magicWallet).then((events) => {
      setEvents(events);
    });
  }, []);

  return events;
}
