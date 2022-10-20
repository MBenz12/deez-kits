import {
  SolanaLogo,
  WithdrawIcon,
} from "./Svgs";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export const CommunityFunds = ({
  balance,
  royalty,
}: {
  balance: number;
  id: number;
  royalty: number;
}) => {
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [mins, setMins] = useState(0);
  const [sec, setSec] = useState(0);
  const [tooltip1, setTooltip1] = useState(false);
  const [tooltip2, setTooltip2] = useState(false);

  const timeout = () => {
    const now = new Date();
    setDay(now.getDate());
    setHour(now.getHours());
    setMins(now.getMinutes() + 1);
    setSec(now.getSeconds());
  };
  useEffect(() => {
    timeout();
    const interval = setInterval(timeout, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="relative cursor-context-menu rounded-md border-[#371761] border-2 min-w-[224px]">
        <div className="top-0 top-[-15px] w-full flex justify-center absolute">
          <p className="text-[22px] leading-[25px] text-[#FFC42C] bg-black w-[200px] text-center">community funds</p>
        </div>
        <div className="p-2 flex flex-col items-center">
          <div 
          onMouseOver={() => setTooltip1(true)}
          onMouseLeave={() => setTooltip1(false)}
           className="h-full flex justify-center items-center text-[36px] leading-[41px]">
            <p className="text-white">
              {balance.toLocaleString("en-us", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              })}{" "}
              <span className="text-[#FFC42C]">SOL</span>
            </p>
          </div>
          <div
            className="w-full flex flex-col items-center z-[10]"
            onMouseOver={() => setTooltip2(true)}
            onMouseLeave={() => setTooltip2(false)}
          >
            <p className="text-[#4AFF2C]/[0.36] text-[16px] leading-[19px]">distribution in</p>
            <div className="flex flex-col gap-1 w-full text-center leading-[100%]">
              <div className="font-bold text-[26px] leading-[30px] text-[#4AFF2C] flex justify-center">
                <p className="w-[30px]">{`${day}`.padStart(2, "0")}</p> :
                <p className="w-[30px]">{`${hour}`.padStart(2, "0")}</p> :
                <p className="w-[30px]">{`${mins}`.padStart(2, "0")}</p> :
                <p className="w-[30px]">{`${sec}`.padStart(2, "0")}</p>
              </div>
              <div className="flex gap-[14px] justify-center text-[#4AFF2C] font-semibold text-[12px]">
                <p className="w-[30px]">days</p>
                <p className="w-[30px]">hours</p>
                <p className="w-[30px]">min</p>
                <p className="w-[30px]">sec</p>
              </div>
            </div>
          </div>          
        </div>
        
        <div
          className={`absolute border-[1px] border-[#C974F4] bg-[#492D5E] w-[320px] left-[50%] top-[60px] translate-x-[-50%] text-[#C974F4] rounded-md duration-300 ${
            !tooltip1 ? "opacity-0 z-[0]" : "z-[108]"
          }`}
        >
          <div className="relative p-2">
            Funds which belong to the community and will be distributed on a
            monthly basis. {royalty}% of each Transaction.
            <div className="absolute w-[10px] h-[10px] rotate-45 left-[50%] translate-x-[-50%] translate-y-[-50%] top-0 bg-[#492D5E] border-[1px] border-[#C974F4] border-r-0 border-b-0"></div>
          </div>
        </div>
        <div
          className={`absolute border-[1px] border-[#C974F4] bg-[#492D5E] w-[320px] left-[50%] top-[110px] translate-x-[-50%] text-[#C974F4] rounded-md duration-300 ${
            !tooltip2 ? "opacity-0" : "z-[108]"
          }`}
        >
          <div className="relative p-2">
            Time left before funds distribution to community
            <div className="absolute w-[10px] h-[10px] rotate-45 left-[50%] translate-x-[-50%] translate-y-[-50%] top-0 bg-[#492D5E] border-[1px] border-[#C974F4] border-r-0 border-b-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Jackpot = ({ jackpot }: { jackpot: number }) => {
  return (
    <div className="flex flex-col items-center my-3 cursor-context-menu">
      <p className="text-[#952CFF] text-[35px]">jackPOTz</p>
      <div className="text-[32px] flex">
        <p className="text-white">
          {jackpot.toLocaleString("en-us", {
            maximumFractionDigits: 4,
            minimumFractionDigits: 0,
          })}
          {" "}
          <span className="text-[#FFC42C]">SOL</span>
        </p>
      </div>
    </div>
  );
};

export const WalletButton = ({ id }: { id: number }) => {
  const wallet = useWallet();
  return (
    <>
      {!wallet.connected && (
        <div
          title="Devnet"
          className="w-[224px] h-[61px] border-[#952CFF] border-2 rounded-md flex items-center justify-center p-0"
        >
          <WalletMultiButton>
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-[#83FF49] text-[27px] leading-[31px]">Connect Wallet</p>
            </div>
          </WalletMultiButton>
        </div>
      )}
      {wallet.connected && (
        <div
          title="Devnet"
          className="w-[224px] h-[61px] border-[#952CFF] border-2 rounded-md flex items-center justify-center p-0"
        >
          <WalletMultiButton>
            <div className="text-[#83FF49] font-['Share Tech Mono'] flex items-center text-[20px]">
              <div className="px-2">
                {wallet.publicKey?.toString().slice(0, 4) +
                  ".." +
                  wallet.publicKey?.toString().slice(-4)}
              </div>
            </div>
          </WalletMultiButton>
        </div>
      )}
    </>
  );
};

export const SolBalance = ({
  balance,
  id,
  lost,
  bet,
}: {
  balance: number;
  id: number;
  lost: boolean;
  bet: number;
}) => {
  const [tooltip, setTooltip] = useState(false);
  return (
    <div className="relative sm:w-[224px] w-[158px] sm:h-[61px] h-[41px] border-[#952CFF] border-2 rounded-md cursor-context-menu">
      <div
        onMouseOver={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className="relative p-2 flex items-center h-full"
      >
        <div className="absolute left-[12px] top-[50%] translate-y-[-50%]">
          <SolanaLogo />
        </div>
        <div className="absolute w-full h-full top-0 left-0 flex justify-evenly items-center">
        <div className="relative p-2 w-full">
          <p className="text-[#83FF49] text-[27px] leading-[31px] w-full text-center">
            {balance.toLocaleString("en-us", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 4,
            })}
            {" "}
            <span className="text-[#FFC42C]">SOL</span>
          </p>
        </div>
      </div>
      </div>
      <div
        className={`absolute border-[1px] border-[#C974F4] bg-[#492D5E] w-[200px] xl:left-0 left-[50%] xl:top-[50%] top-[calc(100%_+_10px)] xl:translate-x-[calc(-100%_-_10px)] translate-x-[-50%] xl:translate-y-[-50%] text-[#C974F4] rounded-md duration-300 ${
          !tooltip ? "opacity-0 z-[0]" : "z-[108]"
        }`}
      >
        <div className="relative p-2">
          <div className="text-center">
            {balance.toLocaleString("en-us", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 4,
            })}{" "}
            SOL
          </div>
          <div className="absolute w-[10px] h-[10px] rotate-45 xl:translate-x-[-50%] translate-x-[50%] left-[50%] xl:left-[100%] translate-y-[-50%] xl:top-[50%] top-0 bg-[#492D5E] border-[1px] border-[#C974F4] xl:border-l-0 border-r-0 border-b-0 xl:border-r-[1px]"></div>
        </div>
      </div>
      <div
        className={`absolute w-[100px] xl:left-0 left-[50%] xl:top-[50%] top-[48px] xl:translate-x-[-100%] translate-x-[-50%] xl:translate-y-[-50%] text-[#47C3D7] duration-1000 flex justify-center ${
          !lost ? "opacity-0" : ""
        }`}
      >
        -
        {bet.toLocaleString("en-us", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 4,
        })}{" "}
        SOL
      </div>
    </div>
  );
};

export const PlayerFunds = ({
  withdrawPlayerMoney,
  playerBalance,
  tokenType,
  prize,
  won,
}: {
  withdrawPlayerMoney: () => void;
  playerBalance: number;
  tokenType: boolean;
  prize: number;
  won: boolean;
}) => {
  const [tooltip, setTooltip] = useState(false);
  return (
    <div
      onClick={withdrawPlayerMoney}
      onMouseOver={() => setTooltip(true)}
      onMouseLeave={() => setTooltip(false)}
      className="h-[61px] relative cursor-pointer rounded-md border-[#952CFF] border-2 w-[224px]"
    >
      <div className="top-0 top-[-15px] w-full flex justify-center absolute">
        <p className="text-[22px] leading-[25px] text-[#952CFF] bg-black w-[200px] text-center">player funds</p>
      </div>
      <div className="absolute w-full h-full top-0 left-0 flex justify-evenly items-center">
        <div className="relative p-2 w-full">
          <p className="text-[#83FF49] text-[27px] leading-[31px] w-full text-center">
            {playerBalance.toLocaleString("en-us", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 4,
            })}
            {" "}
            <span className="text-[#FFC42C]">SOL</span>
          </p>
          <div className="absolute right-[16px] top-[50%] translate-y-[-50%]">
            <WithdrawIcon />
          </div>
        </div>
      </div>
      <div
        className={`absolute w-[100px] left-[50%] top-[52px] translate-x-[-50%] text-[#47C3D7] duration-1000 flex justify-center ${
          !won ? "opacity-0" : ""
        }`}
      >
        +
        {prize.toLocaleString("en-us", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 4,
        })}
        {tokenType ? " $SKT" : " SOL"}
      </div>
      <div
        onMouseOver={() => setTooltip(false)}
        className={`absolute w-[320px] left-[50%] top-[60px] translate-x-[-50%] text-[#C974F4] rounded-md duration-300 ${
          !tooltip ? "opacity-0 z-[0]" : "z-[108]"
        }`}
      >
        <div className="relative p-2 border-[1px] border-[#C974F4] bg-[#492D5E] rounded-md">
          <div>Player's funds available for withdrawal.</div>
          <div>Click to withdraw</div>
          <div className="absolute w-[10px] h-[10px] rotate-45 left-[50%] translate-x-[-50%] translate-y-[-50%] top-0 bg-[#492D5E] border-[1px] border-[#C974F4] border-r-0 border-b-0"></div>
        </div>
      </div>
    </div>
  );
};
