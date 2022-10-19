import React from "react";
import AudioPath from "../assets/video/hathalo.mp4";
const AudioPlayer = React.forwardRef((props, ref) => {
  return (
    <audio
      preload="none"
      ref={ref}
      controls
      loop
      id="audio"
      style={{ display: "none" }}
    >
      <source src={AudioPath}></source>
      "audio not supported in your browser"
    </audio>
  );
});
export default AudioPlayer;
