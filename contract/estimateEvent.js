const { ContractExecuteTransaction, PublicKey } = require("@hashgraph/sdk");
const { getClient, abi } = require("./util");
const { Interface } = require("@ethersproject/abi");

const client = getClient();

// Set the smart contract and contract function information
const contractId = "0.0.14938651";
const contractFunction = "assignEstimatedEnergyUsage";

// Example function to create an event
async function estimateEvent(eventId, users, estimates) {
  try {
    // generate function call with function name and parameters
    const functionCallAsUint8Array = encodeFunctionParameters(
      contractFunction,
      [eventId, users, estimates]
    );

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

const eventId = 1;
const users = ["0x2e6b0ecc8e1755e8ebeefbdf318012e23fbf9870"];
const estimates = [1];

const addresses = estimateEvent(eventId, users, estimates);

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
