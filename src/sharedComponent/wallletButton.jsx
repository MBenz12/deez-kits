import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton, WalletMultiButton
} from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { toast } from 'react-toastify';
import style from '../assets/css/wallet.module.scss';
const WalletButton = () => {

  const wallet = useWallet();
  useEffect(() => {
   if(wallet?.publicKey?.toString()){
    toast.success("Wallet Connected Successfully.",{position: "bottom-right",theme: "dark",
    autoClose: 3000,})
      console.log(wallet?.publicKey?.toString());
   }
  }, [wallet]);

  const handleDisconnect = () => {
    // toast.success("Wallet Disconnected Successfully.",{position: "bottom-right",theme: "dark",
    // autoClose: 3000,})
    console.log("Disconnecting from wallet");
  };

  return (
    <div
      className={style.connect_wallet_wrapper}
    >
      <div>
        <div>
          {wallet.connected ? (
            <div
              className={style.wallet_wrapper}
            >
              <WalletDisconnectButton onClick={handleDisconnect} className={style.diss_connect}>
                <p> disconnect Wallet</p>
              </WalletDisconnectButton>
            </div>
          ) : (
            <WalletMultiButton className={style.wallet_connect}>
              <span className="connect-text">Connect Wallet</span>
            </WalletMultiButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletButton;
