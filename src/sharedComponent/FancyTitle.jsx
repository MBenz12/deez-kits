import { Box, Typography } from "@mui/material";
import React from "react";
import style from "../assets/css/title.module.scss";
import HighlightedText from "./HighlightedText";
function CommonTitle({ MintDate }) {
  return (
    <Box className={style.title_wrapper}>
      <Typography className={style.desc_text}>
        <HighlightedText className="BrownText"> &lt; MINT DATE</HighlightedText>{" "}
        <HighlightedText className="highlightedText">
          {" "}
          <span className={style.mint_date}>
            {MintDate.toLocaleString("en-US", {
              day: "numeric",
              month: "long",
            })}
          </span>
        </HighlightedText>
        <HighlightedText className="BrownText"> &gt;</HighlightedText>{" "}
      </Typography>
      <Typography className={style.one}>
        {" "}
        &lt; MINT DATE{" "}
        {MintDate.toLocaleString("en-US", {
          day: "numeric",
          month: "long",
        })}
        &gt;
      </Typography>
      <Typography className={style.two}>
        {" "}
        &lt; MINT DATE{" "}
        {MintDate.toLocaleString("en-US", {
          day: "numeric",
          month: "long",
        })}
        &gt;
      </Typography>
    </Box>
  );
}

export default CommonTitle;
