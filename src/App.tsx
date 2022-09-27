import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './components/404';
import Home from './components/Home';
import Layout from './layout';
var version = require('../package.json').version as String;

const transferGasFees = 5*LAMPORTS_PER_SOL/1000000;

function App() {
  const [fromWalletAddress, setFromWalletAddress] = useState<Keypair|undefined>(undefined);
  const [message, setMessage] = useState<String|undefined>(undefined);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  function clearMessage() : void {
    setMessage(undefined);
  }

  async function createWallet() : Promise<void> {
    const fromWallet = Keypair.generate();

    console.log("Airdopping some SOL to newly created wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
      fromWallet.publicKey,
        2 * LAMPORTS_PER_SOL,
    );
  
    const latestBlockHash = await connection.getLatestBlockhash();
  
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirDropSignature,
    });
  
    console.log("Airdrop completed for the newly created account");

    setFromWalletAddress(fromWallet);
  }

  async function getTransferAmount(destinationWallet: PublicKey): Promise<number> {
    try {
      // Make a wallet (keypair) from privateKey and get its balance
      let walletBalance = await connection.getBalance(
          fromWalletAddress!.publicKey,
      );
      let balance = walletBalance / LAMPORTS_PER_SOL;
      console.log(`From wallet balance: ${balance} SOL`);
      const transferAmount = walletBalance - transferGasFees;
  
      walletBalance = await connection.getBalance(
          new PublicKey(destinationWallet),
      );
      balance = walletBalance / LAMPORTS_PER_SOL;
      console.log(`To wallet balance: ${balance} SOL`);
  
      return transferAmount;
    } catch (err) {
      console.log(err);
      return 0;
    }
  };

  async function transferSol(destinationWallet: PublicKey) : Promise<void> {
    const amount = await getTransferAmount(destinationWallet);
    console.log(`Transfering ${amount/LAMPORTS_PER_SOL} SOl`);

    // Send money from "from" wallet and into "to" wallet
    const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromWalletAddress!.publicKey,
          toPubkey: destinationWallet,
          lamports: amount,
        }),
    );

    // Sign transaction
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWalletAddress!],
    );
    console.log("Signature is ", signature);

    await getTransferAmount(destinationWallet);

    setMessage(`<p class='my-1'>Successfully transfered ${amount/LAMPORTS_PER_SOL}SOL.</p>
                <p class='my-1 text-sm'>
                  You can see your transaction <a href="https://solscan.io/tx/${signature}?cluster=devnet" target="_blank" rel="noopener noreferrer">here</a>.
                </p>`)
  }

  return (
    <Routes>
      <Route path="/" element={<Layout message={message} clearMessage={clearMessage} />}>
        <Route index element={<Home version={version} fromWalletAddress={fromWalletAddress} createWallet={createWallet} transferSol={transferSol} />}/>
        <Route path="*" element={<NotFound/>}/>
      </Route>
    </Routes>
  );
}

export default App;
