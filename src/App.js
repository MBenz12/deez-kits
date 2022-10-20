import React from "react";
import Router from "./router/routes";
import './app.scss'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  SlopeWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useMemo } from "react";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = "https://api.devnet.solana.com";
  const wallet = useMemo(() => [
    new PhantomWalletAdapter(), 
    new SolflareWalletAdapter({network}), 
    new SolletWalletAdapter({network}), 
    new SlopeWalletAdapter({network})
  ], [network]);
  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallet} autoConnect >
          <WalletModalProvider>
            <Router />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
