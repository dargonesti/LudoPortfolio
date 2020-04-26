import React, { useEffect, useState, Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { StoreProvider } from 'utils/mobx/ConfigStore';

import indexRoutes from "routes/index.jsx";

import "assets/scss/material-kit-react.css?v=1.2.0";
import registerServiceWorker from "./registerServiceWorker";


console.log(process.env);

var hist = createBrowserHistory();

const MainRouter = (props) => {

  return (
    <StoreProvider>
      <Suspense fallback={<div className="initial-parent">  
      <div className="initial-loader" />
        </div>}>
        <Router history={hist}>
          <Switch>
            {indexRoutes.map((prop, key) => { //indexRoutes ou debounceRenderPages
              let Comp = prop.component;
              return <Route path={prop.path} key={key} render={(routeProps) => (
                <Comp />)} />;
            })}
          </Switch>
        </Router>
      </Suspense>
    </StoreProvider>);
  };
  
  ReactDOM.render(
  <MainRouter />,
      document.getElementById("root")
    );
    registerServiceWorker();
    
    
    
    /*
    var promptEvent = null;
    
window.addEventListener('beforeinstallprompt', (e) => {
        promptEvent = e;
     e.preventDefault();
     console.log("Showing prompt in 3 sec.");
  setTimeout(()=>{
        console.log("Showing Prompt");
      showA2HSPrompt();},
      3000);
  });
  
window.addEventListener('appinstalled', (e) => {
        //app.logEvent('a2hs', 'installed');`
        console.log("app installed.");
    })
    
function showA2HSPrompt() {
        promptEvent.prompt();
  promptEvent.userChoice.then((choiceResult) => {
        console.log(choiceResult.outcome);
    });
}*/