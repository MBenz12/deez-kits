import React from "react";
import { Box } from "@mui/material";
import style from "../assets/css/socialmedia.module.scss";
import ImageUI from "./ImageUI";
import twitterIcon from "../assets/images/deezKits/twitter.svg";
import discordIcon from "../assets/images/deezKits/discord.svg";
import meIcon from "../assets/images/deezKits/me.svg";

const SocialMediaBar = () => {
  return (
    <Box className={style.social_main}>
      <Box
        sx={{ display: "flex", flexDirection: "column" }}
        className={style.social_wrapper}
      >
        <Box className={`${style.social_inner} ${style.social_link_wrapper}`}>
          <a
            href="https://twitter.com/deezkits"
            target="_blank"
            rel="noreferrer"
            className={style.twitter}
          >
            <ImageUI src={twitterIcon} alt="twitter" />
          </a>
          <a
            href="https://discord.gg/deezkits"
            target="_blank"
            rel="noreferrer"
          >
            <ImageUI src={discordIcon} alt="discord" />
          </a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" target="_self" rel="noreferrer" className={style.me}>
            <ImageUI src={meIcon} alt="magic-eden" />
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default SocialMediaBar;
