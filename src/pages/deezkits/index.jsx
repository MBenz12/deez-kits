/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Typography } from "@mui/material";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import audioUrl1 from "../../assets/audio/counting.mp3";
import mintBtnaudio from "../../assets/audio/menu.mp3";
import CountdownTimer from "../../components/deezkits/countdown/CountDownTImer";
import CommonTitle from "../../sharedComponent/FancyTitle";
import Footer from "../../sharedComponent/footer/footer";
import HighlightedText from "../../sharedComponent/HighlightedText";
import Music from "../../sharedComponent/musicPlayer";
import WalletButton from "../../sharedComponent/wallletButton";
import { Images } from "../../static/images";
import { awaitTransactionSignatureConfirmation, getCandyMachineState, mintOneToken } from "./candy-machine";
import style from "./deezkits.module.scss";

const CANDY_MACHINE_ID = "BHovi838JNNmat1Bi1bLE4nCXVhFS33bqCKMXHDs2FaK";

const DeezKits = React.forwardRef((props, ref) => {
  const [isMintState, setMintState] = useState(props?.isMint);
  const [mint, setMint] = useState(1);
  const totalTicket = 400;
  const [ticket, setTicket] = useState(0);
  const audioCountRef = useRef(null);
  const audioMintRef = useRef(null);
  const MintDate = new Date("Mon, 31 Oct 2022 17:00:00 GMT");
  

  useEffect(() => {
    const increaseTicket = () => {
      if (ticket < 0) {
        setTicket(ticket + 1);
        if (ticket === 1) {
          audioCountRef.current.play();
        }
      } else {
        audioCountRef.current.pause();
        return true;
      }
    };
    const interval = setInterval(() => {
      increaseTicket();
    }, 1);
    return () => {
      clearInterval(interval);
    };
  }, [ticket]);

  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const [candyMachine, setCandyMachine] = useState();
  useEffect(() => {
    console.log("connecting wallet", wallet.connected);

    refreshCandyMachineState();
    
  }, [wallet.connected]);

  const refreshCandyMachineState = async () => {
    const cndy = await getCandyMachineState(
      anchorWallet,
      new PublicKey(CANDY_MACHINE_ID),
      connection
    );
    setCandyMachine(cndy);
  }

  const AmountHandler = (e) => {
    if(parseInt(e.target.value)<10){
      setMint(parseInt(e.target.value));
    }
  };

  const mintHandler = async () => {
    console.log("mint", mint);
    // const setupMint = await createAccountsForMint(candyMachine, wallet.publicKey);
    console.log(candyMachine);
    const mintResult = await mintOneToken(candyMachine, wallet.publicKey, [], []);
    console.log(mintResult);

    let status = { err: true };
    let metadataStatus = null;
    if (mintResult) {
      status = await awaitTransactionSignatureConfirmation(
        mintResult.mintTxId,
        props.txTimeout,
        props.connection,
        true
      );

      metadataStatus =
        await candyMachine.program.provider.connection.getAccountInfo(
          mintResult.metadataKey,
          "processed"
        );
      console.log("Metadata status: ", !!metadataStatus);
    }

    if (status && !status.err && metadataStatus) {
      // manual update since the refresh might not detect
      // the change immediately
      toast.success("Congratulations! Mint succeeded!");
      refreshCandyMachineState("processed");
    } else if (status && !status.err) {
      toast.error("Mint likely failed! Anti-bot SOL 0.01 fee potentially charged! Check the explorer to confirm the mint failed and if so, make sure you are eligible to mint before trying again.");
      refreshCandyMachineState();
    } else {
      toast.error("Mint failed! Please try again!");
      refreshCandyMachineState();
    }
  };
  return (
    <Box className={style.deez_kits_wrapper}>
      <Box className={style.deezkits_header}>
        <a href=" https://deezkits.com" target="_self">
          <img src={Images?.logo} alt="deezkits-icon" />
        </a>
      </Box>
      <Box className={style.deez_content_wrapper}>
        <Box className={style.deez_inner_content}>
          <Box className={style.deezkits_content_wrapper}>
            {isMintState ? (
              <>
                <Box className={style.deezkits_mint_title}>
                  <span> &lt; </span>
                  <span className={style.can}>CAN</span>{" "}
                  <span className={style.deez}>DEEZ</span>{" "}
                  <span className={style.kits}>KITS</span>{" "}
                  <span className={style.fit}>FIT</span>{" "}
                  <span className={style.yr}>YO</span>{" "}
                  <span className={style.wallet}>
                    <img src={Images?.walletGlitch} alt="wallet-glitch" />
                  </span>
                  <span className={style.gt_entity}>&gt; &#63;</span>
                </Box>
              </>
            ) : (
              <CommonTitle MintDate={MintDate} />
            )}
          </Box>
          <Box className={style.deezkits_content_logo}>
            <img src={Images?.logoTrasnsparent} alt="deezkits-mint-title" />
          </Box>
          {isMintState ? (
            <>
              <Box className={style.progress_wrapper}>
                <Box className={style.progress_bar}>
                  <Box
                    className={style.progress_bar_inner}
                    sx={{
                      width: `${parseInt((100 * ticket) / totalTicket)}%`,
                    }}
                  ></Box>
                </Box>
              </Box>

              <Box className={style.sold_mint_wrapper}>
                <Typography className={style.sold_mint_text}>
                  {ticket} / {totalTicket} SOLD
                </Typography>
                <Typography className={style.mint_text}>
                  400 ALREADY AIRDROPPED TO KIT HOLDERS
                </Typography>
              </Box>
              <Box>
                <button onClick={mintHandler} className={style.mint_button}>
                  <span className={`${style.curly_open} ${style.zoom_in_out}`}>
                    &#123;
                  </span>{" "}
                  {wallet.connected ? (
                    <span className={style.mint_btn}>MINT</span>
                  ) : (
                    <WalletMultiButton className={style.wallet_connect}>
                      <span className="connect-text">Connect</span>
                    </WalletMultiButton>
                  )}
                  <span className={`${style.curly_close} ${style.zoom_in_out}`}>
                    &#125;
                  </span>
                </button>
              </Box>

              <Typography className={style.desc_text}>
                <HighlightedText className="highlightedText">
                  Price{" "}
                </HighlightedText>{" "}
                - {`${"0.25"}`} SOL
              </Typography>

              <Typography className={style.desc_text}>
                <HighlightedText className="highlightedText">
                  Amount{" "}
                </HighlightedText>{" "}
                -
                <span className={style.amount_input}>
                  {" "}
                  <input
                    type="number"
                    defaultValue="1"
                    placeholder="1"
                    min="0"
                    max="10"
                    maxLength="10"
                    onChange={(e) => {
                      AmountHandler(e);
                    }}
                  />{" "}
                </span>
              </Typography>
            </>
          ) : (
            <Box>
              <Typography
                className={`${style.desc_text} ${style.mint_supply}`}
                sx={{ marginBottom: "16px" }}
              >
                <HighlightedText className="highlightedText">
                  {" "}
                  Supply{" "}
                </HighlightedText>{" "}
                - {`${"400"}`}
              </Typography>
              <Typography className={`${style.desc_text} ${style.mint_price}`}>
                <HighlightedText className="highlightedText">
                  {" "}
                  Price{" "}
                </HighlightedText>{" "}
                - {`${"0.25"}`} SOL
              </Typography>

              <Box className={style.deezkits_timer}>
                <CountdownTimer targetDate={MintDate} />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box className={style.deez_kits_kitty}>
        <img src={Images?.DeezKitsKitty} alt="deez-kits-kitty" />
        <div className={style.glitch__layers}>
          <div className={style.glitch__layer}></div>
          <div className={style.glitch__layer}></div>
          <div className={style.glitch__layer}></div>
        </div>
      </Box>

      <Box className={style.deez_Right_kits_kitty}>
        <img src={Images?.DeezKitsRightKitty} alt="deez-kits-right-kitty" />
        <div className={style.glitch_right_layers}>
          <div className={style.glitch_right_layer}></div>
          <div className={style.glitch_right_layer}></div>
          <div className={style.glitch_right_layer}></div>
          <div className={style.glitch_right_layer}></div>
          <div className={style.glitch_right_layer}></div>
        </div>
      </Box>
      <Footer />
      <Box className={style.toggle_btn}>
        <Button onClick={() => setMintState(!isMintState)}>
          <span>{!isMintState ? "Mint" : "countdown"}</span>
        </Button>
      </Box>
      <Music props={props} ref={ref} />
      {/* couting audio */}
      <audio loop ref={audioCountRef} controls className="d-none">
        <source loop src={audioUrl1}></source>
      </audio>
      {/* mint audio */}
      <audio loop ref={audioMintRef} controls className="d-none">
        <source loop src={mintBtnaudio}></source>
      </audio>
      {/* wallet  */}
      <WalletButton />
    </Box>
  );
});

export default DeezKits;
