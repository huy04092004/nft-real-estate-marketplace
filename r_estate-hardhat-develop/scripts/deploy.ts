

import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Wallet, providers } from "ethers";
dotenv.config();

async function main() {
  // Lấy RPC và private key từ .env
  const provider = new providers.JsonRpcProvider(process.env.SEPOLIA_RPC);
  const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);

  const GOVERNMENT_ACCOUNT_ADDRESS = wallet.address;

  console.log("Deploying contracts with account:", GOVERNMENT_ACCOUNT_ADDRESS);

  // Deploy Marketplace
  const Marketplace = await ethers.getContractFactory("Marketplace", wallet);
  const marketplace = await Marketplace.deploy(GOVERNMENT_ACCOUNT_ADDRESS);
  await marketplace.deployed();
  console.log("Marketplace deployed:", marketplace.address);

  // Deploy PropertyNFT
  const PropertyNFT = await ethers.getContractFactory("PropertyNFT", wallet);
  const nft = await PropertyNFT.deploy(marketplace.address);
  await nft.deployed();
  console.log("PropertyNFT deployed:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
