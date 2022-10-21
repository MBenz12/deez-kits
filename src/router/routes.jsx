import React, {Suspense, useEffect, useRef, useState} from "react";
import { Route, Routes } from "react-router-dom";
import Error from "../sharedComponent/Error";
import Loading from "../sharedComponent/Loading";
import Audio from '../sharedComponent/Audio'
import DeezSlotz from "../pages/deezslotz";
import Staking from "../pages/staking";
const Home = React.lazy(() => import("../pages/home/index"));
const Deezkits = React.lazy(() => import("../pages/deezkits/index"));

const Router = () => {
  const MusicRef = useRef(null);
  const [subDomain, setSubDomain] = useState(null);
  // const [isPlaying,setIsPlaying]=useState(false);

  useEffect(() => {
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("deezkits") ? -1 : -2);

    if (arr.length > 0) {
        setSubDomain(arr[0]);
    }
  }, []);

  return (
    <>
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<Loading />}>
          {
              subDomain === "staking" ? (
                  <Staking />
              ) : (
                  <Home />
              )
          }
          </Suspense>
        }
      ></Route>
      <Route
        path="/mint"
        element={
          <Suspense fallback={<Loading />}>
            <Deezkits isMint={true} ref={MusicRef} isMusicPlayer={true} />
          </Suspense>
        }
      ></Route>
      <Route
        path="/deezslotz"
        element={
          <Suspense fallback={<Loading />}>
            <DeezSlotz isMint={true} ref={MusicRef} />
          </Suspense>
        }
      ></Route>
      <Route
        path="/countdown"
        element={
          <Suspense fallback={<Loading />}>
            <Deezkits isMint={false} ref={MusicRef} isMusicPlayer={true}/>
          </Suspense>
        }
      ></Route>
      <Route
        path="/discord"
        element={<External link="https://discord.gg/deezkits" />}
      ></Route>
      <Route path="*" element={<Error />}></Route>
    </Routes>
    <Audio ref={MusicRef} />
    </>
  );
};

function External({ link }) {
  window.location.href = link;
  return null;
}

export default Router;
