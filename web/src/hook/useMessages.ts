import { useEffect, useState } from "react";
import { useDevice } from "./useDevice";
import { aggregateDataPerHour, getTopicMessages, Usage } from "../service/Hedera";

export function useMessages(accountId: string, limitHours?: number) {
  const [messages, setMessages] = useState<Array<Usage>>([]);
  const device = useDevice(accountId);
  const [limitTimestamp, setLimitTimestamp] = useState<number>(
    limitHours ? Date.now() - limitHours * 3600000 : 0
  );
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchData = async () => {
      if (device && !isFetching) {
        setIsFetching(true);
        const newMessages = await getTopicMessages(device.topic, limitTimestamp);

        // Only update messages and limitTimestamp if new messages were fetched
        if (newMessages.length > 0) {
          setMessages((prevMessages) => [...prevMessages, ...newMessages]);

          // Get the timestamp of the latest message
          const latestTimestamp = newMessages[newMessages.length - 1].date.getTime();
          setLimitTimestamp(latestTimestamp);
        }
        setIsFetching(false);
      }
    };

    fetchData();

    interval = setInterval(() => {
      fetchData();
    }, 20000);

    return () => clearInterval(interval);
  }, [accountId, device, limitTimestamp]);

  const aggregated = aggregateDataPerHour(messages);

  return { messages, aggregated };
}
