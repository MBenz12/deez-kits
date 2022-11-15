import { PublicKey } from "@solana/web3.js";

export const game_name = "deez_game_8_slotz";//old: "deez_game_6_token";
// export const game_name = "deez_slots_1"; // DEEZ based
export const game_owner = new PublicKey("SERVUJeqsyaJTuVuXAmmko6kTigJmxzTxUMSThpC2LZ");
export const usdcMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
export const deezMint = new PublicKey("DEEZx3JkAuLwt5ir7eodVSFTnxHDRSBoabX9szQMK3RM");
export const splTokenMint = deezMint;
export const adminWallets =
[
  "SERVUJeqsyaJTuVuXAmmko6kTigJmxzTxUMSThpC2LZ",
  "EF5qxGB1AirUH4ENw1niV1ewiNHzH2fWs7naQQYF2dc"
];
export const communityWallet = new PublicKey("B2j1yKcnFYPcTRypbrSxn3SEuWmpHYfPM3KJ8D1wi4rh");