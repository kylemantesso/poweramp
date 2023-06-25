interface Result {
  links?: {
    next?: string;
  };
  messages: Array<RawMessage>;
}

export interface RawMessage {
  chunk_info: ChunkInfo;
  consensus_timestamp: string;
  message: string;
  payer_account_id: string;
  running_hash: string;
  running_hash_version: number;
  sequence_number: number;
  topic_id: string;
}

export interface ChunkInfo {
  initial_transaction_id: InitialTransactionId;
  number: number;
  total: number;
}

export interface InitialTransactionId {
  account_id: string;
  nonce: number;
  scheduled: boolean;
  transaction_valid_start: string;
}

export interface Usage {
  date: Date;
  powerUsage: number;
  consumption: number;
}

export interface AggregatedUsage {
  label: string;
  hour: string;
  totalConsumption: number;
  averagePowerUsage: number;
}

function generateUnixTimestamp(hours?: number) {
  var date = new Date();
  if (hours !== undefined) {
    date.setHours(date.getHours() - hours);
  }
  return date.getTime() / 1000;
}

const BASE_URL = "https://testnet.mirrornode.hedera.com";

export async function getHoursTopicMessages(
  topic: string,
  limitHours: number = 1
) {
  const messages = [];

  let hasNext = true;

  let url = `${BASE_URL}/api/v1/topics/${topic}/messages?timestamp=gt:${generateUnixTimestamp(
    limitHours
  )}`;

  while (hasNext) {
    const res: Result = await fetch(url)
      .then((res) => res.json())
      .then((res) => res);
    messages.push(...res.messages);
    if (res.links?.next) {
      url = `${BASE_URL}${res.links.next}`;
    } else {
      hasNext = false;
    }
  }

  const formatted = messages.map((message) => {
    const decodedMessage = atob(message.message);

    const milliseconds = parseFloat(message.consensus_timestamp) * 1000; // Convert to milliseconds
    const date = new Date(milliseconds);

    const powerUsage = parseFloat(decodedMessage.split("_")[1]);
    const consumption = parseFloat(decodedMessage.split("_")[2]);

    return {
      date,
      powerUsage,
      consumption,
    };
  });

  return formatted;
}

export async function getTopicMessages(
  topic: string,
  fromTimestamp: number
): Promise<Array<Usage>> {
  const messages = [];

  let hasNext = true;

  let url = `${BASE_URL}/api/v1/topics/${topic}/messages?timestamp=gt:${fromTimestamp/1000}`;

  while (hasNext) {
    const res: Result = await fetch(url)
      .then((res) => res.json())
      .then((res) => res);
    messages.push(...res.messages);
    if (res.links?.next) {
      url = `${BASE_URL}${res.links.next}`;
    } else {
      hasNext = false;
    }
  }

  const formatted = messages.map((message) => {
    const decodedMessage = atob(message.message);

    const milliseconds = parseFloat(message.consensus_timestamp) * 1000; // Convert to milliseconds
    const date = new Date(milliseconds);

    const powerUsage = parseFloat(decodedMessage.split("_")[1]);
    const consumption = parseFloat(decodedMessage.split("_")[2]);
    return {
      date,
      powerUsage,
      consumption,
    };
  });

  return formatted;
}

export function aggregateDataPerHour(data: Array<Usage>): AggregatedUsage[] {
  const aggregatedData: {
    [hour: string]: {
      label: string;
      totalConsumption: number;
      sumPowerUsage: number;
      count: number;
    };
  } = {};

  for (const item of data) {
    const hour = new Date(
      item.date.getFullYear(),
      item.date.getMonth(),
      item.date.getDate(),
      item.date.getHours()
    ).toISOString();
    const label = new Date(hour).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    if (!aggregatedData[hour]) {
      aggregatedData[hour] = {
        label,
        totalConsumption: 0,
        sumPowerUsage: 0,
        count: 0,
      };
    }

    aggregatedData[hour].totalConsumption += item.consumption;
    aggregatedData[hour].sumPowerUsage += item.powerUsage;
    aggregatedData[hour].count++;
    aggregatedData[hour].label = label;
  }

  const result: AggregatedUsage[] = [];

  for (const hour in aggregatedData) {
    const { totalConsumption, sumPowerUsage, count, label } =
      aggregatedData[hour];
    const averagePowerUsage = count > 0 ? sumPowerUsage / count : 0;

    result.push({
      hour,
      label, // Add the label field
      totalConsumption,
      averagePowerUsage,
    });
  }

  return result;
}
