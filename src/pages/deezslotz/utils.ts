import * as anchor from "@project-serum/anchor";
import { Program, Provider } from "@project-serum/anchor";
import { ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { adminWallets, splTokenMint } from "./constants";
import { Slots } from "./idl/slots";

const idl_slots = require("./idl/slots.json");
const programId = new PublicKey(idl_slots.metadata.address);
const slots_pda_seed = "slots_game_pda";
const player_pda_seed = "player_pda";

export const getNetworkFromConnection: (connection: Connection) => WalletAdapterNetwork.Devnet | WalletAdapterNetwork.Mainnet = (connection: Connection) => {
  // @ts-ignore
  return connection._rpcEndpoint.includes('devnet') ? WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet;
}

export const getWalletPartiallyHidden = (walletAddress: PublicKey) => {
  const walletStr = walletAddress!.toString();
  const walletStart = walletStr.slice(0, 4);
  const walletEnd = walletStr.slice(-4);
  return `${walletStart}...${walletEnd}`
}

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

export const convertLog = (data: any, isAdmin: boolean = true) => {
  const res: any = {};

  const adminKeys =
    [
      "winPercents",
      "loseCounter",
      "minRoundsBeforeWin",
      "jackpot"
    ]

  Object.keys(data).forEach(key => {
    if (isAdmin || !adminKeys.includes(key)) {
      res[key] = data[key];
      if (typeof data[key] === "object") {
        if (data[key].toString) {// @ts-ignore
          res[key] = data[key].toString();
        }
      }
    }
  });
  return res;
}


export const postWinLoseToDiscordAPI = async (userWallet: PublicKey, balance: number, bet: number, connection: Connection) => {
  const wonEmoji = `<a:deezkits_confetti:1029282324170407936>`;
  const catPartyEmoji = `<a:deezkitsparty2:1029282335549558804>`;

  let message = ``;

  balance = Number(balance.toFixed(3));
  if (balance > 0) {
    message += `A cute Kit just **Won** \`${balance}\` SOL ${wonEmoji} with a bet of \`${bet}\``;
  }
  else {
    message += `A Kit almost won \`${-balance}\` SOL, better luck next time ${catPartyEmoji}`;
  }

  message += `\n\n> Wallet: \`${getWalletPartiallyHidden(userWallet)}\` \n`;

  await postToDiscordApi(message, "1033022490202620056", getNetworkFromConnection(connection)); // slots
}

export const postWithdrawToDiscordAPI = async (userWallet: PublicKey | null, balance: number, connection: Connection, bankBalance: number, txSignature: string) => {
  let message = `\`${userWallet!.toString()}\``;
  message += `\n> Is asking to withdraw \`${balance}\` SOL`;
  message += `\n> Bank Balance \`${bankBalance}\` SOL`;

  const sigLink = `[${txSignature}](https://solscan.io/tx/${txSignature})`;
  message += `\n> Tx Signature: ${sigLink}`;

  await postToDiscordApi(message, `1033411235124883628`, getNetworkFromConnection(connection)); // slots-admin
}

export const postToDiscordApi = async (message: string, channelId: string, network: string) => {
  return await axios.post("https://api.servica.io/extorio/apis/general",
    {
      method: "postDiscordDeez",
      params:
      {
        token: "tok41462952672239",
        channelId: channelId,
        message: message,
        network: network
      },
    });
}


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

export async function getAta(mint: PublicKey, owner: PublicKey, allowOffCurve: boolean = false) {
  return await Token.getAssociatedTokenAddress(
    ASSOCIATED_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    owner,
    allowOffCurve
  );
}

export async function getCreateAtaInstruction(provider: Provider, ata: PublicKey, mint: PublicKey, owner: PublicKey) {
  let account = await provider.connection.getAccountInfo(ata);
  if (!account) {
    return Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      ata,
      owner,
      provider.wallet.publicKey
    );
  }
}

async function getAddPlayerTransaction(program: Program<Slots>, provider: Provider, game_name: string, game_owner: PublicKey) {
  const [game] = await getGameAddress(game_name, game_owner);
  const [player, bump] = await getPlayerAddress(provider.wallet.publicKey, game);

  console.log(player.toString());
  console.log(game.toString());
  return program.transaction.addPlayer(bump,
    {
      accounts: {
        payer: provider.wallet.publicKey,
        player,
        game,
        systemProgram: SystemProgram.programId,
      },
    });
}

export async function playTransaction(program: Program<Slots>, provider: Provider, wallet: WalletContextState, game_name: string, game_owner: PublicKey, betNo: number, connection: Connection) {
  const [game] = await getGameAddress(game_name, game_owner);
  const [player] = await getPlayerAddress(provider.wallet.publicKey, game);

  const transaction = new Transaction();
  const playerAccount = await program.provider.connection.getAccountInfo(player);
  if (!playerAccount) {
    transaction.add(await getAddPlayerTransaction(program, provider, game_name, game_owner));
  }

  let gameData = await program.account.game.fetchNullable(game);
  if (!gameData) return;

  console.log("tokenType", gameData.tokenType);

  const mint = splTokenMint;
  const payerAta = await getAta(mint, provider.wallet.publicKey);
  const gameTreasuryAta = await getAta(mint, game);

  const commissionTreasury = gameData.commissionWallet;
  const commissionTreasuryAta = await getAta(mint, commissionTreasury);

  transaction.add(
    program.transaction.play(betNo, {
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
    const communityTreasuryAta = await getAta(mint, communityWallet);

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

  const txSignature = await wallet.sendTransaction(transaction, provider.connection);

  await provider.connection.confirmTransaction(txSignature, "confirmed");
  console.log(txSignature);

  gameData = await program.account.game.fetchNullable(game);
  const playerData = await program.account.player.fetchNullable(player);

  return { gameData, playerData };
}

export async function withdrawTransaction(program: Program<Slots>, provider: Provider, wallet: WalletContextState, game_name: string, game_owner: PublicKey) {
  const [game] = await getGameAddress(game_name, game_owner);
  const [player] = await getPlayerAddress(provider.wallet.publicKey, game);

  const transaction = new Transaction();

  const claimerAta = await getAta(splTokenMint, provider.wallet.publicKey);
  const instruction = await getCreateAtaInstruction(provider, claimerAta, splTokenMint, provider.wallet.publicKey);
  if (instruction) transaction.add(instruction);

  const gameTreasuryAta = await getAta(splTokenMint, game);

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

  return txSignature;
}