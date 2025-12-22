
import { ethers } from "ethers";
export const MARKETPLACE_ADDRESS = '0x19b13c79BF89f15625eFfc420f0355f0DF21eB4D'; // Marketplace trên Sepolia
export const PROPERTY_NFT_ADDRESS = '0x99D777dfbAc9af1181F68992de562451F9318CCA'; // PropertyNFT trên Sepolia

export const rpcProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_SEPOLIA_URL
);
