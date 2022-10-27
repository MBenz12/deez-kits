import React, { useRef, useState } from "react";
import style from "./maintenance.module.scss";
import meIcon from "../../assets/images/me_icon.svg";
import twitterIcon from "../../assets/images/twitter_icon.svg";
import discordIcon from "../../assets/images/discord_icon.svg";
import kitIcon from "../../assets/images/cat.gif";
import coinFlipIcon from "../../assets/images/coinflip.png";
import deezkits from "../../assets/video/hathalo.mp4";
import Music from "../../sharedComponent/musicPlayer";
// import cat from '../assets/images/cat.gif'

const Maintenance = () => {
  const videoRef = useRef();
  const [skipFlag, setSkipFlag] = useState(true);

  const handleSkipToTimeStamp = () => {
    if (skipFlag) {
      //skip video 4 sec
      document.getElementById("video").currentTime = 4;
    }
    setSkipFlag(false);
    return true;
  };

  const handleEnded = () => {
    // rest flag
    setSkipFlag(true);
    videoRef.current.play();
  };

  const onLoad = (video) => {
    video.target.volume = 0.25;
    console.log("Volume", video.target.volume);
  };

  return (
    <div className={style.maintenance_wrapper}>
      <div className={style.media_main}>
        <video
          id="video"
          // loop
          ref={videoRef}
          autoPlay
          allow="autoplay"
          muted
          // controls
          onMouseOver={handleSkipToTimeStamp}
          onEnded={handleEnded}
          onLoadStart={onLoad}
        >
          <source src={deezkits}></source>
          Your browser does not support video!
        </video>
        {/* <img src={cat} alt="cat-gif"/> */}
      </div>
      <div className={style.navbar_main}>
        <a
          href="https://magiceden.io/marketplace/deez_kits"
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
          href="https://discord.gg/deezkits"
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
            className={style.staking_link}
        >
          <img src={coinFlipIcon} alt="coinflip-icon" />
          Coin Flip
        </a>
      </div>
      {/* music toggle button */}
      <Music ref={videoRef} />
    </div>
  );
};

export default Maintenance;
