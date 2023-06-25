require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  TokenSupplyType,
  Hbar,
  TokenCreateTransaction,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);
client.setMaxQueryPayment(new Hbar(100)); // Increase the max query payment as needed



async function main() {
  try {
    // Deploy the PowerAmpToken contract
    const tokenContractAddress = await deployTokenContract();

    console.log("Deployment completed successfully!");
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main();
