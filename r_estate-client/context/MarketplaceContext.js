import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { ethers } from 'ethers';
import { useSigner } from 'wagmi';
import { MARKETPLACE_ADDRESS, rpcProvider } from "../Config";

import marketplaceJson from '../MarketplaceAbi.json';

const marketplaceABI = marketplaceJson.abi;

export const MarketplaceContext = createContext();

export function useMarketplace() {
  return useContext(MarketplaceContext);
}

export const MarketplaceProvider = ({ children }) => {
  const { data: signer } = useSigner();
  const [marketplace, setMarketplace] = useState(null);

  useEffect(() => {
    if (!MARKETPLACE_ADDRESS || !marketplaceABI) return;

    const marketplaceContract = new ethers.Contract(
      MARKETPLACE_ADDRESS,
      marketplaceABI,
      signer || rpcProvider
    );
  console.log("Marketplace address:", marketplaceContract.address); // 👈 THÊM DÒNG NÀY

    setMarketplace(marketplaceContract);
  }, [signer]);

  return (
    <MarketplaceContext.Provider value={{ marketplace }}>
      {children}
    </MarketplaceContext.Provider>
  );
};
