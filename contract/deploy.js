// console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery,
  Hbar,
  ContractCreateFlow,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);
client.setMaxQueryPayment(new Hbar(100)); // Increase the max query payment as needed

async function main() {
  // Import the compiled contract bytecode
  const contractBytecode = fs.readFileSync(
    "./build/contracts_PowerAmpDemandResponse_sol_PowerAmpDemandResponse.bin"
  );

  // // Instantiate the smart contract
  const contractCreateTx = new ContractCreateFlow()
    .setBytecode(contractBytecode)
    .setGas(500000)
    .setConstructorParameters(
      new ContractFunctionParameters().addUint256(10000000000)
    );
  const contractCreateSubmit = await contractCreateTx.execute(client);
  const contractCreateRx = await contractCreateSubmit.getReceipt(client);
  const contractId = contractCreateRx.contractId;
  const contractAddress = contractId.toSolidityAddress();
  console.log(`- The smart contract ID is: ${contractId} \n`);
  console.log(`- Smart contract ID in Solidity format: ${contractAddress} \n`);
}
main();
