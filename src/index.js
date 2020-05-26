import React, { useEffect, useState, Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import LoadingPage from "./views/LoadingPage/LoadingPage.jsx";
import bg1 from "assets/img/3_XT208535.webp"; 
import LoadingRouterInsta from "LoadingRouter.jsx";

import "main.scss"
 
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
 
  let myImg = <img src={bg1} style={{position:"absolute",  width:1, height:1 , opacity:0.01}} />;
  return (
    <div className="body">
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
    