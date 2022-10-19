import React from "react";

const HighlightedText = (props) => {
  return <span className={props.className}>{props.children}</span>;
};

export default HighlightedText;
