import Logo from 'assets/images/deezKits/deez_slotz_logo.png';
import SmokeLeft from 'assets/images/deezKits/smoke_left.png';
import SmokeRight from 'assets/images/deezKits/smoke_right.png';
import MutationTitle from 'assets/images/deezKits/mutation_title.png';
import Mutate from 'assets/images/deezKits/mutate.png';
import Mutation1 from 'assets/images/deezKits/mutation-1.png';
import Mutation2 from 'assets/images/deezKits/mutation-2.png';
import Mutation3 from 'assets/images/deezKits/mutation-3.png';
import Mutation4 from 'assets/images/deezKits/mutation-4.png';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as EqualsIcon } from 'assets/icons/equals.svg';
import { ReactComponent as MEIcon } from 'assets/images/me_icon.svg';
import { ReactComponent as TwitterIcon } from 'assets/images/twitter_icon.svg';
import { ReactComponent as DiscordIcon } from 'assets/images/discord_icon.svg';
import KitIcon from 'assets/images/cat.gif';
import CoinFlipIcon from 'assets/images/coinflip.png';
import HomeIcon from 'assets/images/home.png';

const Mutation = () => {
	return (
		<div className='relative overflow-x-hidden flex flex-col font-mutation'>
			<img
				src={Logo}
				alt='Logo'
				className='absolute z-20 top-0 left-0 w-[213px] sm:left-1/2 sm:-translate-x-1/2'
			/>
			<img
				src={SmokeLeft}
				alt='SmokeLeft'
				className='absolute -z-10 -top-[142px] -left-[116px] w-[875px]'
			/>
			<img
				src={SmokeRight}
				alt='SmokeRight'
				className='absolute -z-20 -top-[35px] -right-[285px] w-[875px] md:hidden'
			/>
			<img
				src={MutationTitle}
				alt='Title'
				className='absolute -z-10 top-[100px] sm:top-[340px] left-1/2 sm:left-2/3 -translate-x-1/3 sm:-translate-x-1/2 w-[806px] sm:w-[551px]'
			/>
			<div className='container relative flex flex-col mt-[200px] sm:mt-36'>
				<p className='text-[44.69px] sm:text-[35.75px] text-[#FBFF49]'>
					DINNER TIME!
				</p>
				<p className='mt-2.5 sm:mt-6 max-w-[690px] w-full text-[25.45px] sm:text-xl text-primary'>
					Yummy sardines and yucky mice, or vice versa maybe muuahahha... they
					carry the DEEZ Virus... makes your kit go !$(*&#?@... or let's just
					say...
				</p>
				<p className='sm:-rotate-12 mt-[89px] sm:mt-2 ml-auto sm:ml-0 text-[41.25px] sm:text-[27.41px] text-theme'>
					A BIT EXOTIC!
				</p>

				<div className='flex flex-col mt-[270px] sm:mt-[460px]'>
					<p className='sm:mx-auto text-[44.69px] sm:text-[35.75px] text-theme'>
						MUTATION
					</p>
					<div className='flex sm:flex-col gap-4 mt-8 items-center'>
						<div className='w-full'>
							<div className='overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-md aspect-square'>
								<img
									src={Mutation1}
									alt=''
									className='w-full h-full object-contain'
								/>
							</div>
							<button className='mt-6 border-[#952CFF] border-[1.65px] rounded-md w-full h-12 text-[25px] text-[#952CFF]'>
								KIT
							</button>
						</div>
						<PlusIcon className='-mt-[48px] sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full'>
							<div className='overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-md aspect-square'>
								<img
									src={Mutation2}
									alt=''
									className='w-full h-full object-contain'
								/>
							</div>
							<button className='mt-6 border-[#952CFF] border-[1.65px] rounded-md w-full h-12 text-[25px] text-[#952CFF]'>
								SARDINE
							</button>
						</div>
						<PlusIcon className='-mt-[48px] sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full'>
							<div className='overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-[#7D7D7D] rounded-md aspect-square'>
								<img
									src={Mutation3}
									alt=''
									className='w-full h-full object-contain'
								/>
							</div>
							<button className='mt-6 border-[#952CFF] border-[1.65px] rounded-md w-full h-12 text-[25px] text-[#952CFF]'>
								MOUSE
							</button>
						</div>
						<EqualsIcon className='-mt-[48px] sm:mt-0 max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]' />
						<div className='w-full'>
							<div className='overflow-hidden flex items-center justify-center border-dashed border-[1.78px] border-theme rounded-md aspect-square'>
								<img
									src={Mutation4}
									alt=''
									className='w-full h-full object-contain'
								/>
							</div>
							<button className='relative mt-6 w-full h-12'>
								<img
									src={Mutate}
									alt=''
									className='absolute -top-1/3 left-0	w-full'
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
					href='https://magiceden.io/marketplace/deez_kits'
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
		</div>
	);
};

export default Mutation;
