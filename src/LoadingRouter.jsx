import React, { useEffect, useState, Suspense, lazy } from "react"; 

//// TODO : Move these after the page loader
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { StoreProvider } from 'utils/mobx/ConfigStore';
import indexRoutes from "routes/index.jsx";


console.log(process.env);

var hist = createBrowserHistory();

const LoadingRouter = (props) => {

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
   
  

export default LoadingRouter;