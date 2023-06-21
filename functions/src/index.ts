import * as functions from "firebase-functions";
import {
  Client,
  TopicMessageSubmitTransaction,
  TopicId,
  TopicCreateTransaction,
  Transaction,
  AccountId,
  PrivateKey,
  PublicKey,
  AccountCreateTransaction,
  Hbar,
  TransferTransaction,
} from "@hashgraph/sdk";
import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import * as cors from "cors";
const corsHandler = cors({ origin: true });

// TESTNET
// const PUBLIC_KEY =
//   "302a300506032b6570032100bd0cda6ee60df41d2768df4c6bf011aa7dac9a0763863d3d998f66b65691b5bd";
// const PRIVATE_KEY =
//   "302e020100300506032b6570042204200bb184b181a3094be857189b014f2826114189c4a9373daf66f626cf292060d7";
const PRIVATE_KEY_HEX =
  "0x0bb184b181a3094be857189b014f2826114189c4a9373daf66f626cf292060d7";
const ACCOUNT_ID = "0.0.13335931";

// const PRIVATE_KEY_HEX = "0x56154346c9a1db372e12e812fe63ce800e5bb8bb46bfb8f0c440502f78ba5a11"
// const ACCOUNT_ID = "0.0.1006"

const INTERVAL = 20000; // 20 seconds
const PULSE_CONSTANT = 1000; // 1000 pulses per kWh

initializeApp({
  projectId: "helix-grid",
  // databaseURL: 'http://127.0.0.1:9000/?ns=helix-grid'
  databaseURL:
    "https://helix-grid-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

const privateKeyBytes = Buffer.from(PRIVATE_KEY_HEX.slice(2), "hex");
const privateKey = PrivateKey.fromBytes(privateKeyBytes);
const PUBLIC_KEY = privateKey.publicKey;

const getClient = (accountId: string, privateKey: string) => {
  return Client.forTestnet().setOperator(accountId, privateKey);
  // const node = { "127.0.0.1:50211": new AccountId(3) };
  // const client = Client.forNetwork(node).setMirrorNetwork("127.0.0.1:5600");
  // client.setOperator(ACCOUNT_ID, privateKey);
  // return client;
};

export const login = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    if (request.body.accountId === undefined) {
      response.send("No account id found");
      return;
    }

    const db = getDatabase();

    const cleanedAccountId = request.body.accountId.split(".").join("-");
    console.log(cleanedAccountId);

    // If user already exists, do nothing
    const snap = await db.ref(`account/${cleanedAccountId}`).get();
    if (snap.exists()) {
      return;
    }

    // Load test account with hbar for hackathon
    const client = getClient(ACCOUNT_ID, privateKey.toStringDer());

    const myAccountId = AccountId.fromString(ACCOUNT_ID);
    const newAccountId = AccountId.fromString(request.body.accountId);

    //Create the transaction
    const transferTx = new TransferTransaction()
      .addHbarTransfer(myAccountId, Hbar.fromTinybars(-100)) //Sending account, amount in tinybar
      .addHbarTransfer(newAccountId, Hbar.fromTinybars(100)); //Receiving account, amount in tinybar

    //Sign with the sender account private key
    const res = await transferTx.execute(client);

    const receipt = await res.getReceipt(client);

    console.log("receipt", receipt);
    console.log("receipt status", receipt.status);

    // Add test device for hackathon
    await db.ref(`account/${cleanedAccountId}`).set({
      deviceId: "6081F910A956EC6D",
    });

    return;
  });
});

export const pulseCount = functions.https.onRequest(
  async (request, response) => {
    const db = getDatabase();

    const snap = await db.ref(`device/${request.body.dev_eui}/topic`).get();

    let topic = "";

    if (!snap.exists()) {
      console.log("create topic");
      const topicId = await createTopic(request.body.dev_eui);
      topic = topicId.toString();
      console.log("Topic id", topicId);
      await db.ref(`device/${request.body.dev_eui}`).set({ topic });
    } else {
      console.log(snap.val());
      topic = snap.val();
    }

    // Check if payload is available
    if (request.body.payload === undefined) {
      response.send("No payload found");
      return;
    }

    console.log(request.body.payload);
    console.log(request.body);

    const payloadBuffer = Buffer.from(request.body.payload, "base64");

    // Extract the signature, public key, and pulseCount from the payload
    const signature = payloadBuffer.slice(0, 64).toString("hex");
    const pulseCountBuffer = payloadBuffer.slice(64, 68);

    // Convert pulseCount from a Buffer to a number
    const pulseCount = pulseCountBuffer.readUInt32BE(0);

    console.log({
      new: "new3",
      signature: signature,
      pulseCount: pulseCount,
    });

    // Convert time difference from milliseconds to hours
    const timeInHours = INTERVAL / 3600000;

    // Calculate power usage in kW
    const powerUsage = (pulseCount / PULSE_CONSTANT / timeInHours).toFixed(6);

    console.log(`Power Usage: ${powerUsage} kW`);
    //
    // db.ref(`data/${PUBLIC_KEY}`).push({
    //   pulseCount,
    //   powerUsage,
    //   deviceName: request.body.name,
    //   deviceId: request.body.dev_eui,
    // });

    // const client = getClient(ACCOUNT_ID, PRIVATE_KEY);
    const client = getClient(ACCOUNT_ID, privateKey.toStringDer());

    console.log("TOPIC", topic);

    // // // Set topic ID (replace with your own)
    const topicId = TopicId.fromString(topic);

    const consumption = 0.00556 * parseFloat(powerUsage);

    console.log("CONSUMPTION", consumption);

    // // // Create a new transaction to submit the message
    const transaction = new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(`${signature}_${powerUsage}_${consumption}`); // this is the signed message
    //
    // // // Execute the transaction
    const txResponse = await transaction.execute(client);
    // //
    // // // Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);
    // //
    // // Log the transaction status
    functions.logger.info(
      `Status of transaction: ${receipt.status.toString()}`
    );

    // If successful, respond with the transaction ID
    if (receipt.status.toString() === "SUCCESS") {
      response.send(
        `Message submitted successfully. Transaction ID: ${txResponse.transactionId.toString()}`
      );
    } else {
      response.send("Message submission failed.");
    }
  }
);

//

// export const testSubmitMessage = functions.https.onRequest(
//   async (request, response) => {
//     const res = await submitMessage("Hello, Hedera!", "0.0.14073457");
//     return res.transactionId;
//   }
// );
//
// function submitMessage(message: string, topicId: string) {
//   const client = getClient(ACCOUNT_ID, privateKey.toStringDer());
//   return new TopicMessageSubmitTransaction({
//     topicId,
//     message,
//   }).execute(client);
// }

async function createTopic(deviceId: string) {
  const client = getClient(ACCOUNT_ID, privateKey.toStringDer());

  const transaction = new TopicCreateTransaction({
    topicMemo: deviceId,
  });

  //Sign with the client operator private key and submit the transaction to a Hedera network
  const txResponse = await transaction.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the topic ID
  const newTopicId = receipt.topicId;

  console.log("The new topic ID is " + newTopicId);

  if (!newTopicId) {
    throw new Error("Could not create topic");
  }

  return newTopicId;
}

// export const createAccount = functions.https.onRequest(async (request, response) => {
//
//   console.log(request.body);
//
//   try {
//     const {publicKey} = request.body;
//
//     const client = await getClient(ACCOUNT_ID, PRIVATE_KEY);
//     const hederaKey = PublicKey.fromString(publicKey);
//
//
//     const res = await new AccountCreateTransaction()
//         .setInitialBalance(new Hbar(0))
//         .setKey(hederaKey)
//         .execute(client);
//
//     console.log(res);
//
//     const receipt = await res.getReceipt(client);
//
//
//     if (receipt.accountId) {
//       console.log(receipt.accountId.toString());
//       response.status(200).send({accountId: receipt.accountId.toString()});
//     } else {
//         response.status(400).send({error: "Error creating account"});
//     }
//   } catch (e) {
//     response.status(400).send({error: (e as unknown as Error).message});
//   }
// });
