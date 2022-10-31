import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter, SolletWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import Router from "./router/routes";

function App() {
  const network = WalletAdapterNetwork.Mainnet;
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
        <WalletProvider wallets={wallets} onError={walletConnectionErr} autoConnect={false} >
          <WalletModalProvider>
            <Router />
            <ToastContainer />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
