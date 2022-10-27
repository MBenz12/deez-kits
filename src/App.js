import React from "react";
import Router from "./router/routes";
import './app.scss'
import { PhantomWalletAdapter, SolflareWalletAdapter, SolletWalletAdapter, SlopeWalletAdapter,} from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, WalletProvider,} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useMemo } from "react";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = network === WalletAdapterNetwork.Devnet ? "https://api.devnet.solana.com" : "https://flashy-quaint-slug.solana-mainnet.quiknode.pro/3bf50fa9dcb8585bc7050818cab9095ba14ad141/";
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(), 
    new SolflareWalletAdapter({network}), 
    new SolletWalletAdapter({network}), 
    new SlopeWalletAdapter({network})
  ], [network]);

  const walletConnectionErr = (error) => {
    console.log("Wallet Connection Error:", error);
  };

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} onError={walletConnectionErr} autoConnect >
          <WalletModalProvider>
            <Router />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
