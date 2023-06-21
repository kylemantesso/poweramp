const {
  ContractExecuteTransaction
} = require("@hashgraph/sdk");
const { getClient, abi } = require("./util");
const { Interface } = require("@ethersproject/abi");

const client = getClient();

// Set the smart contract and contract function information
const contractId = "0.0.14821969";
const contractFunction = "createEvent";

// Example function to create an event
async function createEvent(startTimestamp, endTimestamp) {
  try {
    // generate function call with function name and parameters
    const functionCallAsUint8Array = encodeFunctionParameters(contractFunction, [
      startTimestamp,
      endTimestamp,
      "Test Event",
    ]);

    // execute the transaction calling the set_message contract function
    const transaction = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setFunctionParameters(functionCallAsUint8Array)
      .setGas(1500000) // Increase the gas limit as needed
      .execute(client);

    // get the receipt for the transaction
    const receipt = await transaction.getReceipt(client);
    console.log(receipt);
  } catch (error) {
    console.error("Error creating events:", error);
  }
}

// Example usage
const startTimestamp = Math.floor(
  new Date("2023-06-20T00:00:00Z").getTime() / 1000
);
const endTimestamp = Math.floor(
  new Date("2023-06-20T01:00:00Z").getTime() / 1000
);

createEvent(startTimestamp, endTimestamp);

function encodeFunctionParameters(functionName, parameterArray) {
  // build the call parameters using ethers.js
  // .slice(2) to remove leading '0x'

  console.log(abi);

  const abiInterface = new Interface(abi);
  const functionCallAsHexString = abiInterface
    .encodeFunctionData(functionName, parameterArray)
    .slice(2);
  // convert to a Uint8Array
  return Buffer.from(functionCallAsHexString, `hex`);
}
