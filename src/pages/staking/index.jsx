import React, { useState, useEffect } from "react";
import "./staking.css";

const Staking = () => {
  const vaultPath = { vaultpath: 'deez-kits' };

  useEffect(() => {
    /*<!-- Import Diamond Vault Integration -->*/
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/Diamond-Vaults/dv-embed@latest/build/bundle.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
      <div id="diamond-vaults" {...vaultPath}></div>
  );
}

export default Staking;
