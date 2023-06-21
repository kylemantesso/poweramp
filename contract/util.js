require("dotenv").config();
const fs = require("fs");

const { AccountId, PrivateKey, Client, Hbar } = require("@hashgraph/sdk");
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

module.exports.getClient = function getClient() {
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);
  client.setMaxQueryPayment(new Hbar(100)); // Increase the max query payment as needed

  return client;
};

module.exports.abi = [
  {
    inputs: [
      { internalType: "uint256", name: "_initialTokenSupply", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_eventId", type: "uint256" },
      { internalType: "address[]", name: "_users", type: "address[]" },
      { internalType: "uint256[]", name: "_actualUsages", type: "uint256[]" },
    ],
    name: "addActualEnergyUsage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_eventId", type: "uint256" },
      { internalType: "address[]", name: "_users", type: "address[]" },
      {
        internalType: "uint256[]",
        name: "_estimatedUsages",
        type: "uint256[]",
      },
    ],
    name: "assignEstimatedEnergyUsage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_startTimestamp", type: "uint256" },
      { internalType: "uint256", name: "_endTimestamp", type: "uint256" },
      { internalType: "string", name: "_name", type: "string" },
    ],
    name: "createEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "eventId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "events",
    outputs: [
      { internalType: "uint256", name: "startTimestamp", type: "uint256" },
      { internalType: "uint256", name: "endTimestamp", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getEvents",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "startTimestamp", type: "uint256" },
          { internalType: "uint256", name: "endTimestamp", type: "uint256" },
          { internalType: "string", name: "name", type: "string" },
        ],
        internalType: "struct PowerAmpDemandResponse.Event[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOptedInEvents",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "eventId", type: "uint256" },
          {
            internalType: "uint256",
            name: "optedInTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "estimatedEnergyUsage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "actualEnergyUsage",
            type: "uint256",
          },
          { internalType: "uint256", name: "energySaving", type: "uint256" },
        ],
        internalType: "struct PowerAmpDemandResponse.OptedInEvent[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_eventId", type: "uint256" }],
    name: "optInToEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "optedInEvents",
    outputs: [
      { internalType: "uint256", name: "eventId", type: "uint256" },
      { internalType: "uint256", name: "optedInTimestamp", type: "uint256" },
      {
        internalType: "uint256",
        name: "estimatedEnergyUsage",
        type: "uint256",
      },
      { internalType: "uint256", name: "actualEnergyUsage", type: "uint256" },
      { internalType: "uint256", name: "energySaving", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "powerAmpToken",
    outputs: [
      { internalType: "contract PowerAmpToken", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
];
