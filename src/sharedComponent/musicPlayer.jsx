import React from "react";
import { useState } from "react";
import style from "../assets/css/music.module.scss";
import MusicIcon from "../assets/images/music_icon.svg";

const Music = React.forwardRef(({ props }, ref) => {
  const [isPlaying, setPlaying] = useState(false);

  const pauseMusic = () => {
    ref.current.muted = true;
    setPlaying(false);
    if (props?.isMusicPlayer) {
      ref.current.pause();
    }
  };
  const playMusic = () => {
    ref.current.muted = false;
    setPlaying(true);
    if (props?.isMusicPlayer) {
      ref.current.play();
    }
  };

  return (
    <div className={style.music_player_wrapper}>
      {isPlaying ? (
        <button onClick={() => pauseMusic()} className={style.music_play}>
          <img src={MusicIcon} alt="music-icon" />
        </button>
      ) : (
        <button onClick={() => playMusic()}>
          <img src={MusicIcon} alt="music-icon" />
        </button>
      )}
    </div>
  );
});

export default Music;
