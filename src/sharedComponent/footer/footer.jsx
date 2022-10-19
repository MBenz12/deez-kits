import React from 'react'
import style from './footer.module.scss'
import meIcon from "../../assets/images/deezKits/me.svg";
import twitterIcon from "../../assets/images/deezKits/twitter.svg";
import discordIcon from "../../assets/images/deezKits/discord.svg";
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
          <img src={twitterIcon} alt="magic-eden-icon" />
          Twitter
        </a>
        <a
          href="https://discord.gg/TaCjV8APDr"
          target="_blank"
          rel="noreferrer"
          className={style.discord_link}
        >
          <img src={discordIcon} alt="magic-eden-icon" />
          Discord
        </a>
      </div>
  )
};

export default footer