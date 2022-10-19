import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import HighlightedText from "../../sharedComponent/HighlightedText";
import { Images } from "../../static/images";
import style from "./deezkits.module.scss";
import CountdownTimer from "../../components/deezkits/countdown/CountDownTImer";
import ImageUI from "../../sharedComponent/ImageUI";
import Footer from "../../sharedComponent/footer/footer";
import CommonTitle from "../../sharedComponent/FancyTitle";
import Music from '../../sharedComponent/musicPlayer'

const DeezKits = React.forwardRef((props, ref) => {
  const [isMintState, setMintState] = useState(props?.isMint);
  const MintDate = new Date("10/25/2022 12:00:00");
  const mintHandler = () => {
    console.log("mint");
  };
  return (
    <Box className={style.deez_kits_wrapper}>
      <Box className={style.deezkits_header}>
        <img src={Images?.logo} alt="deezkits-icon" />
      </Box>
      <Box className={style.deez_content_wrapper} >
        <Box className={style.deez_inner_content} >
          <Box className={style.deezkits_content_wrapper}>
            {isMintState ? (
              <Box className={style.deezkits_mint_title}>
                <img src={Images?.MintTitle} alt="deezkits-mint-title" />
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
                    sx={{ width: "50%" }}
                  ></Box>
                </Box>
              </Box>

              <Box className={style.sold_mint_wrapper}>
                <Typography className={style.sold_mint_text}>
                  123 / 4343 SOLD
                </Typography>
              </Box>
              <Box className={style.mint_button}>
                <button onClick={mintHandler}>
                  <ImageUI src={Images?.MintBtn} alt="mint-button" />
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
              <Typography className={`${style.desc_text} ${style.mint_supply}`} sx={{ marginBottom: "16px" }}>
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
      <Footer />
      <Box className={style.toggle_btn}>
        <Button onClick={() => setMintState(!isMintState)}>
          <span>{!isMintState ? "Mint" : "countdown"}</span>
        </Button>
      </Box>
      <Music props={props} ref={ref}/>
    </Box>
  );
});

export default DeezKits;
