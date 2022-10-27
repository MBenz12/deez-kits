import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import HighlightedText from "../../sharedComponent/HighlightedText";
import { Images } from "../../static/images";
import style from "./deezkits.module.scss";
import CountdownTimer from "../../components/deezkits/countdown/CountDownTImer";
// import ImageUI from "../../sharedComponent/ImageUI";
import Footer from "../../sharedComponent/footer/footer";
import CommonTitle from "../../sharedComponent/FancyTitle";
import Music from "../../sharedComponent/musicPlayer";
import audioUrl1 from "../../assets/audio/counting.mp3";
import mintBtnaudio from "../../assets/audio/menu.mp3";
const DeezKits = React.forwardRef((props, ref) => {
  const [isMintState, setMintState] = useState(props?.isMint);
  const totalTicket = 4343;
  const [ticket, setTicket] = useState(0);
  const audioCountRef = useRef(null);
  const audioMintRef = useRef(null);
  const MintDate = new Date("10/25/2022 12:00:00");
  const mintHandler = () => {
    console.log("mint");
  };

  useEffect(() => {
    const increaseTicket = () => {
      if (ticket < 323) {
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

  return (
    <Box className={style.deez_kits_wrapper}>
      <Box className={style.deezkits_header}>
        <img src={Images?.logo} alt="deezkits-icon" />
      </Box>
      <Box className={style.deez_content_wrapper}>
        <Box className={style.deez_inner_content}>
          <Box className={style.deezkits_content_wrapper}>
            {isMintState ? (
              <Box className={style.deezkits_mint_title}>
                {/*            
                <span > can deezkits fit in yr wallet?</span> */}
                <span> &lt;</span>{" "}
                <span className={style.wallet}>
                  <img src={Images?.canGlitch} alt="wallet-glitch" />
                </span>
                <span className={style.wallet}>
                  <img src={Images?.deezGlitch} alt="wallet-glitch" />
                </span>
                <span className={style.wallet}>
                  <img src={Images?.kitGlitch} alt="wallet-glitch" />
                </span>
                <span className={style.wallet}>
                  <img src={Images?.fitGlitch} alt="wallet-glitch" />
                </span>
                <span className={style.wallet}>
                  <img src={Images?.yrGlitch} alt="wallet-glitch" />
                </span>
                <span className={style.wallet}>
                  <img src={Images?.walletGlitch} alt="wallet-glitch" />
                </span>
                <span className={style.gt_entity}>&gt; &#63;</span>
              </Box>
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
              </Box>
              <Box>
                <button onClick={mintHandler} className={style.mint_button}>
                  <span className={`${style.curly_open} ${style.zoom_in_out}`}>
                    &#123;
                  </span>{" "}
                  <span className={style.mint_btn}>MINT</span>{" "}
                  <span className={`${style.curly_close} ${style.zoom_in_out}`}>
                    &#125;
                  </span>
                </button>
              </Box>

              <Typography className={style.desc_text}>
                <HighlightedText className="highlightedText">
                  Price{" "}
                </HighlightedText>{" "}
                - {`${"0.044"}`} SOL
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
                - {`${"4343"}`}
              </Typography>
              <Typography className={`${style.desc_text} ${style.mint_price}`}>
                <HighlightedText className="highlightedText">
                  {" "}
                  Price{" "}
                </HighlightedText>{" "}
                - {`${"0.0799"}`} SOL
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
    </Box>
  );
});

export default DeezKits;




//css

 // one
      // span{
      //   animation: glitch 1s linear infinite;
      // }

      // @keyframes glitch{
      //   2%,64%{
      //     color: hsl(307, 100%,1.5%);
      //     transform: translate(2px,0) skew(-45deg);
      //     color: hsl(125, 100%,1.5%);
      //   }
      //  1%,60%{
      //     transform: translate(-2px,0) skew(12deg);
      //   }
      //   68%{
      //     color: hsl(125, 100%,1.5%);
      //     transform: translate(-4px,0) skew(45deg);
      //     color: hsl(307, 100%,1.5%);
      //   }
      // }

      // span:before,
      // span:after{
      //   content: attr(title);
      //   position: absolute;
      //   left: 0;
      // }

      // span:before{
      //   animation: glitchTop 1s linear infinite;
      //   clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
      //   -webkit-clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
      // }

      // @keyframes glitchTop{
      //   2%,64%{
      //     transform: translate(2px,-2px);
      //   }
      //  1%,60%{
      //     transform: translate(-2px,2px);
      //   }
      //   62%{
      //     transform: translate(13px,-1px) skew(-13deg);
      //   }
      // }

      // span:after{
      //   animation: glitchBotom 1.5s linear infinite;
      //   clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
      //   -webkit-clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
      // }

      // @keyframes glitchBotom{
      //   2%,64%{
      //     transform: translate(-2px,0);
      //   }
      //  1%,60%{
      //     transform: translate(-2px,0);
      //   }
      //   62%{
      //     transform: translate(-22px,5px) skew(21deg);
      //   }
      // }
      //two

      // 300ms: 300ms;

      // // Colors
      // $color-1: #E91E63;
      // $color-2: #03A9F4;
      // $color-3: #2ecc71;
      // $black: #000;

      // Breakpoints
      // $sm: new-breakpoint(min-width 320px);
      // $med: new-breakpoint(min-width 768px);
      // $lg: new-breakpoint(min-width 1024px);

      // span {
      // 	font-size: 30px;
      //   position: relative;
      // 	&:hover {
      // 		&:before, &:after{
      // 			position: absolute;
      // 			content: 'can deezkits fit in yr wallet ?';
      // 			transform: translate(0%,0%);
      // 			z-index: -1;
      // 		}

      // 		&:before {
      // 			top:1%;
      // 			left:1%;
      // 			color: rgba(#7a58ff,0.8);
      // 			animation: distort1 300ms linear infinite;
      // 		}

      // 		&:after {
      // 			top:1%;
      // 			left:1%;
      // 			color: rgba( #ff0,0.8);
      // 			animation: distort2 300ms linear infinite;
      // 		}
      // 	}

      // 	@keyframes distort1 {
      // 		0%    { top:1%; left:1%; }
      // 		12.5% { top:1%; left:1.5%; }
      // 		25%   { top:1%; left:2%; }
      // 		37.5% { top:1.5%; left:2%; }
      // 		5%   { top:2%; left:2%; }
      // 		62.5% { top:2%; left:1.5%; }
      // 		75%   { top:2%; left:1%; }
      // 		87.5% { top:1.5%; left:1%; }
      // 		100%  { top:1%; left:1%; }
      // 	}

      // 	@keyframes distort2 {
      // 		0%    { top:2%; left:2%; }
      // 		12.5% { top:1.5%; left:2%; }
      // 		25%   { top:1%; left:2%; }
      // 		37.5% { top:1%; left:1.5%; }
      // 		5%   { top:1%; left:1%; }
      // 		62.5% { top:1.5%; left:1%; }
      // 		75%   { top:2%; left:1%; }
      // 		87.5% { top:2%; left:1.5%; }
      // 		100%  { top:2%; left:2%; }
      // 	}
      // }

      //three

      //  codepen

      //three

      // .can {
      //   // font-size: 20px;
      //   font-weight: bold;
      //   text-transform: uppercase;
      //   position: relative;
      //   text-shadow: 0.05em 0 0 #ff0, -0.03em -0.04em 0 #00ff00,
      //     0.025em 0.04em 0 #fffc00;
      //   animation: glitch 725ms infinite;
      // }

      // .can span {
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      // }

      // .can span:first-child {
      //   animation: glitch 500ms infinite;
      //   clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
      //   transform: translate(-0.04em, -0.03em);
      //   opacity: 0.75;
      // }

      // .can span:last-child {
      //   animation: glitch 375ms infinite;
      //   clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
      //   transform: translate(0.04em, 0.03em);
      //   opacity: 0.75;
      // }

      // @keyframes glitch {
      //   0% {
      //     text-shadow: 0.05em 0 0 #ff0, -0.03em -0.04em 0 #00ff00,
      //       0.025em 0.04em 0 #fffc00;
      //   }
      //   15% {
      //     text-shadow: 0.05em 0 0 #ff0, -0.03em -0.04em 0 #00ff00,
      //       0.025em 0.04em 0 #fffc00;
      //   }
      //   16% {
      //     text-shadow: -0.05em -0.025em 0 #ff0, 0.025em 0.035em 0 #00ff00,
      //       -0.05em -0.05em 0 #fffc00;
      //   }
      //   49% {
      //     text-shadow: -0.05em -0.025em 0 #ff0, 0.025em 0.035em 0 #00ff00,
      //       -0.05em -0.05em 0 #fffc00;
      //   }
      //   50% {
      //     text-shadow: 0.05em 0.035em 0 #ff0, 0.03em 0 0 #00ff00,
      //       0 -0.04em 0 #fffc00;
      //   }
      //   99% {
      //     text-shadow: 0.05em 0.035em 0 #ff0, 0.03em 0 0 #00ff00,
      //       0 -0.04em 0 #fffc00;
      //   }
      //   100% {
      //     text-shadow: -0.05em 0 0 #ff0, -0.025em -0.04em 0 #00ff00,
      //       -0.04em -0.025em 0 #fffc00;
      //   }
      // }