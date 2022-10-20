import { Program, Provider } from "@project-serum/anchor";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { Slots } from "./idl/slots";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { WalletContextState } from "@solana/wallet-adapter-react";

const idl_slots = require("./idl/slots.json");
const programId = new PublicKey(idl_slots.metadata.address);
const slots_pda_seed = "slots_game_pda";
const player_pda_seed = "player_pda";
const sktMint = new PublicKey("SKTsW8KvzopQPdamXsPhvkPfwzTenegv3c3PEX4DT1o");

export const getGameAddress = async (game_name: string, game_owner: PublicKey) => (
  await PublicKey.findProgramAddress(
    [
      Buffer.from(game_name),
      Buffer.from(slots_pda_seed),
      game_owner.toBuffer(),
    ],
    programId
  )
);

export const getPlayerAddress = async (playerKey: PublicKey, game: PublicKey) => (
  await PublicKey.findProgramAddress(
    [
      Buffer.from(player_pda_seed),
      playerKey.toBuffer(),
      game.toBuffer(),
    ],
    programId
  )
)

export const convertLog = (data: { [x: string]: { toString: () => any; }; }, isAdmin: boolean = true) => {
  const res: { [x: string]: any } = {};
  Object.keys(data).forEach(key => {
    if (isAdmin || key !== "winPercents") {
      res[key] = data[key];
      if (typeof data[key] === "object") {
        res[key] = data[key].toString();
      }
    }
  });
  return res;
}

export const postToApi = async (user: PublicKey, balance: number) => {
  return await axios.post("https://api.servica.io/extorio/apis/general", {
    method: "postDiscord",
    params: {
      token: "xxxx",
      channelId: 1031495600937644066,
      message: `User ${user.toString()} ${balance > 0 ? `Won ${balance} sol` : `Lost ${-balance} sol, better luck next time`}`,
    },
  });
}

const adminWallets = [
  "SERVUJeqsyaJTuVuXAmmko6kTigJmxzTxUMSThpC2LZ",
  "EF5qxGB1AirUH4ENw1niV1ewiNHzH2fWs7naQQYF2dc",
  "3qWq2ehELrVJrTg2JKKERm67cN6vYjm1EyhCEzfQ6jMd",
];

export const isAdmin = (pubkey: PublicKey) => {
  return adminWallets.includes(pubkey.toString())
}


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

const programID = idl_slots.metadata.address;

export function getProviderAndProgram(connection: Connection, anchorWallet: anchor.Wallet) {
  const provider = new Provider(
    connection,
    anchorWallet,
    Provider.defaultOptions()
  );

  const program = new Program(
    idl_slots,
    programID,
    provider
  ) as Program<Slots>;

  return { provider, program };
}

async function getAddPlayerTransaction(program: Program<Slots>, provider: Provider, game_name: string, game_owner: PublicKey) {
  const [game] = await getGameAddress(game_name, game_owner);

  const [player, bump] = await getPlayerAddress(
    provider.wallet.publicKey,
    game
  );

  console.log(player.toString());
  console.log(game.toString());
  return program.transaction.addPlayer(bump, {
    accounts: {
      payer: provider.wallet.publicKey,
      player,
      game,
      systemProgram: SystemProgram.programId,
    },
  });
}

export async function playTransaction(program: Program<Slots>, provider: Provider, wallet: WalletContextState, game_name: string, game_owner: PublicKey, price: number) {
  const [game] = await getGameAddress(game_name, game_owner);
  const [player] = await getPlayerAddress(provider.wallet.publicKey, game);

  const transaction = new Transaction();
  const playerAccount = await program.provider.connection.getAccountInfo(
    player
  );
  if (!playerAccount) {
    transaction.add(await getAddPlayerTransaction(program, provider, game_name, game_owner));
  }

  const gameData = await program.account.game.fetchNullable(game);
  if (!gameData) return;

  const payerAta = await Token.getAssociatedTokenAddress(
    ASSOCIATED_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    sktMint,
    provider.wallet.publicKey,
    false
  );
  const ta = await program.provider.connection.getAccountInfo(payerAta);
  if (!ta) {
    transaction.add(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        sktMint,
        payerAta,
        provider.wallet.publicKey,
        provider.wallet.publicKey
      )
    );
  }
  const gameTreasuryAta = await Token.getAssociatedTokenAddress(
    ASSOCIATED_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    sktMint,
    game,
    true
  );
  const commissionTreasury = gameData.commissionWallet;
  const commissionTreasuryAta = await Token.getAssociatedTokenAddress(
    ASSOCIATED_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    sktMint,
    commissionTreasury,
    false
  );
  transaction.add(
    program.transaction.play(new anchor.BN(LAMPORTS_PER_SOL * price), {
      accounts: {
        payer: provider.wallet.publicKey,
        payerAta,
        player,
        game,
        gameTreasuryAta,
        commissionTreasury,
        commissionTreasuryAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
    })
  );
  for (const communityWallet of gameData.communityWallets) {
    const communityTreasuryAta = await Token.getAssociatedTokenAddress(
      ASSOCIATED_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      sktMint,
      communityWallet,
      false
    );
    transaction.add(
      program.transaction.sendToCommunityWallet({
        accounts: {
          game,
          gameTreasuryAta,
          communityWallet,
          communityTreasuryAta,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        },
      })
    );
  }
  const txSignature = await wallet.sendTransaction(
    transaction,
    provider.connection
  );
  await provider.connection.confirmTransaction(txSignature, "confirmed");
  console.log(txSignature);
  const playerData = await program.account.player.fetchNullable(player);
  return { gameData, playerData };
}

export async function withdrawTransaction(program: Program<Slots>, provider: Provider, wallet: WalletContextState, game_name: string, game_owner: PublicKey) {
  const [game] = await getGameAddress(game_name, game_owner);
  const [player] = await getPlayerAddress(provider.wallet.publicKey, game);

  const transaction = new Transaction();

  const claimerAta = await Token.getAssociatedTokenAddress(
    ASSOCIATED_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    sktMint,
    provider.wallet.publicKey
  );
  let account = await provider.connection.getAccountInfo(claimerAta);
  if (!account) {
    transaction.add(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        sktMint,
        claimerAta,
        provider.wallet.publicKey,
        provider.wallet.publicKey
      )
    );
  }

  const gameTreasuryAta = await Token.getAssociatedTokenAddress(
    ASSOCIATED_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    sktMint,
    game,
    true
  );
  // console.log(claimerAta.toString());
  // console.log(game.toString());
  // console.log(gameTreasuryAta.toString());
  // console.log(player.toString());
  transaction.add(
    program.transaction.claim({
      accounts: {
        claimer: provider.wallet.publicKey,
        claimerAta,
        game,
        gameTreasuryAta,
        player,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
    })
  );
  const txSignature = await wallet.sendTransaction(
    transaction,
    provider.connection
  );
  await provider.connection.confirmTransaction(txSignature, "confirmed");
  console.log(txSignature);
}