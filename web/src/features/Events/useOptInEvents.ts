import { useEffect, useState } from "react";
import {
  getOptInEvents,
} from "../../service/contract";
import { MagicWallet } from "../../MagicWallet";

export function useOptInEvents(magicWallet: MagicWallet) {
  const [events, setEvents] = useState<any>();

  useEffect(() => {
    getOptInEvents(magicWallet).then((events) => {
      setEvents(events);
    });
  }, []);

  return events;
}
