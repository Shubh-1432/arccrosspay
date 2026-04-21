export const ARC_CROSS_PAY_ABI = [
  {
    "type": "function",
    "name": "USDC",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pay",
    "inputs": [
      { "name": "recipient", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" },
      { "name": "paymentId", "type": "string", "internalType": "string" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "PaymentMade",
    "inputs": [
      { "name": "payer", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "recipient", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "paymentId", "type": "string", "indexed": false, "internalType": "string" }
    ],
    "anonymous": false
  }
];

export const ARC_CROSS_PAY_BYTECODE = "0x6080604052348015600f57600080fd5b5061054d8061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80634a4bdb301461003b57806389a3027114610057575b600080fd5b610055600480360381019061005091906102d2565b610075565b005b61005f6101b7565b60405161006c9190610355565b60405180910390f35b73360000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd3386866040518463ffffffff1660e01b81526004016100c69392919061037f565b6020604051808303816000875af11580156100e5573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061010991906103ee565b610148576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161013f90610478565b60405180910390fd5b8373ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fbff0538a548e4ea8a217734a505ce9d9375306f438db1247603684e165834db88585856040516101a9939291906104e5565b60405180910390a350505050565b7336000000000000000000000000000000000000008156";

export const USDC_ABI = [
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{ "name": "account", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  }
];

export const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";
