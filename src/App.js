import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter, SolletWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import Router from "./router/routes";
import {devnetRPC, mainnetRPC} from "./constants";

const network = WalletAdapterNetwork.Mainnet;

function App()
{
  const endpoint = network === WalletAdapterNetwork.Devnet ? devnetRPC : mainnetRPC;
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
        <WalletProvider wallets={wallets} onError={walletConnectionErr} autoConnect={true}>
          <WalletModalProvider>
            <Router />
            {/*Not safe to put here toast container, it wont allow custom toast on each page, removed*/}
            {/*<ToastContainer/>*/}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
