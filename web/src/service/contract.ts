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

const TESTNET_CONTRACT_ADDRESS = "0.0.14938651";

const FUNCTIONS = {
  getEvents: "getEvents",
  optInToEvent: "optInToEvent",
  getOptedInEvents: "getOptedInEvents",
};

export interface DemandResponseEvent {
  id: number;
  name: string;
  startTimestamp: number;
  endTimestamp: number;
}

export interface OptInDemandResponseEvent {
  eventId: number;
  optedInTimestamp: number;
  actualEnergyUsage: number;
  estimatedEnergyUsage: number;
  energySaving: number;
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
    const events = results[0].map((rawEvent: any, ix: number) => ({
      id: ix + 1,
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
): Promise<OptInDemandResponseEvent[]> {
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

    const events = results[0].map((rawEvent: any) => ({
      eventId: parseInt(rawEvent.eventId.toString()),
      optedInTimestamp: parseInt(rawEvent.optedInTimestamp.toString()),
      actualEnergyUsage: parseInt(rawEvent.actualEnergyUsage.toString()),
      estimatedEnergyUsage: parseInt(rawEvent.estimatedEnergyUsage.toString()),
      energySaving: parseInt(rawEvent.energySaving.toString()),
    }));

    return events as OptInDemandResponseEvent[];
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
    // Build the query
    const tx = await new ContractExecuteTransaction()
      .setContractId(TESTNET_CONTRACT_ADDRESS)
      .setGas(1000000) // Increase the gas limit as needed
      .setFunction(
        FUNCTIONS.optInToEvent,
        new ContractFunctionParameters().addUint256(eventId)
      )
      .freezeWithSigner(magicWallet as Signer);

    await tx.executeWithSigner(magicWallet as Signer);
  } catch (error) {
    debugger;
    console.error("Error joining event:", error);
    return Promise.reject("Could not join event");
  }
}
