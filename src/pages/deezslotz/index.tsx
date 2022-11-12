/* eslint-disable react-hooks/exhaustive-deps */
import * as anchor from "@project-serum/anchor";
import { Wallet } from "@project-serum/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// @ts-ignore
import kitIcon from "../../assets/images/cat.gif";
// @ts-ignore
import coinFlipIcon from "../../assets/images/coinflip.png";
// @ts-ignore
import discordIcon from "../../assets/images/discord_icon.svg";
// @ts-ignore
import meIcon from "../../assets/images/me_icon.svg";
// @ts-ignore
import twitterIcon from "../../assets/images/twitter_icon.svg";

import { mainnetRPC } from "../../constants";
import { game_name, game_owner } from "./constants";
import Header from "./Header";
import { Information } from "./HeaderItems";
import "./index.scss";
import Slots, { random } from "./Slots";
import { BetButton, LoadingIcon, PlayIcon } from "./Svgs";
import { convertLog, findLog, getGameAddress, getPlayerAddress, getProviderAndProgram, isAdmin, playTransaction, postWinLoseToDiscordAPI, postWithdrawToDiscordAPI, prices, useWindowDimensions, withdrawTransaction, getTransactionLogsWithValidation } from "./utils";

const rpc = mainnetRPC;
const confirmTransactionInitialTimeout = 30000;
const containerId = 114;

const DeezSlotz = React.forwardRef((props, ref) =>
{
  const connection = new Connection(rpc, { commitment: "confirmed", confirmTransactionInitialTimeout: confirmTransactionInitialTimeout});
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet() as anchor.Wallet;

  const [targets, setTargets] = useState([-1, -1, -1, -1, -1]);
  const [roll, setRoll] = useState<any>({});
  const [price, setPrice] = useState(0.05);
  const [betNo, setBetNo] = useState(0);
  const [jackpotAmount, setJackpotAmount] = useState(0);
  const [jackpot, setJackpot] = useState(0);
  const [loading, setLoading] = useState(false);
  const [communityBalance, setCommunityBalance] = useState(0);
  const [royalty, setRoyalty] = useState(0);
  const [solBalance, setSolBalance] = useState(0);
  const [playerBalance, setPlayerBalance] = useState(0);
  const [mainBalance, setMainBalance] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [multiplier, setMultiplier] = useState(0);
  const [tokenType, setTokenType] = useState(false);
  const pageLoaded = useRef<boolean>(false);

  useEffect(() =>
  {
      if (!pageLoaded.current) {
          console.log(connection);
          console.log("Game Name:", game_name);
          console.log("Game Owner:", game_owner.toString());
      }
      pageLoaded.current = true;

  }, []);

  useEffect(() => {
    fetchData();
  }, [wallet.connected]);

  const { width, height } = useWindowDimensions();
  const [run, setRun] = useState(false);
  const [cycle, setCycle] = useState(false);
  const [betHoverd, setBetHovered] = useState(false)

  useEffect(() => {
    const fetchGame = async () => {
      const wallet = new Wallet(anchor.web3.Keypair.generate());
      const { program } = getProviderAndProgram(connection, wallet);
      const [game] = await getGameAddress(game_name, game_owner);
      const gameData = await program.account.game.fetchNullable(game);

      if (gameData)
      {
        setTokenType(gameData.tokenType);
        setCommunityBalance(gameData.communityBalances[0].toNumber() / LAMPORTS_PER_SOL);
        setRoyalty(gameData.royalties[0] / 100);
      }
    };
    fetchGame();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchData()
  {
      if (!wallet.publicKey)
      {
          setCommunityBalance(0);
          setRoyalty(0);
          setSolBalance(0);
          setPlayerBalance(0);
          setTokenType(false);
          setMainBalance(0);
          return;
      }

      const { provider, program } = getProviderAndProgram(connection, anchorWallet);
      const [game] = await getGameAddress(game_name, game_owner);
      const [player] = await getPlayerAddress(provider.wallet.publicKey, game);
      const playerData = await program.account.player.fetchNullable(player);
      const gameData = await program.account.game.fetchNullable(game);


      if (gameData)
      {
          if (isAdmin(provider.wallet.publicKey))
          {
              console.log("Bank Address:", game.toString());
          }

          console.log("Game Data:", convertLog(gameData, isAdmin(provider.wallet.publicKey)));
      }

      if (playerData)
      {
          console.log("Player Data:", convertLog(playerData, isAdmin(provider.wallet.publicKey)));
      }

      if (playerData?.earnedMoney)
      {
          setPlayerBalance(playerData?.earnedMoney.toNumber() / LAMPORTS_PER_SOL);
          console.log("Player Balance:", playerData?.earnedMoney.toNumber() / LAMPORTS_PER_SOL);
      }

      if (gameData)
      {
          console.log("Bank Balance:", gameData?.mainBalance.toNumber() / LAMPORTS_PER_SOL);
          setMainBalance(gameData.mainBalance.toNumber() / LAMPORTS_PER_SOL);
          setTokenType(gameData.tokenType);
          setCommunityBalance(gameData.communityBalances[0].toNumber() / LAMPORTS_PER_SOL);
          setRoyalty(gameData.royalties[0] / 100);
      }

      setSolBalance((await program.provider.connection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL);

      return gameData;
  }

  const finished = async () =>
  {
      if (!wallet.publicKey) return;

      console.log(targets, multiplier);
      const counts = {};
      targets.forEach((target) =>
      {
          // @ts-ignore
          counts[target] = (counts[target] || 0) + 1;
      });

      let maxCount = 0;
      Object.keys(counts).forEach((num) =>
      {
          // @ts-ignore
          if (maxCount < counts[num])
          {
              // @ts-ignore
              maxCount = counts[num];
              // equalNum = parseInt(num);
          }
      });

      if (maxCount >= 3 && multiplier)
      {
          setLoading(false);
          setWon(true);
          // setEqualNum(equalNum);
          toast.dismiss();
          toast.success(
              `You won ${((price * multiplier) / 10).toLocaleString("en-us", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 3,
              })} ${tokenType ? "$SKT" : "SOL"} (x${multiplier / 10} multipler)`,
              {containerId}
          );

          setRun(true);
          setCycle(true);
          setTimeout(() => setCycle(false), 4000);

          await postWinLoseToDiscordAPI(wallet.publicKey, (multiplier * price) / 10, price, connection);
      }
      else
      {
          setLoading(false);
          setWon(false);
          toast.dismiss();
          toast.error(`You almost won! better luck next time.`, {containerId});

          await postWinLoseToDiscordAPI(wallet.publicKey, -price, price, connection);
      }

      setLost(true);
      setTimeout(() =>
      {
          setWon(false);
          setLost(false);
      }, 1000);
      fetchData();
  }
  
  const play = async () =>
  {
      // const toastClassName2 = "bg-black text-white relative flex p-1 min-h-[50px] text-[14px] rounded-md justify-between overflow-hidden cursor-pointer min-w-[400px] xl:top-[150px] xl:right-[-30px]"

      // toast.info("Maintenance break", {containerId});//: {maxWidth: "inherit", minWidth: "inherit", width: "inherit"}});
      // return;

      if (loading) return;

      if (!wallet.connected)
      {
          toast.dismiss();
          toast.error("Please connect wallet to play.", {containerId});
          return;
      }

      if (solBalance < price)
      {
          toast.dismiss();
          toast.error(`Not enough funds to bet.`, {containerId});
          return;
      }

      setLoading(true);
      setWon(false);

      try
      {
          const {provider, program} = getProviderAndProgram(connection, anchorWallet);
          
          const { txSignature } : any = await playTransaction(program, provider, wallet, game_name, game_owner, betNo, connection);
          const logs : any = await getTransactionLogsWithValidation(connection, txSignature);

          if (!logs)
          {
              setLoading(false);
              return;
          }

          const multiplier = findLog("Multiplier:", logs);
          const equalCount = parseInt(findLog("Equal Count:", logs));
          const equalNo = parseInt(findLog("Equal No:", logs));
          const isJackpot = findLog("Is Jackpot:", logs);

          const targets = [];
          setMultiplier(parseInt(multiplier));
          setJackpot(isJackpot === "true" ? jackpotAmount : 0);
          for (let i = 0; i < 5; i++)
          {
              let rd = random();
              while (
                  rd === equalNo ||
                  // eslint-disable-next-line no-loop-func
                  targets.filter((target) => target === rd).length
                  )
              {
                  rd = random();
              }
              targets[i] = rd;
          }

          for (let i = 0; i < equalCount; i++)
          {
              let rd = random() % 5;
              while (targets[rd] === equalNo)
              {
                  rd = random() % 5;
              }
              targets[rd] = equalNo;
          }
          setTargets(targets);
          setRoll({});
      }
      catch (error)
      {
          console.log(error);
          setLoading(false);
      }
  }

  const withdrawPlayerMoney = async () =>
  {
      if (!playerBalance)
      {
          toast.dismiss();
          toast.error("No funds available for withdrawal.", {containerId});
          return;
      }

      if (playerBalance > mainBalance)
      {
          toast.dismiss();
          toast.error("Bank is being filled, please try to withdraw again shortly.", {containerId});
          return;
      }

      const {provider, program} = getProviderAndProgram(connection, anchorWallet);
      const txSignature = await withdrawTransaction(program, provider, wallet, game_name, game_owner);

      toast.dismiss();
      toast.success("Funds sent to your wallet successfully.", {containerId});

      const gameData = await fetchData();
      const bankBalance = gameData!.mainBalance.toNumber() / LAMPORTS_PER_SOL;

      await postWithdrawToDiscordAPI(wallet.publicKey, playerBalance, connection, bankBalance, txSignature);
  }

  return (
    <div className="slots flex flex-col items-center bg-black min-h-[100vh] lg:p-6 sm:p-4 p-2 font-['Share Tech Mono'] relative">
      <Confetti
        width={width}
        height={height}
        recycle={cycle}
        run={run}
        numberOfPieces={1000}
        tweenDuration={6000}
        onConfettiComplete={() => {
          setRun(false);
        }}
      />
      <div className="z-[2]">
        <ToastContainer
          rtl={false}
          containerId={containerId}
          position="top-right"
          autoClose={5000}
          // style={{maxWidth: "inherit", minWidth: "inherit", width: "inherit"}}
          toastClassName={() =>
            "bg-black text-white relative flex p-1 min-h-[50px] text-[14px] rounded-md justify-between overflow-hidden cursor-pointer xl:top-[150px] xl:right-[0px]"
          }
        />
      </div>
      <Header
        communityBalance={communityBalance}
        royalty={royalty}
        solBalance={solBalance}
        playerBalance={playerBalance}
        prize={(price * multiplier) / 10}
        jackpot={jackpotAmount}
        lost={lost}
        bet={price}
        won={won}
        withdrawPlayerMoney={withdrawPlayerMoney}
      />
      <div className="relative z-[1]">
        <div className="absolute left-3 top-[-40px]">
          <Information />
        </div>
        <div className="absolute border-[#4AFF2C] border-2 lg:w-[830px] md:w-[660px] sm:w-[630px] w-[350px] lg:h-[150px] sm:h-[120px] h-[65px] rounded-md lg:left-[-40px] md:left-[-30px] sm:left-[-15px] left-[-13px] lg:top-[150px] sm:top-[120px] top-[65px] flex items-center justify-between lg:p-4 sm:p-2 p-1">
          <div className="cursor-pointer md:hidden block" onClick={play}>
            <PlayIcon fill="#4AFF2C" small />
          </div>
          <div className="cursor-pointer hidden md:block" onClick={play}>
            <PlayIcon fill="#4AFF2C" small={false} />
          </div>
          {loading && (
            <>
              <div className="md:hidden block" style={{ animation: 'slotsspin 2s linear infinite' }}>
                <LoadingIcon fill="#4AFF2C" small id={1} />
              </div>
              <div className="hidden md:block" style={{ animation: 'slotsspin 2s linear infinite' }}>
                <LoadingIcon fill="#4AFF2C" small={false} id={2} />
              </div>
            </>
          )}
        </div>
        {/* {won &&
          targets.map((target, index) =>
            target === equalNum ? <div clasName={`absolute lg:w-[150px] lg:h-[150px] `} /> : ""
          )} */}
        <Slots
          size={width < 640 ? 65 : width < 1024 ? 120 : 150}
          targets={targets}
          roll={roll}
          assets="kits"
          finished={finished}
        />
      </div>
      <div className="my-1 grid md:grid-cols-6 grid-cols-3 md:w-[734px] md:flex justify-between gap-4">
        {prices.map((value, index) => (
          <div
            key={value}
            onClick={() => {
              setPrice(value);
              setBetNo(index);
            }}
            className={`lg:w-[112px] w-[95px] lg:h-[45px] h-[38px] flex items-center justify-center text-[16px] border-2 rounded-md font-bold cursor-pointer ${
              value === price
                ? "text-black bg-[#4AFF2C] border-[#4AFF2C]"
                : "text-[#952CFF] border-[#952CFF]"
            }`}
          >
            {value}
            {tokenType ? " $SKT" : " SOL"}
          </div>
        ))}
      </div>
      <div
        onClick={play}
        className="relative mt-3 mb-10 w-[175px] h-[52px] flex items-center justify-center text-[22px] font-bold text-[#96FFF9] cursor-pointer"
      >
        <div className="absolute l-0 t-0" onMouseOver={() => setBetHovered(true)} onMouseLeave={() => setBetHovered(false)}>
          <BetButton betHoverd={betHoverd}/>
        </div>

        {/* {loading ? (
          <div className="animate-spin">
            <LoadingIcon small={false} id={2} />
          </div>
        ) : (
          ""
        )} */}
      </div>
      <div className="footer absolute bottom-5 flex items-center">
        <a
          href="https://magiceden.io/creators/deezkits"
          target="_blank"
          rel="noreferrer"
          className="me_link"
        >
          <img src={meIcon} alt="magic-eden-icon" />
          magic eden
        </a>
        <a
          href="https://twitter.com/deezkits"
          rel="noreferrer"
          target="_blank"
          className="twitter_link"
        >
          <img src={twitterIcon} alt="twitter-icon" />
          Twitter
        </a>
        <a
          href="https://discord.gg/deezkits"
          target="_blank"
          rel="noreferrer"
          className="discord_link"
        >
          <img src={discordIcon} alt="discord-icon" />
          Discord
        </a>

        <a
            href="https://staking.deezkits.com"
            rel="noreferrer"
            className="staking_link"
        >
          <img src={kitIcon} alt="staking-icon" />
          Staking
        </a>

        <a
            href="https://slotz.deezkits.com"
            rel="noreferrer"
            className="staking_link"
        >
          <span>🎰</span>
          <span>Slotz</span>
        </a>

        <a
            href="https://coinflip.deezkits.com"
            rel="noreferrer"
            className="coinflip_link"
        >
          <img src={coinFlipIcon} alt="coinflip-icon" />
          <span>Coin Flip</span>
        </a>
      </div>
      {/* <div className="absolute bottom-5 flex items-center gap-5 text-[14px]">
        <a
          className="flex items-center gap-1 no-underline"
          href="https://magiceden.io/creators/deezkits"
          target={"_blank"}
          rel="noreferrer"
        >
          <MagicEden /> <p className="text-[#4AFF2C]">MAGIC EDEN</p>
        </a>
        <a
          className="flex items-center gap-1 no-underline"
          href="https://twitter.com/deezkits"
          target={"_blank"}
          rel="noreferrer"
        >
          <Twitter fill="#4AFF2C" /> <p className="text-[#4AFF2C]">TWITTER</p>
        </a>
        <a
          className="flex items-center gap-1 no-underline"
          href="http://discord.gg/deezkits"
          target={"_blank"}
          rel="noreferrer"
        >
          <Discord fill="#4AFF2C" /> <p className="text-[#4AFF2C]">DISCORD</p>
        </a>
      </div> */}
    </div>
  );
});

export default DeezSlotz;
