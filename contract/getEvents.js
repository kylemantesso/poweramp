const {
  Client,
  ContractCallQuery,
  PrivateKey,
  Hbar,
} = require("@hashgraph/sdk");
const { getClient, abi } = require("./util");
const { Interface } = require("@ethersproject/abi");

const client = getClient();

// Set the smart contract and contract function information
const contractId = "0.0.14821969";
const contractFunction = "getEvents";

// Setup an ethers.js interface using the abi
const abiInterface = new Interface(abi);

// Example function to get all events
async function getEvents() {
  try {
    // Build the contract function call

    // Build the query
    const query = await new ContractCallQuery()
      .setContractId(contractId)
      .setGas(1000000) // Increase the gas limit as needed
      .setFunction(contractFunction)
      .execute(client);

    let results = abiInterface.decodeFunctionResult(contractFunction, query.bytes);


    console.log(results);
  } catch (error) {
    console.error("Error retrieving events:", error);
  }
}

// Call the function to get all events
getEvents();
