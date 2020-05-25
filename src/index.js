import React, { useEffect, useState, Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import LoadingPage from "./views/LoadingPage/LoadingPage.jsx";

import "main.scss"
 
const minTimeImport = (target, minTime)=>lazy(() =>  Promise.all([
  target,
  new Promise(res => setTimeout(res, minTime || 0))
])
.then(([moduleExports]) => moduleExports)
)
 
const LoadingRouter = minTimeImport(import("LoadingRouter.jsx"), 20); 

console.log(process.env); 

const MainRouter = (props) => {
 
  return (
    <div className="body">
      <Suspense fallback={<LoadingPage />}>
        <LoadingPage loaded /> 

        <LoadingRouter />
      </Suspense>
      </div>);
  };
  
  ReactDOM.render(
  <MainRouter />,
      document.getElementById("root")
    );
    registerServiceWorker();
    