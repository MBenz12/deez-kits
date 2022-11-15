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

const Mutation = () => {
	const videoRef = useRef();

	const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
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
			console.log(data);
			setNFTs(data);
		};
		getNFTs();
	}, [wallet.publicKey]); //eslint-disable-line

	console.log(NFTs);

	const handleMutate = (index) => {
		if (index === 0) {
		} else if (index === 1) {
		} else if (index === 2) {
		}
	};

	return (
		<div className='relative overflow-x-hidden flex flex-col font-mutation'>
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
							<div className='overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-_md aspect-square'>
								<img src={Mutation1} alt='' className='scale-75 w-full h-full object-contain' />
							</div>
							<button className='mt-6 border-[#952CFF] border-[1.65px] rounded-_md w-full h-12 text-[25px] text-[#952CFF]'>
								KIT
							</button>
						</div>
						<PlusIcon className='-mt-[48px] _sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full'>
							<div className='group relative overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-_md aspect-square'>
								<img src={Mutation2} alt='' className='w-full h-full object-contain group-hover:hidden' />
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
							<button className='mt-6 border-[#952CFF] border-[1.65px] rounded-_md w-full h-12 text-[25px] text-[#952CFF]'>
								SARDINE
							</button>
						</div>
						<PlusIcon className='-mt-[48px] _sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full'>
							<div className='overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-_md aspect-square'>
								<img src={Mutation3} alt='' className='scale-75 w-full h-full object-contain' />
							</div>
							<button className='mt-6 border-[#952CFF] border-[1.65px] rounded-_md w-full h-12 text-[25px] text-[#952CFF]'>
								MOUSE
							</button>
						</div>
						<EqualsIcon className='-mt-[48px] _sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full'>
							<div className='relative overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-theme rounded-_md aspect-square'>
								<img src={Mutation4} alt='' className='w-full h-full object-contain' />
								<img src={Mutation5} alt='' className='absolute top-0 left-0' />
							</div>
							<button className='relative mt-6 w-full h-12'>
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
		</div>
	);
};

export default Mutation;
