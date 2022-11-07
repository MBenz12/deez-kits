import { useCountdown } from "../../../hooks/useCountdown";
import { Box } from "@mui/material";
import style from "./countdowntimer.module.scss";
import { Typography } from "@mui/material";
import CurlyOpen from "../../../assets/images/deezKits/curly_open.png";
import CurlyClose from "../../../assets/images/deezKits/curly_close.png";

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <>
      <Box className={style.countdown}>
        <Typography className={style.countdown_value}>
          {value >= 0 ? value : "0"}
        </Typography>
        <span className={style.countdown_type}>{type}</span>
      </Box>
      {type !== "Sec" && <div className={style.countdown_dot}>:</div>}
    </>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <Box className={style.timer_wrapper}>
      <Box className={style.curlyBracket}>
        <img src={CurlyOpen} alt="curly-open-icon" />
        <div  className={style.glitch__layers_left}>
		      <div className={style.glitch__layer}></div>
		      <div className={style.glitch__layer}></div>
		      <div className={style.glitch__layer}></div>
	      </div>
      </Box>
      <Box className={style.timer_box}>
          <DateTimeDisplay value={days} type={"Days"} isDanger={days <= 3} />
          <DateTimeDisplay value={hours} type={"Hours"} isDanger={false} />
          <DateTimeDisplay value={minutes} type={"Min"} isDanger={false} />
          <DateTimeDisplay value={seconds} type={"Sec"} isDanger={false} />
      </Box>
      <Box className={style.curlyBracket}>
        <img src={CurlyClose} alt="curly-close-icon" />
        <div  className={style.glitch__layers_right}>
		      <div className={style.glitch__layer}></div>
		      <div className={style.glitch__layer}></div>
		      <div className={style.glitch__layer}></div>
	      </div>
      </Box>
    </Box>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  return (
    <ShowCounter
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
    />
  );
};

export default CountdownTimer;
