import React, { useEffect, useRef, useState } from 'react';
import { useWalletModal, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Logo from 'assets/images/deezKits/Logo_transparent.png';
import smokeLeft from 'assets/images/deezKits/smoke_left.png';
import smokeRight from 'assets/images/deezKits/smoke_right.png';
import Mutate from 'assets/images/deezKits/mutate.png';
import MutateAnimation from 'assets/images/deezKits/mutate-animation.png';
import Mutation1 from 'assets/images/deezKits/mutation-1.png';
import Mutation2 from 'assets/images/deezKits/mutation-2.png';
import Mutation3 from 'assets/images/deezKits/mutation-3.png';
import Mutation4 from 'assets/images/deezKits/mutation-4.png';
import Mutation5 from 'assets/images/deezKits/mutation-5.png';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as EqualsIcon } from 'assets/icons/equals.svg';
import { ReactComponent as MEIcon } from 'assets/images/me_icon.svg';
import { ReactComponent as TwitterIcon } from 'assets/images/twitter_icon.svg';
import { ReactComponent as DiscordIcon } from 'assets/images/discord_icon.svg';
import KitIcon from 'assets/images/cat.gif';
import CoinFlipIcon from 'assets/images/coinflip.png';
import HomeIcon from 'assets/images/home.png';
import './glitch.css';
import {Connection, LAMPORTS_PER_SOL, PublicKey, Transaction} from '@solana/web3.js';
import {Metaplex, walletAdapterIdentity} from '@metaplex-foundation/js';
import {useConnection, useWallet} from '@solana/wallet-adapter-react';
import { Modal } from '@mui/material';
import ToxicShower from 'assets/video/toxic_shower.mp4';
import {mainnetRPC, kit, sardine, mouse, deezSPLToken, mutationWallet, mutationCM, devnetRPC} from '../../constants';
import { getAta, getCreateAtaInstructionV2, getSPLTokensBalance, getTokenAccountAndOwner } from "../deezslotz/utils";
import {toast, ToastContainer} from "react-toastify";
import {createTransferCheckedInstruction} from "@solana/spl-token";
import {getCandyMachineState, getCollectionPDA, mintTokens} from "../deezkits/candy-machine";
import {wlList, wlList2} from "../deezkits/constants";
const CandyMachineAccount = require("../deezkits/candy-machine");

const Mutation = () => {
	const connection = new Connection(devnetRPC, 'confirmed');
	// const { connection } = useConnection();
	const wallet = useWallet();
	const walletModal = useWalletModal();

	const [open, setOpen] = useState(false);
	const [NFTdata, setNFTdata] = useState([]);
	const [mutateNFTs, setMutateNFTs] = useState([{}, {}, {}]);
	const [mutateItem, setMutateItem] = useState(Mutate);
	const [type, setType] = useState(0);
	const videoRef = useRef();
	const [candyMachine, setCandyMachine] = useState();
	const [itemsRemaining, setItemsRemaining] = useState(0);
	const [isActive, setIsActive] = useState(false);
	const [itemsRedeemed, setItemsRedeemed] = useState(0);
	const [itemsAvailable, setItemsAvailable] = useState(800);
	const [itemPrice, setItemPrice] = useState(0.44);
	const [isWLUser, setIsWLUser] = useState(false);
	const CANDY_MACHINE_ID = mutationCM;
	const metaplex = new Metaplex(connection);
	const [NFTs, setNFTs] = useState();

	const isWalletConnected = () => {
		return !!wallet.publicKey;
	};

	const getNFTs = async () => {
		metaplex.use(walletAdapterIdentity(wallet));
		const owner = wallet.publicKey;
		console.log('Connection:', connection);
		console.log('User Wallet:', owner.toString());
		const nfts = await metaplex.nfts().findAllByOwner({ owner: metaplex.identity().publicKey });

		const promises = nfts.map(async (item) => {
			const nftLoaded = await metaplex.nfts().load({ metadata: item });
			return nftLoaded;
			//if (nftLoaded.json !== null) return nftLoaded.json;
		});

		setNFTs(await Promise.all(promises));
	};

	const refreshCandyMachineState = async () =>
	{
		if (!isWalletConnected()) return;

		try
		{
			const cndy = await getCandyMachineState(wallet, new PublicKey(CANDY_MACHINE_ID), connection);
			let active = cndy?.state.goLiveDate ? cndy?.state.goLiveDate.toNumber() < new Date().getTime() / 1000 : false;
			let presale = false;
			let isWLUser = wlList.includes(wallet.publicKey.toString());
			let userPrice = cndy.state.price;
			//userPrice = isWLUser ? userPrice : cndy.state.price;

			// amount to stop the mint?
			if (cndy?.state.endSettings?.endSettingType.amount)
			{
				const limit = Math.min(cndy.state.endSettings.number.toNumber(), cndy.state.itemsAvailable);
				if (cndy.state.itemsRedeemed < limit)
				{
					setItemsRemaining(limit - cndy.state.itemsRedeemed);
				}
				else
				{
					setItemsRemaining(0);
					cndy.state.isSoldOut = true;
				}
			}
			else
			{
				setItemsRemaining(cndy.state.itemsRemaining);
			}

			if (cndy.state.isSoldOut)
			{
				active = false;
			}

			const [collectionPDA] = await getCollectionPDA(new PublicKey(CANDY_MACHINE_ID));
			const collectionPDAAccount = await connection.getAccountInfo(collectionPDA);

			setIsWLUser(isWLUser);
			setIsActive((cndy.state.isActive = active));
			setCandyMachine(cndy);
			setItemsRedeemed(cndy.state.itemsRedeemed);
			setItemsAvailable(cndy.state.itemsAvailable);
			setItemPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);

			console.log(`${CANDY_MACHINE_ID} Candy State: itemsAvailable ${cndy.state.itemsAvailable} itemsRemaining ${cndy.state.itemsRemaining} itemsRedeemed ${cndy.state.itemsRedeemed} isSoldOut ${cndy.state.isSoldOut} isWL ${isWLUser} (${wlList2.length}) isActive ${isActive}`);
		}
		catch (e)
		{
			toast.error("CandyMachine Error " + e, {theme: "dark", style: {blockSize: "max-content", backgroundSize: "300px", maxWidth: "max-content" }, bodyStyle: {blockSize: "max-content", backgroundSize: "300px", maxWidth: "max-content"}});
			console.error("CandyMachine Error:", e);
		}
	}

	useEffect(() =>
	{
		if (!isWalletConnected()) return;
		getNFTs();
		refreshCandyMachineState();
	}, [wallet.publicKey]); //eslint-disable-line

	const handleMutate = async (index) => {
		//console.log(NFTs);
		if (isWalletConnected()) {
			let temp = [];
			if (index === 0) {
				temp = await NFTs?.filter((item) => item?.creators[0].address.toString() === kit.creator);
				setType(0);
			} else if (index === 1) {
				temp = await NFTs?.filter((item) => item?.creators[0].address.toString() === sardine.creator);
				setType(1);
			} else if (index === 2) {
				temp = await NFTs?.filter((item) => item?.creators[0].address.toString() === mouse.creator);
				setType(2);
			}

			await temp?.sort((a, b) => {
				return a?.name.localeCompare(b?.name);
			});

			setNFTdata(temp);
			setOpen(true);
		} else {
			walletModal.setVisible(true);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSelect = (nft) => {
		if (isWalletConnected())
		{
			if (type === 1) setMutateNFTs((prev) => [prev[0], nft, prev[2]]);
			if (type === 2) setMutateNFTs((prev) => [prev[0], prev[1], nft]);
			if (type === 0) setMutateNFTs((prev) => [nft, prev[1], prev[2]]);
			handleClose();
		}
	};

	const mutationSOLCost = 1;
	const mutationDEEZCost = 100;
	const handleMutateNFTs = async () =>
	{
		if (!isWalletConnected())
		{
			toast.warn("Please connect your wallet.", {containerId: 114});
			walletModal.setVisible(true);
		}

		const destWallet = new PublicKey(mutationWallet);

		const kit = {nft: mutateNFTs[0], name: mutateNFTs[0]?.json?.name, mint: mutateNFTs[0]?.mint?.address };
		const sardine = {nft: mutateNFTs[1], name: mutateNFTs[1]?.json?.name, mint: mutateNFTs[1]?.mint?.address };
		const mouse = {nft: mutateNFTs[2], name: mutateNFTs[2]?.json?.name, mint: mutateNFTs[2]?.mint?.address };

		console.log(` Kit: {name: ${kit.name} mint: ${kit.mint?.toString()}} \n Sardine: {name: ${sardine.name} mint: ${sardine.mint?.toString()}} \n Mouse: {name: ${mouse.name} mint: ${mouse.mint?.toString()}}`);

		const { solBalance: solBalance, splBalance: deezSplBalance } = await getSPLTokensBalance(connection, wallet.publicKey, new PublicKey(deezSPLToken));
		const { solBalance: solBalance1, splBalance: kitSplBalance } = await getSPLTokensBalance(connection, wallet.publicKey, kit.mint);
		const { solBalance: solBalance2, splBalance: sardineSplBalance } = await getSPLTokensBalance(connection, wallet.publicKey, sardine.mint);
		const { solBalance: solBalance3, splBalance: mouseSplBalance } = await getSPLTokensBalance(connection, wallet.publicKey, mouse.mint);
		console.log(`--> $SOL: ${solBalance} $DEEZ: ${deezSplBalance}`);
		console.log(`---> KIT: ${kitSplBalance}`);
		console.log(`---> Sardine: ${sardineSplBalance}`);
		console.log(`---> Mice: ${mouseSplBalance}`);

		//1# - Validations
		{
			// 1.1# - Validations of balance (sol and deez)
			const isEnoughBalance = solBalance >= mutationSOLCost && deezSplBalance >= mutationDEEZCost;
			if (!isEnoughBalance) {
				toast.error("Not enough balance for mutation.");
				console.error("Not enough balance for mutation.");
				return;
			}

			// 1.2# - Validations of balance (kit, sardine, mice)
			const isEnoughNFTsBalance = kitSplBalance >= 1 && sardineSplBalance >= 1 && mouseSplBalance >= 1;
			if (!isEnoughNFTsBalance) {
				toast.error(`Not enough balance for mutation, Kit: ${kitSplBalance} Sardine: ${sardineSplBalance} Mice: ${mouseSplBalance}.`);
				console.error(`Not enough balance for mutation, Kit: ${kitSplBalance} Sardine: ${sardineSplBalance} Mice: ${mouseSplBalance}.`);
				return;
			}
		}

		// Validation passed, show toast
		toast.success(`Mutation in progress...`, {theme: "dark", autoClose: 20000, bodyStyle: { width: "500px"}});

		// 2# - Create TX: with instructions to send above to mutationWallet
		const transaction = new Transaction();

		if (kit?.mint)
		{
			const { tokenAccount: kitTokenAccount, tokenAccountOwner } = await getTokenAccountAndOwner(connection, kit.mint);
			console.log("-> Kit Token Account:", kitTokenAccount.toString(), "Owner:", tokenAccountOwner.toString());

			const destKitATA = await getAta(kit.mint, destWallet);
			const instruction = await getCreateAtaInstructionV2(connection, wallet.publicKey, destKitATA, kit.mint, destWallet);
			if (instruction) transaction.add(instruction);

			transaction.add(createTransferCheckedInstruction(
				kitTokenAccount, // from (should be a token account)
				kit.mint, // mint
				destKitATA, // to (should be a token account)
				tokenAccountOwner, // owner of source ata
				1, // amount
				0 // decimals (0 - nft, 9 - token)
			));
		}

		if (sardine?.mint)
		{
			const { tokenAccount: sardineTokenAccount, tokenAccountOwner } = await getTokenAccountAndOwner(connection, sardine.mint);
			console.log("-> Sardine Token Account:", sardineTokenAccount.toString(), "Owner:", tokenAccountOwner.toString());

			const destKitATA = await getAta(sardine.mint, destWallet);
			const instruction = await getCreateAtaInstructionV2(connection, wallet.publicKey, destKitATA, sardine.mint, destWallet);
			if (instruction) transaction.add(instruction);

			transaction.add(createTransferCheckedInstruction(
				sardineTokenAccount, // from (should be a token account)
				sardine.mint, // mint
				destKitATA, // to (should be a token account)
				tokenAccountOwner, // owner of source ata
				1, // amount
				0 // decimals (0 - nft, 9 - token)
			));
		}

		if (mouse?.mint)
		{
			const { tokenAccount: mouseTokenAccount, tokenAccountOwner } = await getTokenAccountAndOwner(connection, mouse.mint);
			console.log("-> Mouse Token Account:", mouseTokenAccount.toString(), "Owner:", tokenAccountOwner.toString());

			const destKitATA = await getAta(mouse.mint, destWallet);
			const instruction = await getCreateAtaInstructionV2(connection, wallet.publicKey, destKitATA, mouse.mint, destWallet);
			if (instruction) transaction.add(instruction);

			transaction.add(createTransferCheckedInstruction(
				mouseTokenAccount, // from (should be a token account)
				mouse.mint, // mint
				destKitATA, // to (should be a token account)
				tokenAccountOwner, // owner of source ata
				1, // amount
				0 // decimals (0 - nft, 9 - token)
			));
		}

		// 100 $DEEZ SPL Token ix
		{
			const deezSPLTokenPubKey = new PublicKey(deezSPLToken);
			const deezSPLTokenATASource = await getAta(deezSPLTokenPubKey, wallet.publicKey);
			const deezSPLTokenATADest = await getAta(deezSPLTokenPubKey, destWallet);
			const instruction = await getCreateAtaInstructionV2(connection, wallet.publicKey, deezSPLTokenATADest, deezSPLTokenPubKey, destWallet);
			if (instruction) transaction.add(instruction);

			transaction.add(createTransferCheckedInstruction(
				deezSPLTokenATASource, // from (should be a token account)
				deezSPLTokenPubKey, // mint
				deezSPLTokenATADest, // to (should be a token account)
				wallet.publicKey, // owner of source ata
				100 * LAMPORTS_PER_SOL, // amount
				9 // decimals (0 - nft, 9 - token)
			));
		}

		transaction.feePayer = wallet.publicKey;
		transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
		console.log(transaction);


		const memoData = { kit: { name: kit.name, mint: kit.mint.toString() }, sardine: { name: sardine.name, mint: sardine.mint.toString() }, mouse: { name: mouse.name, mint: mouse.mint.toString() }};
		const mintAmount = 1;
		const res = await mintTokens(candyMachine, wallet.publicKey, mintAmount,null, transaction, memoData);
		// const res = await mintTokens(candyMachine, wallet.publicKey, mintAmount,null, null);
		console.log(res);

		if (res)
		{
			// manual update since the refresh might not detect the change immediately
			toast.dismiss();
			toast.success(`Congratulations! ${mintAmount} mutation done successfully.`, {theme: "dark"});

			// reset selection
			setMutateNFTs([{}, {}, {}]);
		}
		else
		{
			toast.dismiss();
			toast.error("Mutation failed! Please try again!", {theme: "dark"});
		}

		await refreshCandyMachineState();

		// const txResult = await wallet.sendTransaction(transaction, connection);
		// console.log("\nresult:", txResult, "\n");
	};

	useEffect(() => {
		videoRef?.current?.play();
	}, [videoRef]);

	return (
		<div className='relative overflow-x-hidden flex flex-col font-mutation'>
			<ToastContainer theme={"dark"}/>
			<Modal open={open} onClose={handleClose}>
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto border-2 border-primary rounded-lg outline-none max-w-[800px] max-h-[80vh] w-full p-4 bg-[#1B1248]'>
					<h1 className='text-4xl text-white text-center mb-4'>Choose NFT to mutate</h1>
					{NFTdata?.length !== 0 ? (
						<div className='grid grid-cols-4 _md:grid-cols-3 _sm:grid-cols-2 gap-3'>
							{NFTdata !== [] &&
								NFTdata?.map((nft, index) => (
									<div
										className='flex flex-col justify-start items-center overflow-hidden border-2 border-primary rounded-lg text-lg text-white text-center'
										onClick={() => handleSelect(nft)}
										key={index}
									>
										<img alt='nft-art' src={nft.json.image} key={index} className='w-full object-cover' />
										{nft.json.name}
									</div>
								))}
						</div>
					) : (
						<h1 className='text-2xl text-[#f00] text-center'>No NFTs found in the wallet</h1>
					)}
				</div>
			</Modal>
			{!wallet.connected ? (
				<WalletMultiButton className='absolute top-2 _sm:top-16 right-2 bg-none text-[#4BFF2D]'>
					<span>SELECT WALLET</span>
				</WalletMultiButton>
			) : (
				<WalletMultiButton className='absolute top-2 _sm:top-16 right-2 bg-none text-[#4BFF2D]'>
					{wallet?.publicKey?.toString().slice(0, 5)}...
					{wallet?.publicKey?.toString().substr(-5)}
				</WalletMultiButton>
			)}
			<a href='/' className='absolute z-20 top-0 left-0 flex items-center h-[104px] w-auto'>
				<img src={Logo} alt='Logo' className='w-full h-full' />
				<span className='-ml-5 text-[22.27px] text-theme'>
					{`{DEEZ}`}
					<span className='text-primary'>MUTATION</span>
				</span>
			</a>
			<img src={smokeLeft} alt='smokeLeft' className='absolute -z-10 -top-[142px] -left-[116px] w-[875px]' />
			<img
				src={smokeRight}
				alt='_smokeRight'
				className='absolute -z-20 -top-[35px] -right-[285px] w-[875px] _md:hidden'
			/>
			<div className='_container relative flex flex-col mt-[200px] _sm:mt-36'>
				<p className='text-[44.69px] _sm:text-[35.75px] text-[#FBFF49]'>DINNER TIME!</p>
				<p className='relative z-10 mt-2.5 _sm:mt-6 max-w-[690px] w-full text-[25.45px] _sm:text-_xl text-primary'>
					Yummy sardines and yucky mice, or vice versa maybe muuahahha... they carry the DEEZ Virus... makes
					your kit go !$(*&#?@... or let's just say...
				</p>
				<video
					ref={videoRef}
					allow='autoplay'
					muted
					loop
					className='relative -z-10 mx-auto -mt-64 _xl:mt-0 w-[800px] min-w-[550px] _sm:-mt-12 _xs:-ml-12'
				>
					<source src={ToxicShower} type='video/mp4' />
				</video>
				<p className='whitespace-nowrap absolute top-64 left-[1080px] _xl:left-[880px] _xl:top-96 _lg:left-8 _lg:-rotate-12 text-[41.25px] _sm:top-80 _sm:text-[27.41px] text-theme'>
					A BIT EXOTIC!
				</p>

				<div className='flex flex-col mt-2'>
					<p className='mx-auto text-[44.69px] _sm:text-[35.75px] text-theme'>MUTATION</p>
					<div className='flex _sm:flex-col gap-4 mt-8 items-start _sm:items-center _sm:px-12'>
						<div className='w-full'>
							<div className='cursor-pointer group relative overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-2xl p-2 aspect-square'>
								<img
									src={mutateNFTs[0]?.json?.image || Mutation1}
									alt=''
									className={`w-full h-full object-contain rounded-md group-hover:hidden ${
										!mutateNFTs[0]?.json?.image && 'scale-75'
									}`}
								/>
								<div
									className='hidden absolute z-10 top-0 left-0 group-hover:flex flex-col items-center justify-center gap-4 border-2 border-[#683CB6] rounded-2xl w-full h-full bg-[#20194D] text-xl font-bold text-[#683CB6] text-center'
									onClick={() => {
										handleMutate(0);
									}}
								>
									<div className='flex items-center justify-center rounded-md w-20 h-20 _md:w-12 _md:h-12 bg-[#683CB6]'>
										<PlusIcon className='w-8 h-8 _md:w-4 _md:h-4 fill-path' />
									</div>
									Choose your Kit
								</div>
							</div>
							<button
								className='mt-6 border-[#952CFF] border-[1.65px] rounded-md w-full min-h-12 text-[25px] text-[#952CFF]'
								onClick={() => {
									handleMutate(0);
								}}
							>
								{mutateNFTs[0]?.json?.name || 'KIT'}
							</button>
						</div>
						<PlusIcon className='mt-40 _xl:mt-[120px] _lg:mt-20 _md:mt-16 _sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full'>
							<div className='cursor-pointer group relative overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-2xl p-2 aspect-square'>
								<img
									src={mutateNFTs[1]?.json?.image || Mutation2}
									alt=''
									className='w-full h-full object-contain rounded-md group-hover:hidden'
								/>
								<div
									className='hidden absolute z-10 top-0 left-0 group-hover:flex flex-col items-center justify-center gap-4 border-2 border-[#683CB6] rounded-2xl w-full h-full bg-[#20194D] text-xl font-bold text-[#683CB6] text-center'
									onClick={() => {
										handleMutate(1);
									}}
								>
									<div className='flex items-center justify-center rounded-md w-20 h-20 _md:w-12 _md:h-12 bg-[#683CB6]'>
										<PlusIcon className='w-8 h-8 _md:w-4 _md:h-4 fill-path' />
									</div>
									Choose your Sardine
								</div>
							</div>
							<button
								className='mt-6 border-[#952CFF] border-[1.65px] rounded-md w-full min-h-12 text-[25px] text-[#952CFF]'
								onClick={() => {
									handleMutate(1);
								}}
							>
								{mutateNFTs[1]?.json?.name || 'SARDINE'}
							</button>
						</div>
						<PlusIcon className='mt-40 _xl:mt-[120px] _lg:mt-20 _md:mt-16 _sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full'>
							<div className='cursor-pointer group relative overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-2xl p-2 aspect-square'>
								<img
									src={mutateNFTs[2]?.json?.image || Mutation3}
									alt=''
									className={`w-full h-full object-contain rounded-md group-hover:hidden ${
										!mutateNFTs[2]?.json?.image && 'scale-75'
									}`}
								/>
								<div
									className='hidden absolute z-10 top-0 left-0 group-hover:flex flex-col items-center justify-center gap-4 border-2 border-[#683CB6] rounded-2xl w-full h-full bg-[#20194D] text-xl font-bold text-[#683CB6] text-center'
									onClick={() => {
										handleMutate(2);
									}}
								>
									<div className='flex items-center justify-center rounded-md w-20 h-20 _md:w-12 _md:h-12 bg-[#683CB6]'>
										<PlusIcon className='w-8 h-8 _md:w-4 _md:h-4 fill-path' />
									</div>
									Choose your Mouse
								</div>
							</div>
							<button
								className='overflow-hidden mt-6 border-[#952CFF] border-[1.65px] rounded-md w-full min-h-12 text-[25px] text-[#952CFF]'
								onClick={() => {
									handleMutate(2);
								}}
							>
								{mutateNFTs[2]?.json?.name || 'MOUSE'}
							</button>
						</div>
						<EqualsIcon className='mt-40 _xl:mt-[120px] _lg:mt-20 _md:mt-16 _sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full' onClick={handleMutateNFTs}>
							<div className='cursor-pointer relative overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-theme rounded-md aspect-square'>
								<img src={Mutation4} alt='' className='w-full h-full object-contain' />
								<img src={Mutation5} alt='' className='absolute top-0 left-0' />
							</div>
							<div className='flex gap-2.5 mt-6'>
								<button className='border border-primary rounded-md w-full h-12 text-[22.15px] _lg:text-base text-theme'>
									1 <span className='text-[#FBFF49]'>$SOL</span>
								</button>
								<button className='border border-primary rounded-md w-full h-12 text-[22.15px] _lg:text-base text-theme'>
									25 <span className='text-primary'>$DEEZ</span>
								</button>
							</div>
							<button className='relative mt-6 w-full h-12'>
								<img
									src={mutateItem}
									alt=''
									className='absolute -top-1/3 left-0	w-full'
									onMouseLeave={() => setMutateItem(Mutate)}
									onMouseOver={() => setMutateItem(MutateAnimation)}
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
			<footer className='flex flex-wrap gap-x-6 gap-y-2 justify-center mt-32 mx-auto pb-3 text-theme'>
				<a
					href='/'
					target='_blank'
					rel='noreferrer'
					className='flex gap-2 items-center !text-[15px] cursor-pointer'
				>
					<img src={HomeIcon} alt='' className='w-4' />
					HOME
				</a>
				<a
					href='https://magiceden.io/creators/deezkits'
					target='_blank'
					rel='noreferrer'
					className='flex gap-2 items-center !text-[15px] cursor-pointer'
				>
					<MEIcon className='w-4' />
					MAGIC EDEN
				</a>
				<a
					href='https://twitter.com/deezkits'
					target='_blank'
					rel='noreferrer'
					className='flex gap-2 items-center !text-[15px] cursor-pointer'
				>
					<TwitterIcon className='w-4' />
					TWITTER
				</a>
				<a
					href='https://discord.gg/deezkits'
					target='_blank'
					rel='noreferrer'
					className='flex gap-2 items-center !text-[15px] cursor-pointer'
				>
					<DiscordIcon className='w-4' />
					DISCORD
				</a>
				<a
					href='https://staking.deezkits.com'
					target='_blank'
					rel='noreferrer'
					className='flex gap-2 items-center !text-[15px] cursor-pointer'
				>
					<img src={KitIcon} alt='' className='w-4' />
					STAKING
				</a>
				<a
					href='https://slotz.deezkits.com'
					target='_blank'
					rel='noreferrer'
					className='flex gap-2 items-center !text-[15px] cursor-pointer'
				>
					<span>🎰</span>
					SLOTZ
				</a>
				<a
					href='https://coinflip.deezkits.com'
					target='_blank'
					rel='noreferrer'
					className='flex gap-2 items-center !text-[15px] cursor-pointer'
				>
					<img src={CoinFlipIcon} alt='' className='w-4' />
					COIN FLIP
				</a>
			</footer>
			{/* <Music ref={videoRef} /> */}
			{/* <video
				id='video'
				// loop
				// ref={videoRef}
				autoPlay
				allow='autoplay'
				// controls
				onMouseOver={handleSkipToTimeStamp}
				onEnded={handleEnded}
				onLoadStart={onLoad}
				className='hidden'
			>
				<source src={deezkits}></source>
				Your browser does not support video!
			</video> */}
		</div>
	);
};

export default Mutation;
