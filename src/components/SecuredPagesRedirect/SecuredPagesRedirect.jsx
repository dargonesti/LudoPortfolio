import React from "react";
import { Redirect } from 'react-router-dom';

import indexRoutes from "routes/index.jsx";

import auth from "utils/auth.js";
import DAL from "utils/DataAccess/DALimpotx.js";
import utils from "utils/utils.js";
import impoTxt from 'texts/localization';
import localData from "utils/DataAccess/localData";

function currentPageIsSecure() {
    var foundRoute = indexRoutes.find(route => window.location.href.endsWith(route.path));
    return foundRoute && foundRoute.secure;
}

class SecuredPagesRedirect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleGoogleAuth = this.handleGoogleAuth.bind(this);
        this.handleEmailConfirm = this.handleEmailConfirm.bind(this);
        this.handleSetLang = this.handleSetLang.bind(this);
    }

    handleGoogleAuth(param){
        if(isGoogleAuth(param)){
            localData.setStorage("googleTokens", param);
            DAL.authGoogle(param)
                .then(res => {
                    ///// COPIE / COLLÉ de LoginForm.jsx
                    auth.setToken(res.jwt, true); // True => body.rememberMe
                    auth.setUserInfo(res.user, true); // True => body.rememberMe

                    var conErr = ex => {
                        utils.log(ex);
                        auth.clearAppStorage();
                        auth.clearToken();
                        auth.clearUserInfo();
                        this.setState({ redirect: "/" });
                        auth.showToast(impoTxt.toastErrCon + ex.message, 5000, "danger");
                    };

                    DAL.getUser()
                        .then(res => {
                            utils.log(res);
                            this.setState({ successLogin: true });
                            auth.setUserInfo(res, true);
                            auth.showToast(impoTxt.toastWelcome);
                            if (auth.isAdmin()) {
                                var necessaryData = 0;
                                DAL.getUsers("ignoreCache").then(res => {
                                    if (necessaryData++ >= 1) {
                                        this.setState({ redirect: "find-user-page" });
                                    }
                                })
                                    .catch(conErr);
                                DAL.getQuestions("ignoreCache").then(res => {
                                    if (necessaryData++ >= 1) {
                                        this.setState({ redirect: "find-user-page" });
                                    }
                                })
                                    .catch(conErr);
                            } else
                                DAL.getQuestions("ignoreCache").then(res => {
                                    this.setState({ redirect: "questions-page" });
                                })
                                    .catch(conErr);

                        }).catch(conErr);

                })
                .catch(ex => {
                    utils.log(ex);
                });
        }
    }

    handleEmailConfirm(param){
        if(isEmailConfirm(param)){
            DAL.confirmEmail(param)
            .then((res)=>{
                auth.showToast(impoTxt.toastCompteValide);
            });
        }
    }

    handleSetLang(param){
        if(isSetLang(param)){
           localData.setStorage("prefLang", getLang(param));
        }
    }

    componentDidMount() {
        var param = getURLParam(this.props.Location || this.props.location || window.location.href);

        this.handleGoogleAuth(param);
        this.handleEmailConfirm(param);       
        this.handleSetLang(param);
    }

    render() {
        //console.log("loc : " + window.location);
        //console.log(auth.getToken());
        var loc = this.props.Location || this.props.location || window.location.href;

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }
        if (!currentPageIsSecure(loc) || auth.getToken()) {
            return null;
        } else {
            //TODO : Ajouter message dans localStorage
            return <Redirect to='/' />; // to='/page-require-login'
        }
    }
};

function isString(param){
    return typeof(param) === "string";
}

function stringFitsReg(param, reg){
    return isString(param) && reg.test(param);
}

function getURLParam(loc){ 
    var params = loc.split("?");

    if (params.length > 1) {
        return params.pop();
    }
    return null;
}

function isGoogleAuth(param){
    return stringFitsReg(param, /access_token.*/i);
}

function isEmailConfirm(param){
    return stringFitsReg(param, /confirmation.*/i); 
}

function isSetLang(param){
    return stringFitsReg(param, /lang.*/i); 
}

function getLang(param){
    if(isString(param) )
        return param.split("=").pop();
    return null;
}

export default SecuredPagesRedirect;

/*
ReactDOM.render(
 <Router history={hist}>
   <Switch>
     {indexRoutes.map((prop, key) => {
       return <Route path={prop.path} key={key} component={prop.component} />;
     })}
   </Switch>
 </Router>,
 document.getElementById("root")
);
*/