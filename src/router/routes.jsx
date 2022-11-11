import Hack from "pages/hack/Hack";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DeezSlotz from "../pages/deezslotz";
import Staking from "../pages/staking";
import Audio from '../sharedComponent/Audio';
import Error from "../sharedComponent/Error";
import Loading from "../sharedComponent/Loading";
import Mutation from 'pages/mutation';
const Home = React.lazy(() => import("../pages/home/index"));
const Deezkits = React.lazy(() => import("../pages/deezkits"));

const Router = () => {
  const MusicRef = useRef(null);
  const [subDomain, setSubDomain] = useState(null);

  useEffect(() => {
    const host = window.location.host;
    const arr = host.split(".");

    //console.log("SubDomain:" , arr);

    if (arr.length > 0) {
        setSubDomain(arr[0]);
    }
  }, []);

  return (
    <>
    <Routes>
      <Route path="/" element=
          {
              <Suspense fallback={<Loading />}>
              {
                  subDomain === "slotz" ? (<DeezSlotz isMint={true} ref={MusicRef} /> ) :
                  subDomain === "staking" ? (<Staking />) : (<Home />)
              }
              </Suspense>
          }>
      </Route>
      <Route path="/hack" element={<Hack />}></Route>
      <Route path="/mint" element={<Suspense fallback={<Loading />}><ToastContainer/><Deezkits isMint={true} ref={MusicRef} isMusicPlayer={true}/></Suspense>}></Route>
      <Route path="/deezslotz" element={<Suspense fallback={<Loading />}><DeezSlotz /></Suspense>}></Route>
      <Route path="/staking" element={<Suspense fallback={<Loading />}><Staking/></Suspense>}></Route>
      <Route path="/countdown" element={<Suspense fallback={<Loading />}><Deezkits isMint={false} ref={MusicRef} isMusicPlayer={true}/></Suspense>}>
      </Route>
      <Route path="/discord" element={<External link="https://discord.gg/deezkits" />}></Route>
      <Route path="/mutation" element={<Mutation />} />
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
