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
import moment from "moment";

const wlList =
    [
        "7D7DmXQPn9EixdGoaq71KHg4TGBVPuf6EbT3kv9yMq32",
        "qnN3fBJ3oWYb5GNh8uVKgtCTX6Z2YFujxeFkBP14X5P",
        "BenUtS76fsAjmW8w1vfHbUdhdQVQaW4e1zb1yLvCbG8D",
        "A2RXRrM8wSNHnZkTc39KLN6dARJuhzKsJktPdX4rvCEb",
        "6qU148QnvJHLT9DUtoBTLtXMwCRawb75NE5WtR4BVcM6",
        "F56mdWCiBJH3mctHani6hHCvM91YQpkWZtLCt8iryUbw",
        "GwDKiPBfzbvGvwgEsaHw7E5Pfeb8H5qNQA8hQEzHqcuh",
        "H45oaQbW6YZy62MQDdrvZHmUwtfD8H4RPUyz946RCoii",
        "9H2b1QrAr8jjqxfH1vfnQtrPqa8EWhWC2CHydaBDSpR7",
        "Hq9nEFuF8pB8GJk9QYY9aWUZdNZNcfUYgqPiXRG8nbNF",
        "9XuYG73JY8xg5JFLF4XbHE5uj8CYMVaa6hcxgzW2z7Gk",
        "B9joVmsa8QLUjzcZ5BYkoHoUGJ1Pr9rjgQk8XFky9kBH",
        "EPYWTTtrLwQRy35MNxbNqjqu9KSeNoiwNrHKkAhc9qiX",
        "4UKK9UvoGzmh3M8BJQuHfYXoVoPMi2xYwt3EnQxPUpmC",
        "DQxXqoNSeuxevNGtGCRtUB4LrdV9RG64Dwt4fdsiYpvd",
        "3C4wsb7rf2UqqGYHqtdDDsjzcffnrE1a7QaQuYHyY1mv",
        "B7YCj1nhw4Z8vrCS1efEtQcJrFiFxmkPjF6AUCHffHz2",
        "AfjxJP755SPM8oxx1jACHN3ZG88M3qSLiLLp7zjntQAu",
        "G7YrRqKWy1XzCTcJ7XbDEaniUwoeqjnsdZxshDWYRVtN",
        "AdMypCxkngPMVH2SsXoEyqMsk4uRkscEfprV9bVZKSEi",
        "GkRbK3USS6pymWp2aSrRsGm8BzZM6zHiYKXWZb8ojR37",
        "HFsHezxDkiWgagkQqvbW3pPY6BtzcYa9WZJ43fvjSYTa",
        "4nHZLa31K2BKKou8aaDT4Bs1Go7TpZGj1zqa5t8SeJFa",
        "EVBzfguN5G3ue9x5NCtnrbfSCa4KcWw9Tkwh4ufcE5kt",
        "ApSpTitrKWS7ESigedzci91ZqWdgMx1MK3rQy8KMpaTW",
        "2Xn1mPNHaxksZzjVLJWaMxcvcmWxEkbq58dNJkEY96CK",
        "EeG4QfA8FQJX3rV7qntGF63KXQQEcQQg7ac5GKHeBsSc",
        "G3EMhqHfgRnDf824UfToGthSkNd3KSG1i9kke1BRPS9p",
        "GdcK6TtpnKAypD2CNdmUMTZJEke6qVT4FZPCRPe9jkUT",
        "ARbyumC6cc774ndx1NvcVmeYiewfVgu72HhAtgikDuq7",
        "gkxdMmbYP5FPrxZ8GwzeNtU7bx4mR2HKiA4WGJAgx6b",
        "EF93adJqrHnG917fHaBDNM5enmowJXdkLvdSgJ8YRSHS",
        "6zc3Rj36ES3C4LSGLgaUiCkZ2s1E8P7cxGnyuzfFvXw9",
        "44gRxxQxZW4ezRksqvEGzzvr75Fbe26CVQjUKDc7PEb9",
        "BPLE5RThkWQYvCidcMBCrwJZxstcDY4xxFaZvd8M1Gdi",
        "GiK5gAM3oZ74BcKybkRm1vgQ9Y58999eKDdKRRuLRpse",
        "kr4jxjXB9QyEJVqPQRmqqX29GADL3gKVZTjyHAUkD1c",
        "BJERVcHuEnfrYiRgFnZZ1FYVyYCJtnXNqsTUiKZYzyQ",
        "EDRwYnSg2dQeu8kU6d9CuipdRXWWDx2Ufv3TcB4Sr3D8",
        "HT4trDYkjgRJg7yPropqneST7nJSv1UjgAnWaDdC4dkF",
        "CDswpRSGJkgbCSLbUGRMRumHcGy9n7ZWdDgrWdxwy2Qn",
        "6KBCA1PjEjMpq2ywAViSWVxMKyaJRsGHdyvw2wY3D8S9",
        "DumcPzD48gHvipxgC7C3coYjXsh2rGuepRhjfbozb1yC",
        "KbNdXsGb5JxTd1Eh4wVamo28sKqj2MNVSin4tqDL8dx",
        "2EvFaj53iALdHrGyDwT7dUVmDyewULhKnacjvDqVaGJ1",
        "2wSkmGLWffxvmxfSKFTPEzgfw7GLSKxwntomMzxWAW2t",
        "FzraC1XYPaRhPmPNFbB76z2cQSovw9QJr9h4Eka7pN91",
        "CxLX6GnDKLi32WiN7X4UUpRv4trzdmCz8vyVZcDfVQYw",
        "Cvvsa1vQLAxQpCvS6cGPdzMuuteBjh8zSVsLVxFs6ZW9",
        "Arw6ZgRbpy4Te1188xLogdegqVXCSNFznkRATxUph7Tz",
        "4TP7MdGXRGpX19LmuZG17awSWdeWMm8NRntdmmUkVbC1",
        "3uTokqbrsn8axqXdAbQzB1QP9MvYD3mtMV4pqA7ULjxL",
        "36RNMvFBeiVKt7GDy6FLwXbB7FxnoWCW7zpqbjP8Wckh",
        "J1CH1wjMuKe2gmtkZ3XjhtCL31EKYUsD9rw53eee3Bdv",
        "C3XkXzgHJEcqobMr8juzhwqw9bz6qpJJeTA5HKM9uDvG",
        "2gcKyRrE38U66bdBsqKr8mfQpmaEMTcwgnuT8BDYQWuU",
        "E8y1RjECWi4kb6uMhz3SsaUKLMd6f3RiQSYUZS5P2FSF",
        "92hPdzRrn7scMW5kFY6hWJpWBryYUiWBBstcdPTh4mGT",
        "p2FbSCcFjCEZEyM8KtHvoYS5XMQY5SCGQ96ajuiQJqw",
        "AGi7Ta9SRdfm5xzpavcYnGeghcDKJPCALkceReeKdDdH",
        "5tbg3au32N5mxsP2gELr3P3HumfAb9Uxf9q9jwntgfEb",
        "eJveLM1bNfTcUArM2bzgegphvyuc6Rne9g5Xv4dsZvw",
        "41zshJUrsVFcpXKjmyZsqKDXTEKNxJgdBVK1nKjw2ygW",
        "6wyqGbiUzipUDHNtLn4ATAVXBGpC5AdRPnExMjGdsaTQ",
        "GD2QBpCnPYBdkjbZ7cEeizcRmqrEjfCM6XN4n72ea4Dz",
        "FQvFqcSdGWeecfk97bf8da3bVtsCrjAsBC5qovCg21Yv",
        "CqxPPqyGsjyDTJvp7XZLLSgHHCdHUm1zv8yhrPXvo92",
        "B2GtMg2rMB3BBJSRaDgespzZnJMnGWMpXyxvg9xpTc2p",
        "BgP8w3UxPAxeanRx88LBpnUN4znaRBKNVz9vHtQqzNJZ",
        "9uDzo9kSJ6eL3Zep3Sd2yoLdfHPCbwquTcnT2gjSc4xc",
        "Evpp8F3XuMBgmzjyDkpfthR5p2qun44WcU3NqCvrAzkM",
        "6bFWDWJx3S2vzdYgZ1mDFDDDQipctrdMZQrW7SoJBBEA",
        "wbYu8pHCvAW4F2RfUfg4oeUAdUryVWdfpAXKFqMWpR4",
        "5Hgk9TdhgdocxEC5kUucjqjtziGUBM2zkFJKG5zeh2B4",
        "E6zFgYjHbRU33vZXEHMb7V8bXVmqtpDtsprnqtkvYjHQ",
        "F9FoWMqUg5Gif8KUgVF8WyX1pn9aajoNUJDzWHATy1eP",
        "2o33UGiCbYzePkkDMhGcAyrEAJX2yHtfKufWCBYWepcq",
        "HP9cHJwh9p2Zepkr42E5Krp8utdeyt79fYYvJv38k6Bk",
        "HGh7iPHTWmiyrvB6yvsouReDjTPa8TA5oa3v36qTCPa9",
        "321Myz2eJas8Jza9KhWtYGQDnjM5qBNqMfdUJYSBj4JX",
        "6L457FK1gXH4CtsUCkVZxgq3teLWMQM7RmKquS44WNXH",
        "4e8Pxhv9kBrqd3rCXUG9ySQY16dgeANAmQWvnXDXabMd",
        "7wpytF8tEr37rMp4RwyoUdWW989MuGaKpuLXEgsk6AVC",
        "3u9oHSV8dQT6Kt32Zjw2Au4sgM3MRzmzBdJAEcDjBGaJ",
        "F765gAGAP1MgXqxMfDTASXHw7eNYPSYBJqwCRiniEZ13",
        "Dw9KRmE1v5HJ3yV9UpM1afuMxKP86fKcuHA6MfJFrDKv",
        "7sJSinpYAxorKQH3SUhRo58tiCFF5puZsXEUdNyJJCZw",
        "99GXwppiNKq6dChNTjA1PGafxZv7myBn73FzuqZKQRsA",
        "DbhwKraMQv6tVqgjUJzcwBWaNCXUoV31JwgbAp75pubS",
        "7vK9wZAsdAbDeqY626prwYFMu5aq9iHEH5bZveyazTX1",
        "AkXSeC9sG3171VbAf4tY2QYifzXK8tU9RjSoQ3LJ1goY",
        "GS11QHArqL4zfB1mfGjKTX5aVdTDRfGAVzXQjDQxmUq7",
        "8WdotSVdUejEYMc3FuZG9VJtGCVd8FDUFe5sh4NXvbho",
        "FMrryPmf6gkdkZZieoeoKhqY5LW1jw1FmC5KrUwGyuUP",
        "AdX1ingooRKu57DKRTh2bGFQg9g32LiFQZnHDcwzQrs1",
        "86ogPBrBPga6uBdFdV2Xd28GsDYM5ZPVjGSWicQZJpb7",
        "BTbdEP3ivUVACHHw43Dnh21pKiyRmbyKwqWyvrRnSwkB",
        "FMyRyGWcU7TFzYaTtWViJmK6EmXkfuUUqbVGNJDwZPmb",
        "4cBxMvRoLu17zkHWeabYh1hDSK6ZkNi7yfnyS6kG2G74",
        "8iAioesBd4ZMJbZYH2eErYEz24TKhs7K3635aDLrP1K2",
        "4MrYCRPCiapD71hv2fPSkHWA8qQhxp7ugsBjTKPyZ14y",
        "3z6snKEXBXPg7QvY2UaoBEYgexKoDdDC7J5HwD7MG5cA",
        "CDmhyhKMyqLChXkufCSXSsZQedtez4eyoA5wnPDdKd1G",
        "ETA3hrJnwJypNk5MF45C7sRqw9FB1gNKwABxGgkjZ5XH",
        "4Bdj7dxCrVUa2bwhQPLPogfCj2pmddv4mL4bJRivTJWh",
        "FnCZ9EyVvirkdfcVLDWtX7i3JRFZaRXrfy5NtZ2FA55f",
        "CGLn2rG18eT2u3Dad9tWfpYarnhTYDb79TENPPri27cC",
        "85rwVhtQfgjhGLdYFSiAVBZxPzCfxfpXsgxe8YkqR1Nt",
        "5VpUivyNf2F57B4j8qbuHjyCRZDFwtfg6hVqK9gov4YJ",
        "AL64rGD3jj6wgvhJcrpvoNHNnqdzMa9bxQQsezNXqQqY",
        "7yHDc8NNVo7EQyUpNGoWuSBswch7kwbJ35xtF7SwMBdu",
        "C2zAX1UtxwNZvPRcGVTHAohuauFme5eHnkhAzn6ptwvi",
        "93acwbJXJCaMyAK8MRghyiQexfAFpvec5tuFhqdvGDBu",
        "8Fmi8k6BbYokB36zm2gY51xAy8gqbm3qdguVc5HoVLv",
        "EPHK66Lg1CBh3jxAi9tbF6p5DJXU4ASETCi4yQbvbFhw",
        "2dKsTSjBhXyK9Z2AXU5vMnhFnNagg1LtSePcHhZKyecV",
        "HbJ2UoMBxW2PmvXoq65j1sNFazZMsTGE8d4kC89X4TXb",
        "7qLcz4S3UMNd1cZH2amcuckjeaApDtRb7b4vbMCcbGJD",
        "FtfX75BZSzdjDpZmfsj6suv8wAxgMnkP7JAuVfGu9UoM",
        "D5G8feu6cWDxji3USCobxEhSRY4wkwAhK1BkHcTKqQsg",
        "BYMuakjAcKSA78beD8BJ53oZgZqQE9jQS7t3ceXyzVeE",
        "ACBSozqjanMWQZmsG86AotAaX1d5o5BgTaePn1QwFsKP",
        "659guVgzudEiCUq9TbKSzqTLmHagB4QaHb1wQuUE1Q7r",
        "AXeEaaUDTLQawWxmPUB13LGMaRuLCDXZf6vNZxdhtAYx",
        "PypgWhXVzmYiiMmL7CQ8GswGAi2xqezgERoshgFrEqn",
        "7aKUEf8E8uvtKngNeyFsc4mKC9SWQNXCD9k79r22Rs1M",
        "FiW9iMutJ6ZPC4LJJur5PX7dXmu4QVihvcti67Qab1sr",
        "GGBbPF6nEB4APZjPTTrAcwvgkJ1DbJVYJgpErGEa3UU6",
        "8yQpT9wYZmbGqCbo8DrByX3gJ47C2TPSK28BKmYb6XN3",
        "EPYWTTtrLwQRy35MNxbNqjqu9KSeNoiwNrHKkAhc9qiX",
        "3Bhqucm3YRJMYbG8ie7ExnqrhkyCtHbnM1FGdhQDQW5h",
        "qnN3fBJ3oWYb5GNh8uVKgtCTX6Z2YFujxeFkBP14X5P",
        "wbYu8pHCvAW4F2RfUfg4oeUAdUryVWdfpAXKFqMWpR4",
        "BgGesa6T16wqshtBa1DbL9BXeWLthG2cJvtFUP7DXnQR",
        "2xmHstxYwSgcpVkjZMSXNr2jmAJqDMsTwMF99e92ZrYb",
        "321Myz2eJas8Jza9KhWtYGQDnjM5qBNqMfdUJYSBj4JX",
        "G3EMhqHfgRnDf824UfToGthSkNd3KSG1i9kke1BRPS9p",
        "zJZJEHir7DqFdo1gBQj4NXbW8CD7HjEuicbMuLJhrkv",
        "E8y1RjECWi4kb6uMhz3SsaUKLMd6f3RiQSYUZS5P2FSF",
        "2QDrKnS5rbKSA6dEZrqiyNP216WSBVDA85Q78yFr7t33",
        "AYcF2JRe5KzjGpfDDL8JCAMRTjFWF8JeTxiUVdEVi9Pr",
        "2itBDCPHDBGb848zGSHugtcHQ3VxAEAVo2tHnzaunhmM",
        "AdMypCxkngPMVH2SsXoEyqMsk4uRkscEfprV9bVZKSEi",
        "3tHkeUbM8y9CibcRgqd135EMvsiMRzqr788ANPRqPAWf",
        "DL8FnUdfyGSnyKrD3o798f8XxeLm55vCTiL5R2KP3b2U",
        "6bFWDWJx3S2vzdYgZ1mDFDDDQipctrdMZQrW7SoJBBEA",
        "2D6YwgZYBnWwv9nRuvWbWMcTa72UEmLztsULfzgEEA9g",
        "86ogPBrBPga6uBdFdV2Xd28GsDYM5ZPVjGSWicQZJpb7",
        "FQvFqcSdGWeecfk97bf8da3bVtsCrjAsBC5qovCg21Yv",
        "ApSpTitrKWS7ESigedzci91ZqWdgMx1MK3rQy8KMpaTW",
        "6KBCA1PjEjMpq2ywAViSWVxMKyaJRsGHdyvw2wY3D8S9",
        "DumcPzD48gHvipxgC7C3coYjXsh2rGuepRhjfbozb1yC",
        "2ZLo7QqRELq1wjfskKCrMM9kfWGJvG9gzBhjTXgE3Yea",
        "4XqhBXSnXNNpXWzziUdVsQsS1U2E2Tk44mtRtSEkddMH",
        "Ej2oTGbqTWaCuRs2xwjwGfJj9MZupWjzYTXJjebzpCEw",
        "G7YrRqKWy1XzCTcJ7XbDEaniUwoeqjnsdZxshDWYRVtN",
        "9mtH4Ctqw6wkCiB973juxbkXtuUbTQsp3nsJ49dHafTs",
        "HQunUWPPML1eBLU6p3NyjX3RkBSzHq62G1fa4oJC1iJv",
        "DcthG5hHnejEvweQ6FWRfpVNMnbSnsQaEqHyr5L4eHqp",
        "C3XkXzgHJEcqobMr8juzhwqw9bz6qpJJeTA5HKM9uDvG",
        "4UTGCnG64h3ZWJzQdRMLYG3oZaf1hgN6Y3TZkJeeSziq",
        "E7vcA55CsVpqCQ8aSivuC6WarbxfKr2a8XH7XHmMHg1r",
        "CDswpRSGJkgbCSLbUGRMRumHcGy9n7ZWdDgrWdxwy2Qn",
        "GS11QHArqL4zfB1mfGjKTX5aVdTDRfGAVzXQjDQxmUq7",
        "bzSLeFosZUnnj38dcis6X6AnGf1AMrAkf5XGd3pbkNj",
        "FdXoVu5odc5TYshEaJzWKkA2Lb3P1pUjEwE9f7SHxyBi",
        "6XK4pXKnhFgqgB9pLhJuoPneMeQSzzvrfDK99J8Mt1x7",
        "7z2xCgfoQpCwnjstdPVnq4NjDGn3zm1kQz7GgetPL1UN",
        "7yHDc8NNVo7EQyUpNGoWuSBswch7kwbJ35xtF7SwMBdu",
        "GhiF6MBpXn1Eia1QWvNhBJdM5LhagGib1tYV4rLGdAXk",
        "6wyqGbiUzipUDHNtLn4ATAVXBGpC5AdRPnExMjGdsaTQ",
        "EDRwYnSg2dQeu8kU6d9CuipdRXWWDx2Ufv3TcB4Sr3D8",
        "E6zFgYjHbRU33vZXEHMb7V8bXVmqtpDtsprnqtkvYjHQ",
        "2EvFaj53iALdHrGyDwT7dUVmDyewULhKnacjvDqVaGJ1",
        "Dgm244Pczoswe1m4ywGoG1ouWWMJHWVmvbin9hVzGDa2",
        "3C4wsb7rf2UqqGYHqtdDDsjzcffnrE1a7QaQuYHyY1mv",
        "2gcKyRrE38U66bdBsqKr8mfQpmaEMTcwgnuT8BDYQWuU",
        "4vRMxk5UeztVog3rN7cPAShi9F74FYcYQYTXg6gAQnCS",
        "B9joVmsa8QLUjzcZ5BYkoHoUGJ1Pr9rjgQk8XFky9kBH",
        "HFsHezxDkiWgagkQqvbW3pPY6BtzcYa9WZJ43fvjSYTa",
        "2Xn1mPNHaxksZzjVLJWaMxcvcmWxEkbq58dNJkEY96CK",
        "GdcK6TtpnKAypD2CNdmUMTZJEke6qVT4FZPCRPe9jkUT",
        "HN5n4jjH3dkWM4hEjcEfHpbgC5jB8tutQNC9FrPrE7ar",
        "kr4jxjXB9QyEJVqPQRmqqX29GADL3gKVZTjyHAUkD1c",
        "A59knB7sJCSxr7KRyYaN8NAoZaLMMyXoGGsEEaSvQnUC",
        "BgP8w3UxPAxeanRx88LBpnUN4znaRBKNVz9vHtQqzNJZ",
        "BTWcJP8dcsTmsQKt2ReUqc3iFPM61TTaExHxeATQSysw",
        "6zc3Rj36ES3C4LSGLgaUiCkZ2s1E8P7cxGnyuzfFvXw9",
        "BFbyjhtAdXJMH6iviaNTvdfFR5ioz7b8cu9g5ircuFcP",
        "99GXwppiNKq6dChNTjA1PGafxZv7myBn73FzuqZKQRsA",
        "A4M8k9vbTZwGgNX8p5M78iCCZUkWjDewSQmsrZUQ3LRa",
        "AdX1ingooRKu57DKRTh2bGFQg9g32LiFQZnHDcwzQrs1",
        "42ApdccP2kDn5VuxDWLbmtCb33bAfbo6HckXNaarwZqQ",
        "GrQRm6SmPBaxH4SGs15dXU5ErHpRfnDdmEd8n7sAr5QK",
        "785B25YTRu78JT1oE1EDrnMq5LcH3mUahU38bWuNv1oD",
        "4jC1yBgqdTU5soeL85b9bCNdPfPDNgCcaoPNLk3CnDMm",
        "FjK7AfN2LZfSomoZj7ZKTgitAsZaAnnHa7Cc7aznKBma",
        "qHpb3HCfpeWVgTtdut59frCjqyhgGNmb6XYg4YJMG6z",
        "54griUi9DwiUyfrnrXRCZUMa5urQvzAH1bF5oG32ipeS",
        "EDUxFRiewxRqLqgxVdfBHczEpqyjB9YJxHHR6AGmKB7v",
        "GFaTjDCESRCXUG9tjsACKqy6fb7SKunbJHXbYXjTjb1S",
        "6qbva3E5oXbiZ7dx4rj7iELVS5Rvbssokf9pSvLJctEa",
        "AqR54ww77xz9xytTwufJsia3XSYnNFJysYfNYVDfWoAK",
        "5no3zCFbTdjeoymNnjGNmpZFVjbq91tqDU5RspMj9rbn",
        "Xgqy66kRFyrMz6i2moctBuwuEqx2Y9RvsLBcA9ixiVH",
        "BC4Ky8qwZUg9bwBE6uG176yPwMsdCesb5hc4n4poh2r5",
        "ERizV5Xyhz3xybmprTWJYJvCv1FQ9kBBH2CuQiXEd6mW",
        "2Pyz88BTYUZSZdL9M763wRmFtTFxsG5zMFdXtE9br5qj",
        "CdpHjxSdFPKNsa95ch1EiWV5uquHs2ZyrvAmCEXc5Hss",
        "AKkveeRkAVDZxmReDM7aLtnB9SZESxnK7dGC6YHZPgR",
        "BkEzoHJ1SAbNe7U129zt3AKRhGcMvrqTk9UseLhwPqSG",
        "5ktP7bngyc6sX9KGd8ETonPH1fz9rpeXKaJZ5rYHFbj9",
    ];

// const CANDY_MACHINE_ID = "7PVFN7YbyZEaKcmysA6MNwt1GHJBUdXVvwAVLqX2UYuo"; //devnet
const CANDY_MACHINE_ID = "DjiCMwCepLYHnEE1hAzgXjnUTDAJcsiBTMaQA1GyxM2K"; //mainnet
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
    const wlStageDuration = 10; // minutes
    const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
    const [itemsRemaining, setItemsRemaining] = useState<number>();
    const [isActive, setIsActive] = useState(false);
    const [itemsRedeemed, setItemsRedeemed] = useState(0);
    const [itemsAvailable, setItemsAvailable] = useState(800);
    const [itemPrice, setItemPrice] = useState<number>(0.44);
    const [isWLUser, setIsWLUser] = useState(false);

    useEffect(() =>
    {
        if (wallet.connected)
        {
            console.log("Connecting wallet... state:", wallet.connected);
        }

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
            console.log("User Wallet:", anchorWallet?.publicKey.toString());
            const cndy = await getCandyMachineState(anchorWallet as Wallet, new PublicKey(CANDY_MACHINE_ID), connection);
            let active = cndy?.state.goLiveDate ? cndy?.state.goLiveDate.toNumber() < new Date().getTime() / 1000 : false;
            let presale = false;
            let isWLUser = wlList.includes(anchorWallet?.publicKey.toString()!);
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
            setItemPrice(cndy.state.price.toNumber()/LAMPORTS_PER_SOL);

            console.log(`${CANDY_MACHINE_ID} Candy State: itemsAvailable ${cndy.state.itemsAvailable} itemsRemaining ${cndy.state.itemsRemaining} itemsRedeemed ${cndy.state.itemsRedeemed} isSoldOut ${cndy.state.isSoldOut} isWL ${isWLUser} isActive ${isActive}`);
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
        console.log("isWLUser:", isWLUser);
        console.log(`is CM Active? ${isActive}`, new Date(Number(candyMachine?.state!.goLiveDate!.toNumber()) * 1000).toISOString());

        const mintAmount : number = parseInt(mint);
        const totalCost : BN = new BN(mintAmount).mul(candyMachine?.state!.price!);
        const totalCostSOL = totalCost.toNumber() / LAMPORTS_PER_SOL;

        const userBalance : BN = new BN(await connection.getBalance(wallet!.publicKey!));
        const userBalanceSOL = userBalance.toNumber() / LAMPORTS_PER_SOL;

        const isUserHasBalance = userBalance.gte(candyMachine?.state!.price!);
        console.log(`Trying to mint ${mintAmount} with cost ${totalCostSOL} SOL, userBalance: ${userBalanceSOL} SOL`);
        console.log(`User has balance? ${isUserHasBalance}`);

        //const mint_date = new Date("Mon, 07 Nov 2022 19:57:00 UTC").getTime(); // debug
        //const now = new Date("Thu, 10 Nov 2022 17:11:59 UTC").getTime(); // debug

        const mint_date = MintDate.getTime();
        const now = new Date().getTime();
        const diff = moment.duration(moment(now).diff(moment(mint_date)));
        const diffMS = diff.asMilliseconds();
        const diffMins = diffMS / 1000 / 60;

        //console.log(diff)
        console.log("Minutes from mint:", diffMins)
        const timePassedFromMint = diffMins;

        const isWlStageActive = timePassedFromMint <= wlStageDuration;
        console.log("isWlStageActive" , isWlStageActive, "timePassedFromMint", timePassedFromMint, "wlDuration", wlStageDuration);

        if (timePassedFromMint < 0)
        {
            toast.dismiss();
            toast.error(`Mint is not live yet.`, {theme: "dark"});
            return;
        }

        if (isWlStageActive && !isWLUser)
        {
            toast.dismiss();
            toast.error(`Wallet not whitelisted, please wait for public stage.`, {theme: "dark"});
            return;
        }

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
                                    <span className={style.can}>WUUT?</span>{" "}
                                    <span className={style.deez}>MICE!</span>{" "}
                                    <span className={style.kits}>YACH!</span>{" "}
                                    <span className={style.fit}>OR</span>{" "}
                                    <span className={style.yr}>YUM?</span>{" "}
                                    <span className={style.wallet}>
                                        {/* <img src={Images?.walletGlitch} alt="wallet-glitch"/> */}
                                    </span>
                                    <span className={style.gt_entity}>&gt; </span>
                                </Box>
                            </>
                        ) :(
                            <CommonTitle MintDate={MintDate}/>
                        )}
                    </Box>
                    <Box className={style.deezkits_logo_content_wrapper}>
                        <Box className={style.deezkits_content_logo}>
                            <img src={Images?.logoTrasnsparent} alt="deezkits-mint-title" />
                        </Box>
                        {isMintState && <Box className={style.progress_wrapper}>
                            <Box className={style.progress_bar}>
                                <Box
                                    className={style.progress_bar_inner}
                                    sx={{
                                        width: `${((100 * itemsRedeemed) / itemsAvailable)}%`,
                                    }}
                                ></Box>
                            </Box>
                        </Box>
                        }
                    </Box>
                    {isMintState ? (
                        <>
                            <Box className={style.sold_mint_wrapper}>
                                <Typography className={style.sold_mint_text}>
                                    {itemsRedeemed} / {itemsAvailable} SOLD
                                </Typography>
                                <Typography className={style.mint_text}>
                                    MOUSE WL CAN MINT 10 MINUTES EARLIER
                                </Typography>
                            </Box>
                            <Box className={style.mint_button_wrapper}>
                                    
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

                            <Typography className={`${style.desc_text} ${style.mint_price_text}`}>
                                <HighlightedText className="highlightedText">
                                    Price{" "}
                                </HighlightedText>{" "}
                                - {itemPrice} SOL
                            </Typography>

                            <Typography  className={`${style.desc_text} ${style.amount_text}`}>
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
                                sx={{marginBottom: "5px"}}
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
