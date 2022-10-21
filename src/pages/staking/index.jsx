import React, { useState } from "react";
import "./staking.css";

const Staking = () => {
  const vaultPath = { vaultpath: 'deez-kits' };

  return (
      <div id="diamond-vaults" {...vaultPath}></div>
  );
}

export default Staking;
