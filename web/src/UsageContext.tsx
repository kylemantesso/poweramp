import React, { useEffect, useState } from "react";
import {
  aggregateDataPerHour,
  AggregatedUsage,
  getTopicMessages,
  Usage,
} from "./service/Hedera";
import { useDevice } from "./hook/useDevice";

export const UsageContext = React.createContext<{
  aggregatedUsage: AggregatedUsage[];
  usage: Usage[];
}>({
  aggregatedUsage: [],
  usage: [],
});

export const useUsage = () => React.useContext(UsageContext);
export const UsageProvider = ({
  accountId,
  children,
  limitHours,
}: {
  accountId: string;
  children: React.ReactNode;
  limitHours?: number;
}) => {
  const [usage, setUsage] = useState<Array<Usage>>([]);
  const device = useDevice(accountId);
  const [limitTimestamp, setLimitTimestamp] = useState<number>(
    limitHours ? Date.now() - limitHours * 3600000 : 0
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchData = async () => {
      if (device) {
        const newMessages = await getTopicMessages(
          device.topic,
          limitTimestamp
        );
        if (newMessages.length > 0) {
          setUsage((prevMessages) => {
            if (
              prevMessages[prevMessages.length - 1]?.date?.getTime() !==
              newMessages[0].date.getTime()
            ) {
              return [...prevMessages, ...newMessages];
            } else {
              return prevMessages;
            }
          });

          const latestTimestamp =
            newMessages[newMessages.length - 1].date.getTime();
          setLimitTimestamp(latestTimestamp);
        }
      }
    };

    fetchData();
    interval = setInterval(fetchData, 20000);

    return () => clearInterval(interval);
  }, [accountId, device, limitTimestamp]);

  const aggregatedUsage = aggregateDataPerHour(usage);

  return (
    <UsageContext.Provider value={{ usage, aggregatedUsage }}>
      {children}
    </UsageContext.Provider>
  );
};
