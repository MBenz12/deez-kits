import { useEffect, useRef, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Music from 'sharedComponent/musicPlayer';
import Logo from 'assets/images/deezKits/Logo_transparent.png';
import smokeLeft from 'assets/images/deezKits/smoke_left.png';
import smokeRight from 'assets/images/deezKits/smoke_right.png';
import MutationTitle from 'assets/images/deezKits/mutation_title.png';
import Mutate from 'assets/images/deezKits/mutate.png';
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
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Modal } from '@mui/material';
import deezkits from 'assets/video/hathalo.mp4';

const items = [
	{
		tokenId: 1,
		type: 'kit',
		imgUrl: 'https://arweave.net/nLnbcCu3UleLFxDPnGfhH4GvM7nKoHHWodVMqrNlYqc?ext=png',
	},
	{
		tokenId: 2,
		type: 'sardine',
		imgUrl: 'https://arweave.net/nLnbcCu3UleLFxDPnGfhH4GvM7nKoHHWodVMqrNlYqc?ext=png',
	},
	{
		tokenId: 3,
		type: 'sardine',
		imgUrl: 'https://arweave.net/nLnbcCu3UleLFxDPnGfhH4GvM7nKoHHWodVMqrNlYqc?ext=png',
	},
	{
		tokenId: 4,
		type: 'sardine',
		imgUrl: 'https://arweave.net/nLnbcCu3UleLFxDPnGfhH4GvM7nKoHHWodVMqrNlYqc?ext=png',
	},
	{
		tokenId: 5,
		type: 'sardine',
		imgUrl: 'https://arweave.net/nLnbcCu3UleLFxDPnGfhH4GvM7nKoHHWodVMqrNlYqc?ext=png',
	},
	{
		tokenId: 6,
		type: 'sardine',
		imgUrl: 'https://arweave.net/nLnbcCu3UleLFxDPnGfhH4GvM7nKoHHWodVMqrNlYqc?ext=png',
	},
	{
		tokenId: 7,
		type: 'sardine',
		imgUrl: 'https://arweave.net/nLnbcCu3UleLFxDPnGfhH4GvM7nKoHHWodVMqrNlYqc?ext=png',
	},
	{
		tokenId: 8,
		type: 'mouse',
		imgUrl: 'https://arweave.net/nLnbcCu3UleLFxDPnGfhH4GvM7nKoHHWodVMqrNlYqc?ext=png',
	},
	{
		tokenId: 9,
		type: 'mouse',
		imgUrl: 'https://arweave.net/nLnbcCu3UleLFxDPnGfhH4GvM7nKoHHWodVMqrNlYqc?ext=png',
	},
];

const Mutation = () => {
	const [open, setOpen] = useState(false);
	const [NFTdata, setNFTdata] = useState([]);
	const [selectedType, setSelectedType] = useState('');
	const [mutateNFTs, setMutateNFTs] = useState({});
	const videoRef = useRef();
	const [skipFlag, setSkipFlag] = useState(true);

	const handleSkipToTimeStamp = () => {
		if (skipFlag) {
			//skip video 4 sec
			document.getElementById('video').currentTime = 4;
		}
		setSkipFlag(false);
		return true;
	};

	const handleEnded = () => {
		// rest flag
		setSkipFlag(true);
		videoRef.current.play();
	};

	const onLoad = (video) => {
		video.target.volume = 0.25;
		console.log('Volume', video.target.volume);
	};

	const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
	const keypair = Keypair.generate();
	const metaplex = new Metaplex(connection);
	metaplex.use(keypairIdentity(keypair));
	const wallet = useWallet();

	const [NFTs, setNFTs] = useState();
	useEffect(() => {
		if (!wallet.publicKey) return;
		const getNFTs = async () => {
			const owner = wallet.publicKey;
			console.log(owner.toString());
			const data = await metaplex
				.nfts()
				.findByMint({ mintAddress: new PublicKey('9LcAHBasMj9TavyuN1JnbDWXkmofnkom3J4T4sL6xjiN') });
			setNFTs(data);
		};
		getNFTs();
	}, [wallet.publicKey]); //eslint-disable-line

	const handleMutate = (index) => {
		if (index === 0) {
			setSelectedType('kit');
		} else if (index === 1) {
			setSelectedType('sardine');
		} else if (index === 2) {
			setSelectedType('mouse');
		}
		setOpen(true);
	};

	useEffect(() => {
		if (selectedType === '') return;
		const temp = items.filter((item) => item.type === selectedType);
		setNFTdata(temp);
	}, [selectedType]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleSelect = (nft) => {
		if (nft.type === 'sardine') setMutateNFTs((prev) => ({ ...prev, sardine: nft }));
		if (nft.type === 'mouse') setMutateNFTs((prev) => ({ ...prev, mouse: nft }));
		if (nft.type === 'kit') setMutateNFTs((prev) => ({ ...prev, kit: nft }));

		handleClose();
	};

	const handleMutateNFTs = () => {
		console.log(mutateNFTs);
	};

	return (
		<div className='relative overflow-x-hidden flex flex-col font-mutation'>
			<Modal open={open} onClose={handleClose}>
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto border-2 border-primary rounded-lg outline-none max-w-[800px] max-h-[80vh] w-full p-4 bg-[#1B1248]'>
					<h1 className='text-4xl text-white text-center mb-4'>Choose NFT to mutate</h1>
					<div className='grid grid-cols-4 _md:grid-cols-3 _sm:grid-cols-2 gap-3'>
						{NFTdata !== [] &&
							NFTdata.map((nft, index) => (
								<div
									className='flex flex-col justify-center overflow-hidden border-2 border-primary rounded-lg text-2xl text-white text-center'
									onClick={() => handleSelect(nft)}
									key={index}
								>
									<img alt='nft-art' src={nft.imgUrl} key={index} className='w-full object-cover' />
									{nft.type} - {nft.tokenId}
								</div>
							))}
					</div>
				</div>
			</Modal>
			<WalletMultiButton className='absolute top-2 _sm:top-16 right-2 bg-primary' />
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
			<img
				src={MutationTitle}
				alt='Title'
				className='absolute -z-10 top-[100px] _lg:top-[376px] left-[680px] _xl:left-[576px] _lg:left-1/2 _lg:-translate-x-[225px] _lg:w-[551px]'
			/>
			<div className='_container relative flex flex-col mt-[200px] _sm:mt-36'>
				<p className='text-[44.69px] _sm:text-[35.75px] text-[#FBFF49]'>DINNER TIME!</p>
				<p className='mt-2.5 _sm:mt-6 max-w-[690px] w-full text-[25.45px] _sm:text-_xl text-primary'>
					Yummy sardines and yucky mice, or vice versa maybe muuahahha... they carry the DEEZ Virus... makes
					your kit go !$(*&#?@... or let's just say...
				</p>
				<p className='_xl:-rotate-12 mt-[89px] _xl:mt-2 ml-auto _xl:ml-0 2_xl:-mr-12 text-[41.25px] _sm:text-[27.41px] text-theme'>
					A BIT EXOTIC!
				</p>

				<div className='flex flex-col mt-[400px] _xl:mt-[420px] _lg:mt-[500px]'>
					<p className='_sm:mx-auto text-[44.69px] _sm:text-[35.75px] text-theme'>MUTATION</p>
					<div className='flex _sm:flex-col gap-4 mt-8 items-center _sm:px-12'>
						<div className='w-full'>
							<div className='group relative overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-md p-2 aspect-square'>
								<img
									src={mutateNFTs?.kit?.imgUrl || Mutation1}
									alt=''
									className={`w-full h-full object-contain rounded-md group-hover:hidden ${
										!mutateNFTs?.kit?.imgUrl && 'scale-75'
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
							<button className='mt-6 border-[#952CFF] border-[1.65px] rounded-md w-full h-12 text-[25px] text-[#952CFF]'>
								KIT
							</button>
						</div>
						<PlusIcon className='-mt-[48px] _sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full'>
							<div className='group relative overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-md p-2 aspect-square'>
								<img
									src={mutateNFTs?.sardine?.imgUrl || Mutation2}
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
							<button className='mt-6 border-[#952CFF] border-[1.65px] rounded-md w-full h-12 text-[25px] text-[#952CFF]'>
								SARDINE
							</button>
						</div>
						<PlusIcon className='-mt-[48px] _sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full'>
							<div className='group relative overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-md p-2 aspect-square'>
								<img
									src={mutateNFTs?.mouse?.imgUrl || Mutation3}
									alt=''
									className={`w-full h-full object-contain rounded-md group-hover:hidden ${
										!mutateNFTs?.mouse?.imgUrl && 'scale-75'
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
							<button className='mt-6 border-[#952CFF] border-[1.65px] rounded-md w-full h-12 text-[25px] text-[#952CFF]'>
								MOUSE
							</button>
						</div>
						<EqualsIcon className='-mt-[48px] _sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full'>
							<div className='relative overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-theme rounded-md aspect-square'>
								<img src={Mutation4} alt='' className='w-full h-full object-contain' />
								<img src={Mutation5} alt='' className='absolute top-0 left-0' />
							</div>
							<button className='relative mt-6 w-full h-12' onClick={handleMutateNFTs}>
								<img src={Mutate} alt='' className='absolute -top-1/3 left-0	w-full' />
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
			<Music ref={videoRef} />
			<video
				id='video'
				// loop
				ref={videoRef}
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
			</video>
		</div>
	);
};

export default Mutation;
