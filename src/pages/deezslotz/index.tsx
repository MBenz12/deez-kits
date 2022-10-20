/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import {
  useAnchorWallet,
  // useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import Confetti from "react-confetti";
import {
  ButtonImage,
  Discord,
  LoadingIcon,
  MagicEden,
  PlayIcon,
  Twitter,
} from "./Svgs";
import Slots, { random } from "./Slots";
import Header from "./Header";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getGameAddress,
  getPlayerAddress,
  convertLog,
  // postToApi,
  isAdmin,
  getProviderAndProgram,
  playTransaction,
  withdrawTransaction,
  useWindowDimensions,
} from "./utils";

const game_name = "game2";
const game_owner = new PublicKey("3qWq2ehELrVJrTg2JKKERm67cN6vYjm1EyhCEzfQ6jMd");
const cluster = WalletAdapterNetwork.Devnet;
const containerId = 113;

const DeezSlotz = React.forwardRef((props, ref) => {
  // const { connection } = useConnection();
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet() as anchor.Wallet;

  const [targets, setTargets] = useState([-1, -1, -1, -1, -1]);
  const [roll, setRoll] = useState<any>({});
  const prices = [0.05, 0.1, 0.25, 0.5, 1, 2];
  const [price, setPrice] = useState(0.05);
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

  useEffect(() => {
    console.log(connection);
  }, []);

  useEffect(() => {
    fetchData();
  }, [wallet.connected]);

  const { width, height } = useWindowDimensions();
  const [run, setRun] = useState(false);
  const [cycle, setCycle] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchData() {
    if (!wallet.publicKey) {
      setCommunityBalance(0);
      setRoyalty(0);
      setSolBalance(0);
      setPlayerBalance(0);
      setTokenType(false);
      setMainBalance(0);
      return;
    }

    const { provider, program } = getProviderAndProgram(
      connection,
      anchorWallet
    );
    const [game] = await getGameAddress(game_name, game_owner);

    const [player] = await getPlayerAddress(provider.wallet.publicKey, game);

    const playerData = await program.account.player.fetchNullable(player);
    const gameData = await program.account.game.fetchNullable(game);

    if (gameData) {
      console.log(
        "Game Data:",
        convertLog(gameData, isAdmin(provider.wallet.publicKey))
      );
    }
    if (playerData) {
      console.log(
        "Player Data:",
        convertLog(playerData, isAdmin(provider.wallet.publicKey))
      );
    }

    // console.log("Community Wallet: ", gameData?.communityWallet.toString());
    // console.log("Community Balance: ", gameData?.communityBalance.toString());
    if (playerData?.earnedMoney) {
      setPlayerBalance(playerData?.earnedMoney.toNumber() / LAMPORTS_PER_SOL);
      console.log(
        "Player Balance: ",
        playerData?.earnedMoney.toString(),
        "|",
        playerData?.earnedMoney.toNumber() / LAMPORTS_PER_SOL
      );
    }

    if (gameData) {
      console.log(
        "Main Balance: ",
        gameData?.mainBalance.toString(),
        "|",
        gameData?.mainBalance.toNumber() / LAMPORTS_PER_SOL
      );
      setMainBalance(gameData.mainBalance.toNumber() / LAMPORTS_PER_SOL);
      setTokenType(gameData.tokenType);
      setCommunityBalance(
        gameData.communityBalances[0].toNumber() / LAMPORTS_PER_SOL
      );
      setRoyalty(gameData.royalties[0] / 100);
    }

    setSolBalance(
      (await program.provider.connection.getBalance(wallet.publicKey)) /
        LAMPORTS_PER_SOL
    );
  }

  const finished = async () => {
    const counts = {};
    targets.forEach((target) => {
      // @ts-ignore
      counts[target] = (counts[target] || 0) + 1;
    });
    let maxCount = 0;
    // let equalNum = -1;
    Object.keys(counts).forEach((num) => {
      // @ts-ignore
      if (maxCount < counts[num]) {
        // @ts-ignore
        maxCount = counts[num];
        // equalNum = parseInt(num);
      }
    });

    if (maxCount >= 3 && multiplier) {
      setWon(true);
      // setEqualNum(equalNum);
      toast.dismiss();
      toast.success(
        `You won ${((price * multiplier) / 10).toLocaleString("en-us", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })} ${tokenType ? "$SKT" : "SOL"} (x${multiplier / 10} multipler)`,
        { containerId }
      );
      setRun(true);
      setCycle(true);
      setTimeout(() => setCycle(false), 4000);
      // await postToApi();
    } else {
      setLoading(false);
      setWon(false);
      toast.dismiss();
      toast.error(
        `You lost ${price} ${
          tokenType ? "$SKT" : "SOL"
        }, better luck next time.`,
        { containerId }
      );      
    }
    setLost(true);
    setTimeout(() => {
      setWon(false);
      setLost(false);
    }, 1000);
    fetchData();
  };

  const play = async () => {
    if (loading) return;
    if (!wallet.connected) {
      return;
    }
    if (solBalance < price) {
      toast.dismiss();
      toast.error(`Not enough funds to bet.`, { containerId });
      return;
    }
    setLoading(true);
    setWon(false);
    try {
      const { provider, program } = getProviderAndProgram(
        connection,
        anchorWallet
      );
      // @ts-ignore
      const { gameData, playerData } = await playTransaction(
        program,
        provider,
        wallet,
        game_name,
        game_owner,
        price
      );

      let status = playerData?.status;
      // console.log(status);
      if (!status) return;
      // const status = Math.floor(Math.random() * 1000);
      const targets = [];
      let equal_no = status % 10;
      let max = (status % 2) + 1;
      gameData.winPercents.forEach((percent: number, index: number) => {
        if (status < percent) max = index + 3;
      });
      setMultiplier((max - 1) * 10 - (status % 10));
      for (let i = 0; i < 5; i++) {
        let rd = random();
        while (
          rd === equal_no ||
          // eslint-disable-next-line no-loop-func
          targets.filter((target) => target === rd).length
        ) {
          rd = random();
        }
        targets[i] = rd;
      }
      for (let i = 0; i < max; i++) {
        let rd = random() % 5;
        while (targets[rd] === equal_no) {
          rd = random() % 5;
        }
        targets[rd] = equal_no;
      }
      // console.log(status, targets);
      // setLoading(true);
      setTargets(targets);
      setRoll({});
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const withdrawPlayerMoney = async () => {
    if (!playerBalance) {
      toast.dismiss();
      toast.error("No funds available for withdrawal.", { containerId });
      return;
    }
    if (playerBalance > mainBalance) {
      toast.dismiss();
      toast.error(
        "Bank is being filled, please try to withdraw again shortly.",
        { containerId }
      );
      return;
    }
    const { provider, program } = getProviderAndProgram(
      connection,
      anchorWallet
    );
    await withdrawTransaction(program, provider, wallet, game_name, game_owner);

    toast.dismiss();
    toast.success("Funds sent to your wallet successfully.", {
      containerId,
    });
    fetchData();
  };
  return (
    <div className="slots flex flex-col items-center bg-black min-h-[100vh] lg:p-7 sm:p-4 p-2 font-['Share Tech Mono'] relative">
      <Confetti
        width={width}
        height={height}
        recycle={cycle}
        run={run}
        numberOfPieces={1000}
        tweenDuration={6000}
        onConfettiComplete={() => {
          setRun(false);
          setLoading(false);
        }}
      />
      <Header
        communityBalance={communityBalance}
        royalty={royalty}
        solBalance={solBalance}
        playerBalance={playerBalance}
        prize={(price * multiplier) / 10}
        lost={lost}
        bet={price}
        won={won}
        withdrawPlayerMoney={withdrawPlayerMoney}
      />
      <ToastContainer
        rtl={false}
        containerId={containerId}
        position="top-right"
        toastClassName={() =>
          "bg-black text-white relative flex p-1 min-h-[50px] rounded-md justify-between overflow-hidden cursor-pointer min-w-[250px] mt-[210px]"
        }
      />
      <div className="relative">
        <div className="absolute border-[#4AFF2C] border-2 lg:w-[830px] md:w-[660px] sm:w-[630px] w-[350px] lg:h-[150px] sm:h-[120px] h-[65px] rounded-md lg:left-[-40px] md:left-[-30px] sm:left-[-15px] left-[-13px] lg:top-[150px] sm:top-[120px] top-[65px] flex items-center justify-between lg:p-4 sm:p-2 p-1">
          <div className="cursor-pointer md:hidden block" onClick={play}>
            <PlayIcon fill="#4AFF2C" small />
          </div>
          <div className="cursor-pointer hidden md:block" onClick={play}>
            <PlayIcon fill="#4AFF2C" small={false} />
          </div>
          {loading && (
            <>
              <div className="animate-spin md:hidden block">
                <LoadingIcon fill="#4AFF2C" small id={1} />
              </div>
              <div className="animate-spin hidden md:block">
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
      <div className="my-4 grid md:grid-cols-6 grid-cols-3 gap-4">
        {prices.map((value) => (
          <div
            key={value}
            onClick={() => setPrice(value)}
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
        className="relative mt-5 mb-10 w-[175px] h-[52px] flex items-center justify-center text-[22px] font-bold text-[#96FFF9] cursor-pointer"
      >
        <div className="absolute l-0 t-0">
          <ButtonImage />
        </div>

        {loading ? (
          <div className="animate-spin">
            <LoadingIcon small={false} id={2} />
          </div>
        ) : (
          "SPIN"
        )}
      </div>

      <div className="absolute bottom-5 flex items-center gap-5">
        <a
          className="flex items-center gap-1 no-underline"
          href="https://magiceden.io/creators/sol_kitties"
          target={"_blank"}
          rel="noreferrer"
        >
          <MagicEden /> <p className="text-[#4AFF2C]">MAGIC EDEN</p>
        </a>
        <a
          className="flex items-center gap-1 no-underline"
          href="https://twitter.com/SolKitties"
          target={"_blank"}
          rel="noreferrer"
        >
          <Twitter fill="#4AFF2C" /> <p className="text-[#4AFF2C]">TWITTER</p>
        </a>
        <a
          className="flex items-center gap-1 no-underline"
          href="http://discord.gg/solkitties"
          target={"_blank"}
          rel="noreferrer"
        >
          <Discord fill="#4AFF2C" /> <p className="text-[#4AFF2C]">DISCORD</p>
        </a>
      </div>
    </div>
  );
});

export default DeezSlotz;
