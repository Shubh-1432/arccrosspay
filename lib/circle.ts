import { initiateSmartContractPlatformClient } from "@circle-fin/smart-contract-platform";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

if (!process.env.CIRCLE_API_KEY || !process.env.ENTITY_SECRET) {
  // We'll use placeholder values for now to avoid build errors if not set yet, 
  // but they must be provided in .env.local
  console.warn("CIRCLE_API_KEY or ENTITY_SECRET is missing. Check your .env.local file.");
}

export const scpClient = initiateSmartContractPlatformClient({
  apiKey: process.env.CIRCLE_API_KEY || "REPLACE_ME",
  entitySecret: process.env.ENTITY_SECRET || "REPLACE_ME",
});

export const walletsClient = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY || "REPLACE_ME",
  entitySecret: process.env.ENTITY_SECRET || "REPLACE_ME",
});
