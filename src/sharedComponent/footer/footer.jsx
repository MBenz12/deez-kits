import React from 'react'
import style from './footer.module.scss'
import meIcon from "../../assets/images/deezKits/me.svg";
import twitterIcon from "../../assets/images/deezKits/twitter.svg";
import discordIcon from "../../assets/images/deezKits/discord.svg";
import HomeIcon from '../../assets/images/deezKits/home_kitz.svg'
import kitIcon from "../../assets/images/cat.gif";
import coinFlipIcon from "../../assets/images/coinflip.png";
const footer = () => {

  return (
    <div className={style.navbar_main}>
        <a
          href="https://discord.gg/TaCjV8APDr"
          target="_blank"
          rel="noreferrer"
          className={style.me_link}
        >
          <img src={meIcon} alt="magic-eden-icon" />
          magic eden
        </a>
        <a
          href="https://twitter.com/deezkits"
          rel="noreferrer"
          target="_blank"
          className={style.twitter_link}
        >
          <img src={twitterIcon} alt="twitter-icon" />
          Twitter
        </a>
        <a
          href="https://discord.gg/TaCjV8APDr"
          target="_blank"
          rel="noreferrer"
          className={style.discord_link}
        >
          <img src={discordIcon} alt="discord-icon" />
          Discord
        </a>
        <a
            href="https://staking.deezkits.com"
            rel="noreferrer"
            className={style.staking_link}
        >
          <img src={kitIcon} alt="staking-icon" />
          Staking
        </a>

        <a
            href="https://slotz.deezkits.com"
            rel="noreferrer"
            className={style.staking_link}
        >
          <span>🎰</span>
          <span>Slotz</span>
        </a>

        <a
            href="https://coinflip.deezkits.com"
            rel="noreferrer"
            className={style.coinflip_link}
        >
          <img src={coinFlipIcon} alt="coinflip-icon" />
          <span>Coin Flip</span>
        </a>
        <a
            href="https://www.deezkits.com/"
            rel="noreferrer"
            className={style.coinflip_link}
        >
          <img src={HomeIcon} alt="coinflip-icon" />
          <span>Home</span>
        </a>
      </div>

  )
};

export default footer