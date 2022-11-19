import * as anchor from "@project-serum/anchor";
import { Program, Provider } from "@project-serum/anchor";
import { createAssociatedTokenAccountInstruction, createCloseAccountInstruction, createSyncNativeInstruction, getAssociatedTokenAddress, NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey, RpcResponseAndContext, SignatureResult, SystemProgram, SYSVAR_INSTRUCTIONS_PUBKEY, Transaction, ParsedAccountData } from "@solana/web3.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { adminWallets } from "./constants";

const idl_slots = require("./idl/slots.json");
const programId = new PublicKey(idl_slots.metadata.address);
const slots_pda_seed = "slots_game_pda";
const player_pda_seed = "player_pda";

export const prices = [0.05, 0.1, 0.25, 0.5, 1, 2];

export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getNetworkFromConnection: (connection: Connection) => WalletAdapterNetwork.Devnet | WalletAdapterNetwork.Mainnet = (connection: Connection) =>
{
    // @ts-ignore
    return connection._rpcEndpoint.includes('devnet') ? WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet;
}

export const getWalletPartiallyHidden = (walletAddress: PublicKey) =>
{
    const walletStr = walletAddress!.toString();
    const walletStart = walletStr.slice(0,4);
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

export const convertLog = (data: any, isAdmin: boolean = true) =>
{
    const res: any = {};

    const adminKeys =
    [
        "winPercents",
        "loseCounter",
        "minRoundsBeforeWin",
        "jackpot"
    ]

    Object.keys(data).forEach(key =>
    {
        if (isAdmin || !adminKeys.includes(key))
        {
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

export const findLog = (searchTerm: string, logs: string[]) =>
{
    let instructionLog = logs.find(log => log.includes(searchTerm));
    if (!instructionLog) return '';
    return instructionLog.slice(instructionLog.lastIndexOf(" ") + 1);
}

export const getTransactionLogsWithValidation = async (connection: Connection, txSignature: string) =>
{
    let logs: any = ""
    let retries = 10;
    let isValid = false;
    while (!isValid && retries > 0)
    {
        try
        {
            const txConfirmation = await connection.confirmTransaction(txSignature);
            const parsed = await connection.getParsedTransaction(txSignature, "confirmed");
            logs = parsed?.meta?.logMessages;

            isValid = !txConfirmation?.value?.err && logs; // valid = no error and logs exists

            if (!isValid)
            {
                if (txConfirmation.value.err)
                {
                    // @ts-ignore
                    const errorCode = txConfirmation.value.err.InstructionError[1].Custom;
                    console.error("Tx Error", errorCode, "Retries:", retries);
                }

                if (!logs)
                {
                    console.error("Tx No logs", logs, "Retries:", retries);
                    console.error(parsed?.meta);
                }

                retries--;
                await sleep(1000);

                logs = "";
            }

            console.log("TxValidated", txSignature, "Retries:", retries);
        }
        catch (e)
        {
        }
    }

    return logs;
}

export const postWinLoseToDiscordAPI = async (userWallet: PublicKey, balance: number, bet: number, connection: Connection) =>
{
    const wonEmoji = `<a:deezkits_confetti:1029282324170407936>`;
    const catPartyEmoji = `<a:deezkitsparty2:1029282335549558804>`;

    let message = ``;

    balance = Number(balance.toFixed(3));
    if (balance > 0)
    {
      message += `A cute Kit just **Won** \`${balance}\` SOL ${wonEmoji} with a bet of \`${bet}\``;
    }
    else
    {
      message += `A Kit almost won \`${-balance}\` SOL, better luck next time ${catPartyEmoji}`;
    }

    message += `\n\n> Wallet: \`${getWalletPartiallyHidden(userWallet)}\` \n`;

    await postToDiscordApi(message, "1033022490202620056", getNetworkFromConnection(connection)); // slots
}

export const postWithdrawToDiscordAPI = async (userWallet: PublicKey | null, balance: number, connection: Connection, bankBalance: number, txSignature: string) =>
{
    let message = `\`${userWallet!.toString()}\``;
    message += `\n> Is asking to withdraw \`${balance}\` SOL`;
    message += `\n> Bank Balance \`${bankBalance}\` SOL`;

    const sigLink = `[${txSignature}](https://solscan.io/tx/${txSignature})`;
    message += `\n> Tx Signature: ${sigLink}`;

    await postToDiscordApi(message, `1033411235124883628`, getNetworkFromConnection(connection)); // slots-admin
}

export const postToDiscordApi = async (message: string, channelId: string, network: string) =>
{
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
  ) as Program;

  return { provider, program };
}

export async function getTokenAccountAndOwner(connection: Connection, mint: PublicKey): Promise<{ tokenAccount: PublicKey; tokenAccountOwner: PublicKey }> {
    let tokenAccount: any = "";
    const tokenAccounts = await connection.getTokenLargestAccounts(mint);
    for (let _tokenAccount of tokenAccounts.value)
    {
        if (_tokenAccount?.uiAmount! > 0)
        {
            tokenAccount = _tokenAccount.address;
            break;
        }
    }

    let tokenAccountOwner: PublicKey | undefined = undefined;
    if (tokenAccount)
    {
        const tokenAccountInfo = await connection.getParsedAccountInfo(tokenAccount);
        const ownerAddressString = (tokenAccountInfo?.value?.data as unknown as ParsedAccountData).parsed?.info?.owner;
        if (ownerAddressString) {
            tokenAccountOwner = new PublicKey(ownerAddressString);
        }
    }

    if (!tokenAccountOwner)
    {
        throw new Error("Couldn't find owner of Token Account");
    }

    return { tokenAccount, tokenAccountOwner };
}

export async function getAta(mint: PublicKey, owner: PublicKey, allowOffCurve: boolean = false) {
  return await getAssociatedTokenAddress(      
    mint,
    owner,
    allowOffCurve
  );
}

export async function getCreateAtaInstructionV2(connection: Connection, payer: PublicKey, ata: PublicKey, mint: PublicKey, owner: PublicKey) {
    let account = await connection.getAccountInfo(ata);
    if (!account) {
        return createAssociatedTokenAccountInstruction(
            payer,
            ata,
            owner,
            mint,
        );
    }
}

export async function getCreateAtaInstruction(provider: Provider, ata: PublicKey, mint: PublicKey, owner: PublicKey) {
  let account = await provider.connection.getAccountInfo(ata);
  if (!account) {
    return createAssociatedTokenAccountInstruction(
      provider.wallet.publicKey,
      ata,
      owner,
      mint,
    );
  }
}

async function getAddPlayerTransaction(program: Program, provider: Provider, game_name: string, game_owner: PublicKey)
{
  const [game] = await getGameAddress(game_name, game_owner);
  const [player, bump] = await getPlayerAddress(provider.wallet.publicKey, game);

  console.log("Player:", player.toString(), "Game:", game.toString());
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

export async function playTransaction(program: Program, provider: Provider, wallet: WalletContextState, game_name: string, game_owner: PublicKey, betNo: number, connection: Connection)
{
  const [game] = await getGameAddress(game_name, game_owner);
  const [player] = await getPlayerAddress(provider.wallet.publicKey, game);

  const transaction = new Transaction();
  const playerAccount = await program.provider.connection.getAccountInfo(player);
  if (!playerAccount) {
    transaction.add(await getAddPlayerTransaction(program, provider, game_name, game_owner));
  }

  let gameData = await program.account.game.fetchNullable(game);
  if (!gameData) return;

  //console.log("tokenType", gameData.tokenType);

  const mint = gameData.tokenMint;
  const payerAta = await getAta(mint, provider.wallet.publicKey);
  const gameTreasuryAta = await getAta(mint, game, true);

  const commissionTreasury = gameData.commissionWallet;
  const commissionTreasuryAta = await getAta(mint, commissionTreasury);
  let instruction = await getCreateAtaInstruction(provider, payerAta, mint, provider.wallet.publicKey);
  if (instruction) transaction.add(instruction);
  instruction = await getCreateAtaInstruction(provider, commissionTreasuryAta, mint, commissionTreasury);
  if (instruction) transaction.add(instruction);
  if (mint.toString() === NATIVE_MINT.toString()) {
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: payerAta,
        lamports: prices[betNo] * LAMPORTS_PER_SOL
      }),
      createSyncNativeInstruction(payerAta)
    )
  }
  transaction.add(
    program.transaction.play(betNo, {
      accounts: {
        payer: provider.wallet.publicKey,
        payerAta,
        game,
        gameTreasuryAta,
        commissionTreasuryAta,
        player,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
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
          communityTreasuryAta,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      })
    );
  }

  const txSignature = await wallet.sendTransaction(transaction, provider.connection, { skipPreflight: false });
  await confirmTransactionSafe(provider.connection, txSignature);

  gameData = await program.account.game.fetchNullable(game);
  const playerData = await program.account.player.fetchNullable(player);

  return { gameData, playerData, txSignature };
}

/* Will retry to confirm tx for 10 times, 1 sec sleep between retires */
export async function confirmTransactionSafe(connection: Connection, txSignature: string, retries: number = 10, sleepMS: number = 1000) : Promise<RpcResponseAndContext<SignatureResult>>
{
    const txConfirmation : any = null;
    while (retries > 0)
    {
        try
        {
            console.log(`Confirming ${txSignature}... retries: ${retries}`);
            const txConfirmation = await connection.confirmTransaction(txSignature, "confirmed");

            console.log(`Confirmed https://solscan.io/tx/${txSignature}`);
            return txConfirmation;
        }
        catch (e)
        {
            console.info("Failed confirmation:", e);

            retries--;
            await sleep(sleepMS);
        }
    }

    return txConfirmation;
}

export async function withdrawTransaction(program: Program, provider: Provider, wallet: WalletContextState, game_name: string, game_owner: PublicKey)
{
    const [game] = await getGameAddress(game_name, game_owner);
    const [player] = await getPlayerAddress(provider.wallet.publicKey, game);
    const gameData = await program.account.game.fetchNullable(game);
    const mint = gameData?.tokenMint;
    const transaction = new Transaction();

    const claimerAta = await getAta(mint, provider.wallet.publicKey);
    
    const instruction = await getCreateAtaInstruction(provider, claimerAta, mint, provider.wallet.publicKey);
    if (instruction) transaction.add(instruction);
    

    const gameTreasuryAta = await getAta(mint, game, true);

    transaction.add(
        program.transaction.claim({
            accounts: {
                claimer: provider.wallet.publicKey,
                claimerAta,
                game,
                gameTreasuryAta,
                player,
                instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
        })
    );
    if (mint.toString() === NATIVE_MINT.toString()) {
      transaction.add(
        createCloseAccountInstruction(
          claimerAta,
          provider.wallet.publicKey,
          provider.wallet.publicKey,
        )
      );
    }

    const txSignature = await wallet.sendTransaction(transaction, provider.connection);

    await provider.connection.confirmTransaction(txSignature, "confirmed");
    console.log(txSignature);

    return txSignature;
}

export async function getSPLTokensBalance(connection: Connection, account: PublicKey, filterMint: PublicKey)
{
    let solBalance = 0;
    let splBalance = 0;

    try
    {
        if (account && filterMint)
        {
            solBalance = (await connection.getBalance(account)) / LAMPORTS_PER_SOL;
            const tokenAccountsByOwner = await connection.getParsedTokenAccountsByOwner(account, {mint: filterMint, programId: TOKEN_PROGRAM_ID});
            const amount = tokenAccountsByOwner?.value[0]?.account?.data["parsed"]["info"]["tokenAmount"]["amount"];
            splBalance = Math.ceil(amount / LAMPORTS_PER_SOL);
        }
    }
    catch (e) { }

    return { solBalance, splBalance };
}