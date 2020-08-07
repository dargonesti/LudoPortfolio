import React, { useEffect, useState, Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import LoadingPage from "./views/LoadingPage/LoadingPage.jsx";
import bg1 from "assets/img/3_XT208535.webp"; 
import LoadingRouterInsta from "LoadingRouter.jsx";
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import { StoreProvider } from './Data/ConfigStore'
import { observer, useObserver } from 'mobx-react-lite';
import { useStore } from './Data/ConfigStore';

import "scss/main.scss"
//Check : https://www.youtube.com/watch?v=qm0IfG1GyZU for 10 x 1 line layout
//https://1linelayouts.glitch.me/
 
const minTimeImport = (target, minTime)=>lazy(() =>  Promise.all([
  target,
  new Promise(res => setTimeout(res, minTime || 0))
])
.then(([moduleExports]) => moduleExports)
)
 
//const LoadingRouter = minTimeImport(import("LoadingRouter.jsx"), 1612); 

console.log(process.env); 

const MainRouter = (props) => {
  let [imagesLoaded, setImagtesLoaded] = useState(false)
  let [scrollpercent, setScrollpercent] = useState(0);
  
  /* TODO Scrollbar : 
    progressHeight= 100* window.pageYOfset / totalH
  progressbar.style.height = progressheight+"%"
*/
window.onscroll = ()=>{
  console.log("scroll")
  setScrollpercent(100*window.pageYOffset / (document.body.scrollHeight- window.innerHeight));
}

  let myImg = <img src={bg1} style={{position:"absolute",  width:1, height:1 , opacity:0.01}} />;
  return (
    <div className="body">
      <div id="scrollPath"></div>
      <div id="progressbar" style={{height: scrollpercent + "%"}}></div>
        <LoadingRouterInsta />
      </div>);//*/

 /* return (
    <div className="body">
      <Suspense fallback={<LoadingPage />}>
        {false && myImg}
        <LoadingPage loaded /> 

        <LoadingRouter />
      </Suspense>
      </div>);//*/
  };
  
  ReactDOM.render(
  <MainRouter />,
      document.getElementById("root")
    );
    registerServiceWorker();
    