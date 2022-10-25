import {
  CommunityFunds, PlayerFunds,
  SolBalance,
  WalletButton
} from "./HeaderItems";
import { KitsLogo } from "./Svgs";

const Header = ({
  communityBalance,
  royalty,
  solBalance,
  playerBalance,
  prize,
  jackpot,
  won,
  lost,
  bet,
  withdrawPlayerMoney,
}: {
  communityBalance: number;
  royalty: number;
  solBalance: number;
  playerBalance: number;
  prize: number;
  jackpot:number;
  won: boolean;
  lost: boolean;
  bet: number;
  withdrawPlayerMoney: () => void;
}) => {
  return (
    <>
      <div className="hidden xl:flex w-full justify-center relative mb-10 z-[3]">
        <div className="absolute left-[-20px] top-[-20px]">
          <div className="w-[225px] h-[104px]">
            <KitsLogo />
          </div>
        </div>
        <div className="">
          <CommunityFunds id={1} balance={communityBalance} royalty={royalty} />
          {/* <Jackpot jackpot={14.4} /> */}
        </div>
        <div className="absolute right-0 top-0 flex gap-3">
          <PlayerFunds
            won={won}
            prize={prize}
            playerBalance={playerBalance}
            withdrawPlayerMoney={withdrawPlayerMoney}
          />
          <div className="flex flex-col gap-3">
            <WalletButton id={1} />
            <SolBalance id={3} balance={solBalance} lost={lost} bet={bet} />
          </div>
        </div>
      </div>
      <div className="xl:hidden flex flex-col w-full gap-3">
        <div className="flex flex-col items-center justify-between relative">
          <div className="relative sm:absolute sm:left-[-20px] sm:top-[-20px]">
            <div className="w-[170px] h-[85px]">
              <KitsLogo />
            </div>
          </div>
          <div className="">
            <WalletButton id={2} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 my-5">
          <CommunityFunds id={2} balance={communityBalance} royalty={royalty} />
          {/* <Jackpot jackpot={14.4} /> */}
          <PlayerFunds
            won={won}
            prize={prize}
            playerBalance={playerBalance}
            withdrawPlayerMoney={withdrawPlayerMoney}
          />
          <div className="flex gap-2">
            <SolBalance id={4} balance={solBalance} lost={lost} bet={bet} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
