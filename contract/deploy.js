require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  ContractFunctionParameters,
  Hbar,
  ContractCreateFlow,
  TokenCreateTransaction,
  TokenSupplyType,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);
client.setMaxQueryPayment(new Hbar(100)); // Increase the max query payment as needed

async function deployTokenContract() {
  console.log("Creating poweramp token");
  const tokenCreateTx = await new TokenCreateTransaction()
    .setTokenName("PowerAmp Token") // Set the token name
    .setTokenSymbol("AMP") // Set the token symbol
    .setDecimals(18) // Set the number of decimal places
    .setInitialSupply(10000000) // Set the initial token supply
    .setSupplyType(TokenSupplyType.Infinite) // Set the token supply type (FINITE, INFINITE, or NO_SUPPLY)
    .setAdminKey(operatorKey) // Set the admin key
    .setTreasuryAccountId(operatorId) // Set the treasury account ID
    .setSupplyKey(operatorKey) // Set the supply key
    .freezeWith(client);

  const signTx = await tokenCreateTx.sign(operatorKey);
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);

  const tokenId = receipt.tokenId.toString();
  const tokenAddress = receipt.tokenId.toSolidityAddress();
  console.log("Token created successfully!");
  console.log("Token ID:", tokenId);

  return tokenAddress;
}

async function deployDemandResponseContract(tokenContractAddress) {
  console.log("Deploying PowerAmpDemandResponse contract...");

  // Import the compiled contract bytecode
  const contractBytecode = fs.readFileSync(
    "./build/contracts_PowerAmpDemandResponse_sol_PowerAmpDemandResponse.bin"
  );

  // Instantiate the demand response contract
  const contractCreateTx = new ContractCreateFlow()
    .setBytecode(contractBytecode)
    .setGas(500000)
    .setConstructorParameters(
      new ContractFunctionParameters().addAddress(tokenContractAddress)
    );
  const contractCreateSubmit = await contractCreateTx.execute(client);
  const contractCreateRx = await contractCreateSubmit.getReceipt(client);
  const contractId = contractCreateRx.contractId;
  const contractAddress = contractId.toSolidityAddress();
  console.log("PowerAmpDemandResponse contract deployed successfully!");
  console.log("- Contract ID:", contractId.toString());
  console.log("- Contract Address:", contractAddress, "\n");
}

async function main() {
  try {
    // Deploy the PowerAmpToken contract
    const tokenContractAddress = await deployTokenContract();

    // Deploy the PowerAmpDemandResponse contract with the PowerAmpToken address
    await deployDemandResponseContract(tokenContractAddress);

    console.log("Deployment completed successfully!");
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main();
