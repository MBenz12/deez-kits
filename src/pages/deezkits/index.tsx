/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from "@mui/material";
import { BN, Wallet } from "@project-serum/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CountdownTimer from "../../components/deezkits/countdown/CountDownTImer";
import CommonTitle from "../../sharedComponent/FancyTitle";
import Footer from "../../sharedComponent/footer/footer";
import HighlightedText from "../../sharedComponent/HighlightedText";
import Music from "../../sharedComponent/musicPlayer";
import WalletButton from "../../sharedComponent/wallletButton";
import { Images } from "../../static/images";
import { CandyMachineAccount, getCandyMachineState, getCollectionPDA, mintTokens } from "./candy-machine";
// @ts-ignore
import audioUrl1 from "../../assets/audio/counting.mp3";
// @ts-ignore
import mintBtnaudio from "../../assets/audio/menu.mp3";
// @ts-ignore
import style from "./deezkits.module.scss";


// const CANDY_MACHINE_ID = "2KdHyE7aD6hjAD9kZhX9U5XSKFQJsTyPdpCz37M5Dwjs"; //devnet
const CANDY_MACHINE_ID = "BcBNrnxCpQ15KJ1gDMhiPSgFXPnbccu1SpAJjGgzAuUE"; //mainnet
const DEFAULT_TIMEOUT = 60000;

const DeezKits = React.forwardRef((props:any, ref) =>
{
    const { connection } = useConnection();
    // const connection = new Connection(clusterApiUrl("devnet"), "confirmed"); // devnet
    const wallet = useWallet();
    const anchorWallet = useAnchorWallet();
    const [isMintState, setMintState] = useState(props?.isMint);
    const [mint, setMint] = useState<string>("1");
    const audioCountRef = useRef(null);
    const audioMintRef = useRef(null);
    const MintDate = new Date("Thu, 10 Nov 2022 17:00:00 UTC");
    const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
    const [itemsRemaining, setItemsRemaining] = useState<number>();
    const [isActive, setIsActive] = useState(false);
    const [itemsRedeemed, setItemsRedeemed] = useState(800);
    const [itemsAvailable, setItemsAvailable] = useState(800);
    const [itemPrice, setItemPrice] = useState<number>(0.44);

    useEffect(() =>
    {
        console.log("Connecting wallet... state:", wallet.connected);

        refreshCandyMachineState();

    }, [wallet.connected]);

    const refreshCandyMachineState = async () =>
    {
        if (!wallet.publicKey)
        {
            return;
        }

        try
        {
            const cndy = await getCandyMachineState(anchorWallet as Wallet, new PublicKey(CANDY_MACHINE_ID), connection);
            let active = cndy?.state.goLiveDate ? cndy?.state.goLiveDate.toNumber() < new Date().getTime() / 1000 :false;
            let presale = false;
            let isWLUser = false;
            let userPrice = cndy.state.price;
            userPrice = isWLUser ? userPrice :cndy.state.price;

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
            } else
            {
                setItemsRemaining(cndy.state.itemsRemaining);
            }

            if (cndy.state.isSoldOut)
            {
                active = false;
            }

            const [collectionPDA] = await getCollectionPDA(new PublicKey(CANDY_MACHINE_ID));
            const collectionPDAAccount = await connection.getAccountInfo(collectionPDA);

            setIsActive((cndy.state.isActive = active));
            setCandyMachine(cndy);
            setItemsRedeemed(cndy.state.itemsRedeemed)
            setItemsAvailable(cndy.state.itemsAvailable)
            setItemPrice(cndy.state.price.toNumber()/LAMPORTS_PER_SOL)
            console.log(`${CANDY_MACHINE_ID} Candy State: itemsAvailable ${cndy.state.itemsAvailable} itemsRemaining ${cndy.state.itemsRemaining} itemsRedeemed ${cndy.state.itemsRedeemed} isSoldOut ${cndy.state.isSoldOut}`);
        }
        catch (e)
        {
            toast.error("CandyMachine Error " + e, {theme: "dark", style: {blockSize: "max-content", backgroundSize: "300px", maxWidth: "max-content" }, bodyStyle: {blockSize: "max-content", backgroundSize: "300px", maxWidth: "max-content"}});
            console.error("CandyMachine Error:", e);
        }
    }

    const AmountHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        if (parseInt(e.target.value) < 1)
        {

            e.target.value = "1";
        }

        if (parseInt(e.target.value) > 10)
        {
            e.target.value = "10";
        }

        setMint(e.target.value);
    };


    const mintHandler = async () =>
    {
        console.log("isSoldOut:", candyMachine?.state.isSoldOut);
        console.log("itemPrice:", itemPrice);

        const mintAmount : number = parseInt(mint);
        const totalCost : BN = new BN(mintAmount).mul(candyMachine?.state!.price!);
        const totalCostSOL = totalCost.toNumber() / LAMPORTS_PER_SOL;

        const userBalance : BN = new BN(await connection.getBalance(wallet!.publicKey!));
        const userBalanceSOL = userBalance.toNumber() / LAMPORTS_PER_SOL;

        const isUserHasBalance = userBalance.gte(candyMachine?.state!.price!);
        console.log(`Trying to mint ${mintAmount} with cost ${totalCostSOL} SOL, userBalance: ${userBalanceSOL} SOL`);
        console.log(isUserHasBalance);

        if (!isUserHasBalance)
        {
            toast.dismiss();
            toast.error(`Not enough SOL, needs ${totalCostSOL} SOL to mint ${mintAmount}.`, {theme: "dark"});
            return;
        }

        if (!candyMachine?.state.isSoldOut)
        {
            toast.success(`Minting ${mintAmount} in progress...`, {theme: "dark", autoClose: 15000, bodyStyle: { width: "500px"}});

            const res = await mintTokens(candyMachine!, wallet!.publicKey!, mintAmount);
            console.log(res);

            if (res)
            {
                // manual update since the refresh might not detect the change immediately
                toast.dismiss();
                toast.success(`Congratulations! ${mintAmount} minted successfully.`, {theme: "dark"});
            }
            else
            {
                toast.dismiss();
                toast.error("Mint failed! Please try again!", {theme: "dark"});
            }

            await refreshCandyMachineState();
        }
        else
        {
            toast.success("SOLD OUT!");
        }
    };

    return (
        <Box className={style.deez_kits_wrapper}>
            <Box className={style.deezkits_header}>
                <a href=" https://deezkits.com" target="_self">
                    <img src={Images?.logo} alt="deezkits-icon"/>
                </a>
            </Box>
            <Box className={style.deez_content_wrapper}>
                <Box className={style.deez_inner_content}>
                    <Box className={style.deezkits_content_wrapper}>
                        {isMintState ? (
                            <>
                                <Box className={style.deezkits_mint_title}>
                                    <span> &lt; </span>
                                    <span className={style.can}>CAN</span>{" "}
                                    <span className={style.deez}>DEEZ</span>{" "}
                                    <span className={style.kits}>KITS</span>{" "}
                                    <span className={style.fit}>FIT</span>{" "}
                                    <span className={style.yr}>YO</span>{" "}
                                    <span className={style.wallet}>
                    <img src={Images?.walletGlitch} alt="wallet-glitch"/>
                  </span>
                                    <span className={style.gt_entity}>&gt; &#63;</span>
                                </Box>
                            </>
                        ) :(
                            <CommonTitle MintDate={MintDate}/>
                        )}
                    </Box>
                    <Box className={style.deezkits_content_logo}>
                        <img src={Images?.logoTrasnsparent} alt="deezkits-mint-title"/>
                    </Box>
                    {isMintState ? (
                        <>
                            <Box className={style.progress_wrapper}>
                                <Box className={style.progress_bar}>
                                    <Box
                                        className={style.progress_bar_inner}
                                        sx={{
                                            width: `${((100 * itemsRedeemed) / itemsAvailable)}%`,
                                        }}
                                    ></Box>
                                </Box>
                            </Box>

                            <Box className={style.sold_mint_wrapper}>
                                <Typography className={style.sold_mint_text}>
                                    {itemsRedeemed} / {itemsAvailable} SOLD
                                </Typography>
                                <Typography className={style.mint_text}>
                                    400 ALREADY AIRDROPPED TO KIT HOLDERS
                                </Typography>
                            </Box>
                            <Box>
                                
                                    {wallet.connected ? (
                                        <button onClick={mintHandler} className={style.mint_button}>
                                          {/* <span className={`${style.curly_open} ${style.zoom_in_out}`}>
                                            &#123;
                                           </span>{" "}
                                          <span className={style.mint_btn}>MINT</span>
                                           <span className={`${style.curly_close} ${style.zoom_in_out}`}>
                                            &#125;
                                           </span> */}
                                            <img src={Images.MintBtn} alt="deezkits-mint-button" className={style.mint_img_btn}/>
                                            <img src={Images.MintHoverbtn} alt="deezkits-mint-button" className={style.mint_hover_btn}/>
                                        </button>
                                    ) :(
                                        <Box  className={`${style.mint_button} ${style.mint_connect_button}`}>
                                        <span className={`${style.curly_open} ${style.zoom_in_out}`}>
                                          &#123;
                                         </span>{" "}
                                        <WalletMultiButton className={style.wallet_connect}>
                                            <span className="connect-text">Connect</span>
                                        </WalletMultiButton>
                                        <span className={`${style.curly_close} ${style.zoom_in_out}`}>
                                            &#125;
                                           </span>
                                        </Box>
                                    )}
                                    
                            </Box>

                            <Typography className={style.desc_text}>
                                <HighlightedText className="highlightedText">
                                    Price{" "}
                                </HighlightedText>{" "}
                                - {itemPrice} SOL
                            </Typography>

                            <Typography className={style.desc_text}>
                                <HighlightedText className="highlightedText">
                                    Amount{" "}
                                </HighlightedText>{" "}
                                -
                                <span className={style.amount_input}>
                  {" "}
                                    <input
                                        type="number"
                                        defaultValue="1"
                                        placeholder="1"
                                        min="1"
                                        max="10"
                                        maxLength={10}
                                        onChange={(e) =>
                                        {
                                            AmountHandler(e);
                                        }}
                                    />{" "}
                </span>
                            </Typography>
                        </>
                    ) :(
                        <Box>
                            <Typography
                                className={`${style.desc_text} ${style.mint_supply}`}
                                sx={{marginBottom: "16px"}}
                            >
                                <HighlightedText className="highlightedText">
                                    {" "}
                                    Supply{" "}
                                </HighlightedText>{" "}
                                - {`${"800"}`}
                            </Typography>
                            <Typography className={`${style.desc_text} ${style.mint_price}`}>
                                <HighlightedText className="highlightedText">
                                    {" "}
                                    Price{" "}
                                </HighlightedText>{" "}
                                - {`${"0.44"}`} SOL
                            </Typography>

                            <Box className={style.deezkits_timer}>
                                <CountdownTimer targetDate={MintDate}/>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
            <Box className={style.deez_left_kits_wrapper} >
                <Box className={style.deez_kits_kitty}>
                    <img src={Images?.DeezKitsKitty} alt="deez-kits-kitty"/>
                    <div className={style.glitch__layers}>
                        <div className={style.glitch__layer}></div>
                        <div className={style.glitch__layer}></div>
                        <div className={style.glitch__layer}></div>
                    </div>
                </Box>
            </Box>

            <Box className={style.deez_right_kits_wrapper} >
                <Box className={style.deez_Right_kits_kitty}>
                    <img src={Images?.DeezKitsRightKitty} alt="deez-kits-right-kitty"/>
                    <div className={style.glitch_right_layers}>
                        <div className={style.glitch_right_layer}></div>
                        <div className={style.glitch_right_layer}></div>
                        <div className={style.glitch_right_layer}></div>
                        <div className={style.glitch_right_layer}></div>
                        <div className={style.glitch_right_layer}></div>
                    </div>
                </Box>
            </Box>
            <Footer/>
            {/* <Box className={style.toggle_btn}>
                <Button onClick={() => setMintState(!isMintState)}>
                    <span>{!isMintState ? "Mint" :"countdown"}</span>
                </Button>   
            </Box> */}
            {/* <Music ref={ref}/> */}
            {/* couting audio */}
            <audio loop ref={audioCountRef} controls className="d-none">
                <source src={audioUrl1}></source>
            </audio>
            {/* mint audio */}
            <audio loop ref={audioMintRef} controls className="d-none">
                <source src={mintBtnaudio}/>
            </audio>
            {/* wallet  */}
            <WalletButton/>
        </Box>
    );
});

export default DeezKits;
