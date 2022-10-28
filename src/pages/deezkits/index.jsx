import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import HighlightedText from "../../sharedComponent/HighlightedText";
import { Images } from "../../static/images";
import style from "./deezkits.module.scss";
import CountdownTimer from "../../components/deezkits/countdown/CountDownTImer";
import Footer from "../../sharedComponent/footer/footer";
import CommonTitle from "../../sharedComponent/FancyTitle";
import Music from "../../sharedComponent/musicPlayer";
import audioUrl1 from "../../assets/audio/counting.mp3";
import mintBtnaudio from "../../assets/audio/menu.mp3";
import WalletButton from "../../sharedComponent/wallletButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const DeezKits = React.forwardRef((props, ref) => {
  const [isMintState, setMintState] = useState(props?.isMint);
  const totalTicket = 400;
  const [ticket, setTicket] = useState(0);
  const audioCountRef = useRef(null);
  const audioMintRef = useRef(null);
  const MintDate = new Date("10/28/2022 17:00:00");
  const mintHandler = () => {
    console.log("mint");
  };

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
  useEffect(() => {
    console.log("connecting wallet", wallet.connected);
  }, [wallet.connected]);
  return (
    <Box className={style.deez_kits_wrapper}>
      <Box className={style.deezkits_header}>
        <img src={Images?.logo} alt="deezkits-icon" />
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
                    <WalletMultiButton  className={style.wallet_connect}>
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
      {/* <Box className={style.toggle_btn}>
          <Button onClick={() => setMintState(!isMintState)}>
            <span>{!isMintState ? "Mint" : "countdown"}</span>
          </Button>
        </Box> */}
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
