import { Interface } from "@ethersproject/abi";
import { abi } from "./abi";
import {
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Signer,
} from "@hashgraph/sdk";
import { MagicWallet } from "../MagicWallet";

export const abiInterface = new Interface(abi);

const TESTNET_CONTRACT_ADDRESS = "0.0.14821969";

const FUNCTIONS = {
  getEvents: "getEvents",
  optInToEvent: "optInToEvent",
  getOptedInEvents: "getOptedInEvents",
};

export interface DemandResponseEvent {
  name: string;
  startTimestamp: number;
  endTimestamp: number;
}

export async function getEvents(
  magicWallet: MagicWallet
): Promise<DemandResponseEvent[]> {
  try {
    // Build the query
    const query = await new ContractCallQuery()
      .setContractId(TESTNET_CONTRACT_ADDRESS)
      .setGas(1000000) // Increase the gas limit as needed
      .setFunction(FUNCTIONS.getEvents)
      .executeWithSigner(magicWallet as Signer);

    let results = abiInterface.decodeFunctionResult(
      FUNCTIONS.getEvents,
      query.bytes
    );
    const events = results[0].map((rawEvent: any) => ({
      name: rawEvent.name,
      startTimestamp: parseInt(rawEvent.startTimestamp.toString()),
      endTimestamp: parseInt(rawEvent.endTimestamp.toString()),
    }));

    return events;
  } catch (error) {
    console.error("Error retrieving events:", error);
    return Promise.reject("Could not get events");
  }
}

export async function getOptInEvents(
  magicWallet: MagicWallet
): Promise<DemandResponseEvent[]> {
  try {
    // Build the query
    const query = await new ContractCallQuery()
      .setContractId(TESTNET_CONTRACT_ADDRESS)
      .setGas(1000000) // Increase the gas limit as needed
      .setFunction(FUNCTIONS.getOptedInEvents)
      .executeWithSigner(magicWallet as Signer);

    let results = abiInterface.decodeFunctionResult(
      FUNCTIONS.getOptedInEvents,
      query.bytes
    );

    console.log(results);

    const events = results[0].map((rawEvent: any) => ({
      eventId: rawEvent.name,
      startTimestamp: parseInt(rawEvent.startTimestamp.toString()),
      endTimestamp: parseInt(rawEvent.endTimestamp.toString()),
    }));

    return events;
  } catch (error) {
    console.error("Error retrieving events:", error);
    return Promise.reject("Could not get events");
  }
}

export async function optInToEvent(
  eventId: number,
  magicWallet: MagicWallet
): Promise<void> {
  try {
    debugger;
    // Build the query
    const tx = await new ContractExecuteTransaction()
      .setContractId(TESTNET_CONTRACT_ADDRESS)
      .setGas(1000000) // Increase the gas limit as needed
      .setFunction(
        FUNCTIONS.optInToEvent,
        new ContractFunctionParameters().addUint256(eventId)
      )
      .freezeWithSigner(magicWallet as Signer);

    const res = await tx.executeWithSigner(magicWallet as Signer);

    console.log(res);
  } catch (error) {
    debugger;
    console.error("Error joining event:", error);
    return Promise.reject("Could not join event");
  }
}
