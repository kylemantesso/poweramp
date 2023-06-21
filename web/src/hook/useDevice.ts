import { useEffect, useState } from "react";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { db } from "../service/firebase";

interface Device {
  deviceId: string;
  account: string;
  topic: string;
}
export function useDevice(accountId: string) {
  const [device, setDevice] = useState<Device>();

  useEffect(() => {
    if (accountId) {
      const deviceRef = query(
        ref(db, "device"),
        orderByChild("account"),
        equalTo(accountId)
      );
      get(deviceRef).then((snap) => {
        const res = snap.val();
        const [deviceId] = Object.keys(res);
        setDevice({
          deviceId,
          topic: res[deviceId].topic,
          account: res[deviceId].account,
        });
        console.log(res);
      });
    }
  }, [accountId]);

  return device;
}
