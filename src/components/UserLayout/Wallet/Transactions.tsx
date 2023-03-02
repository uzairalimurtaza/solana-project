import {
	Connection,
	SystemProgram,
	Transaction,
	PublicKey,
	TransactionInstruction
} from "@solana/web3.js";

import {
	TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import {toast} from 'react-toastify'

// const cluster = "https://api.mainnet-beta.solana.com";
const cluster = "https://api.devnet.solana.com";
const connection = new Connection(cluster, "confirmed");

const getProvider = () => {
	if ("solana" in window) {
		const provider: any = window?.solana;
		if (provider.isPhantom) {
			return provider;
		}
	}
	window.open("https://phantom.app/", "_blank");
};

const provider = getProvider();

export async function initWallet() {
	console.log("wallet publicKey", getProvider().publicKey?.toBase58());
	return [connection, provider];
}

export const getTokens = async () => {
	const tokenAccounts = await connection.getTokenAccountsByOwner(
		new PublicKey('vn6uVhxm2J1ShwTe4fJcFVKH4amLGpiTtBcH9EazsGN'),
		{
			programId: TOKEN_PROGRAM_ID,
		}
	);
	console.log(tokenAccounts)
}

export async function sendMoney(
	lamports: number,
	subscribeToVideo: (id:any) => {},
	id: any,
	setLoader : (value:boolean) => {}
) {
	try {
		const toPubkey = new PublicKey("AVZp8GKZVHubtzzj13kKuxxToE2TietpqFftcKUq5tJ2");
		const instruction = SystemProgram.transfer({
			fromPubkey: provider.publicKey,
			toPubkey: toPubkey,
			lamports,
		});
		
		let trans = await setWalletTransaction(instruction);
		let signature = await signAndSendTransaction(trans);
		let result = await connection.confirmTransaction(signature, "singleGossip");
		console.log("money sent", result);
		if (result) {
			subscribeToVideo(id)
		}else {
			setLoader(false)
		}

	} catch (e) {
		setLoader(false)
		console.warn("Failed", e.message);
		toast.error('Could Not Proceed With the Transaction')
	}
}

export const checkNFTToken = async () => {
	console.log(provider.publicKey,'feadf')
	let response = await connection.getParsedTokenAccountsByOwner(provider.publicKey, {
		programId: TOKEN_PROGRAM_ID,
	});
	if(response.value.length > 0) {
		let hasNft = false
		response.value.map(token => {
			console.log(token.account.owner.toString())
			if(token.account.owner.toString() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'){
				console.log('can play nft')
				hasNft = true;
			}
		})
		return hasNft
	} else {
		console.log('cannot play no account nft')
		return false
	}
}

export async function setWalletTransaction(
	instruction: TransactionInstruction
): Promise<Transaction> {
	const transaction = new Transaction();
	transaction.add(instruction);
	transaction.feePayer = provider!.publicKey!;
	let hash = await connection.getRecentBlockhash();
	console.log("blockhash", hash);
	transaction.recentBlockhash = hash.blockhash;
	return transaction;
}

export async function signAndSendTransaction(
	transaction: Transaction
): Promise<string> {
	let signedTrans = await provider.signTransaction(transaction);
	console.log("sign transaction");
	let signature = await connection.sendRawTransaction(signedTrans.serialize());
	console.log("send raw transaction");
	return signature;
}

