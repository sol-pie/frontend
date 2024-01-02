import { Button } from '@mui/material';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import bs58 from 'bs58';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import { decode } from "bs58";

import { useNotify } from './notify';

interface SignTransactionProps {
	queryData: any; 
}

export const SignTransaction: FC<SignTransactionProps> = ({ queryData }) => {
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();
    const notify = useNotify();

    const onClick = useCallback(async () => {
        try {
            if (!publicKey) throw new Error('Wallet not connected!');
            if (!signTransaction) throw new Error('Wallet does not support transaction signing!');

            const encodedData = decode(queryData.tx);
            let tx = Transaction.from(encodedData);
            const { blockhash } = await connection.getLatestBlockhash();
		    tx.recentBlockhash = blockhash;
            console.log("tx", tx)
            
            // let transaction = new Transaction({
            //     feePayer: publicKey,
            //     recentBlockhash: blockhash,
            // }).add(
            //     new TransactionInstruction({
            //         data: Buffer.from('Hello, from the Solana Wallet Adapter example app!'),
            //         keys: [],
            //         programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
            //     })
            // );
            // tx = await signTransaction(tx);
            // if (!tx.signature) throw new Error('Transaction not signed!');
            // const signature = bs58.encode(tx.signature);
            // notify('info', `Transaction signed: ${signature}`);
            // if (!tx.verifySignatures()) throw new Error(`Transaction signature invalid! ${signature}`);
            // notify('success', `Transaction signature valid! ${signature}`);

            		// sendTransaction(tx, connection).then(txSig => {
		// 	console.log(txSig)
		// 	setPostData({sig: txSig, pubkey: publicKey});
		// 	handlePostRequest();
		// }) 
		signTransaction(tx).then(txSig => {
			const data = {sig: txSig.recentBlockhash, pubkey: publicKey.toString()};
			console.log("data", data)
			postTxResults(data);
			// const requireAllSignatures = true;
			// const encodedTx = encode(tx.serialize({ requireAllSignatures }));
			// console.log("encodedTx", encodedTx);
		}) 
        } catch (error: any) {
            notify('error', `Transaction signing failed! ${error?.message}`);
        }
    }, [publicKey, signTransaction, connection, notify, queryData]);

    return (
        <Button variant="contained" color="secondary" onClick={onClick} disabled={!publicKey || !signTransaction}>
            Sign Transaction
        </Button>
    );
};

const postTxResults = async (postData) => {
    try {
      const url = 'http://localhost:8080/sig';
      const body =  JSON.stringify(postData)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      console.log(response)

      if (response.ok) {
        console.info('Ok!', response.statusText);
        // const data = await response.json();
        // setResponse(data);
      } else {
        console.error('Failed to make POST request:', response.statusText);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };