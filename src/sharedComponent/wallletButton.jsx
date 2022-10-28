import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import style from '../assets/css/wallet.module.scss'
import {toast}  from 'react-toastify';
const WalletButton = () => {

  const wallet = useWallet();
  useEffect(() => {
    wallet.connected &&
    toast.success("Wallet Connected Successfully.",{position: "bottom-right",
    autoClose: 3000,})
      console.log(wallet?.publicKey?.toString());
  }, [wallet.connected]);

  const handleDisconnect = () => {
    toast.success("Wallet Disconnected Successfully.",{position: "bottom-right",
    autoClose: 3000,})
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
