import {
  CommunityFunds,
  Jackpot,
  PlayerFunds,
  SolBalance,
  WalletButton,
} from "./HeaderItems";
import { KitsLogo } from "./Svgs";

const Header = ({
  communityBalance,
  royalty,
  solBalance,
  playerBalance,
  prize,
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
  won: boolean;
  lost: boolean;
  bet: number;
  withdrawPlayerMoney: () => void;
}) => {
  return (
    <>
      <div className="hidden xl:flex w-full justify-between relative">
        <div className="relative">
          <div className="w-[90px] h-[90px]">
            <KitsLogo />
          </div>
        </div>
        <div className="absolute top-0 left-[50%] translate-x-[-50%]">
          <CommunityFunds id={1} balance={communityBalance} royalty={royalty} />
          <Jackpot jackpot={14.4} />
        </div>
        <div className="flex gap-3">
          <PlayerFunds
            won={won}
            prize={prize}
            tokenType={false}
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
        <div className="flex justify-between relative">
          <div className="relative">
            <div className="w-[45px] h-[45px]">
              <KitsLogo />
            </div>
          </div>
          <div className="absolute top-0 left-[50%] translate-x-[-50%] z-[1000]">
            <WalletButton id={2} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 mb-5">
          <CommunityFunds id={2} balance={communityBalance} royalty={royalty} />
          <Jackpot jackpot={14.4} />
          <PlayerFunds
            won={won}
            prize={prize}
            tokenType={false}
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
