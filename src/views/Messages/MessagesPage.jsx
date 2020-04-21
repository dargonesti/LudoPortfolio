/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { Fragment, useState, useEffect } from "react";
import WrapingImpotPage from "HoC/WrapingImpotPage.jsx";
import impoHOC from "HoC/impoHOC.js";
import withStyles from "@material-ui/core/styles/withStyles";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import { Collapse, Typography, IconButton, withWidth } from '@material-ui/core';

import { ExpandMore, ExpandLess } from "@material-ui/icons";
//import QuestionList from "./QuestionList.jsx"
import DAL from "utils/DataAccess/DALimpotx.js";
import utils from "utils/utils.js";
import auth from "utils/auth.js";
import localData from "utils/DataAccess/localData";
import impoTxt from 'texts/localization';
import { values, map, filter, compose } from "rambda";

import messagesPageStyle from "assets/jss/material-kit-react/views/messagesPage.jsx";

import 'react-block-ui/style.css';

const mapComp = compose(values, map);

function onNotifClick(notif, setRedirect) {
    auth.setScrollTarget(notif);

    DAL.getUser(auth.isAdmin() ? notif.user : "me")
        .then((res) => {
            localData.setStorage("currentUserId", res._id);
            localData.setStorage("selectedUser", res);
            setRedirect("/user-summary-page");
        })
        .catch(ex => {
            auth.showToast(impoTxt.toastErrFindUser);
        });
}
const UserNotifs = ({ userid, notifs, setRedirect, isProcessing }) => {
    const [opened, setOpen] = useState(false);
    var nbNotifs = notifs ? notifs.length : 0;
    var username = DAL.getCachedUser(userid);
    username = username ? username.username : impoTxt.notifsUserNotFound;
    var minMaxDates = ["0", "0"];
    var suffix = auth.isFr() ? "" : "en";

    if (notifs) {
        minMaxDates = notifs.reduce((prev, cur) => {
            cur = cur.reduce((prev, cur) =>
                [strMin(cur.createdAt, prev[0]).split("T").shift(),
                strMax(cur.createdAt, prev[1]).split("T").shift()], ["9999-99-99", "0000-00-00"]);
            return [
                strMin(cur[0], prev[0]),
                strMax(cur[1], prev[1])];
        }, ["9999-99-99", "0000-00-00"]);
    }
    var unSeulJour = minMaxDates[0] == minMaxDates[1];
    utils.log("User " + username + " ouvert= " + (opened ? "true" : "false"));
    var byMsg = auth.isAdmin() ? impoTxt.notifsBy : impoTxt.notifsByUser;
    if(isProcessing)
    byMsg = impoTxt.notifsYearsToProcess;

    console.log("Collapse is : " + !!opened)
    return (<Fragment key={userid + (!!opened)} >
        <Typography component="h5" variant="h5">
            <IconButton onClick={() => {
                //var opened = openedNotifs;
                //opened[userid] = opened[userid] ? false : true;
                setOpen(!opened);
            }}>
                {opened ? <ExpandLess />
                    : <ExpandMore />}
            </IconButton>
            {nbNotifs} {byMsg} <b>{username}</b> {isProcessing ? "" : 
            (impoTxt.notifsDatant +  minMaxDates[0] + (!unSeulJour ? " à " + minMaxDates[1]:""))}</Typography>

        <Collapse in={!!opened}>
            {notifs.map(msgList => {
                let msg = msgList[0];
                if(isProcessing){
                    return <ProcessingLine setRedirect={setRedirect} msg={msg} />;
                }
                if (msg.doc) {
                    return <MessageDoc msg={msg} setRedirect={setRedirect} />;
                } else {
                    return <MessageQuestion msg={msg} suffixEn={suffix} setRedirect={setRedirect} />;
                }
            })}
        </Collapse>
    </Fragment>);
}

const MessageQuestion = ({ msg, suffixEn, setRedirect }) => {
    var qst = DAL.getQuestionById(msg.question);
    if (qst)
        return (<Typography key={msg.user + msg.question} component="p" >{impoTxt.Question}
            <a href="/user-summary-page" onClick={(e) => {
                e.preventDefault();
                onNotifClick(msg, setRedirect);
            }} >
                <i>
                    {qst["titre" + suffixEn]}</i>
            </a> : <b>{msg.texte}</b></Typography>);
    //utils.log("qst null : " + msg.question + " -  " + msg.texte);
    return null;
}

const ProcessingLine = ({ msg, setRedirect }) => {
    
    return (<Typography key={msg.user + msg._id} component="p">{impoTxt.notifsReadyToProcess}
        <a href="/user-summary-page" onClick={(e) => {
            e.preventDefault();
            onNotifClick(msg, setRedirect);
        }} >
             <b>{msg.annee}</b></a></Typography>);
}

const MessageDoc = ({ msg, setRedirect }) => {
    var usr = (auth.isAdmin() ? DAL.getCachedUser(msg.user) : auth.getUserInfo());
    var doc = usr.fileuploads.find(file => file._id === msg.doc);
    var category = doc ? doc.category : "";
    category = DAL.getDocCategory(category);
    doc = doc ? doc.titre : "";
    doc = doc || "-sans titre-";

    return (<Typography key={msg.user + msg.doc} component="p" >{impoTxt.Doc}
        <a href="/user-summary-page" onClick={(e) => {
            e.preventDefault();
            onNotifClick(msg, setRedirect);
        }} >
            <i>{doc}</i>
        </a>,{impoTxt.notifsDeType}"{category}" : <b>{msg.texte}</b></Typography>);
}

const MessagesPage = ({ setRedirect, firebaseData }) => {
    const [notifications, setNotifications] = useState({});
    const [etatTests, setIsTest] = useState({});
    //const [openedNotifs, setOpenNotif] = useState({});

    useEffect(() => {
        DAL.getFormatedNotifications()
            .then(setNotifications);
        DAL.getAdminValPerKey("isTest").then(setIsTest);

        localData.checkLocalDataAdmin();
    }, []);

    function IsTest(userId) {
        let usrIsTest = etatTests && etatTests[userId];
        usrIsTest = usrIsTest && usrIsTest.isTest;
        return !!(usrIsTest && usrIsTest.val);
    }

    return (
        <WrapingImpotPage firebaseData={firebaseData}>
            <GridContainer justify="center">
                <GridItem xs={12} md={12}>
                    <h1>{impoTxt.notifsTitre}</h1>
                </GridItem>
                <GridItem xs={12} md={12}>
                    <p>{impoTxt.notifsIntro}</p>
                    {mapComp(
                        (val, user) => (<UserNotifs isProcessing setRedirect={setRedirect} userid={user} notifs={val} />),
                        filter(n=>!IsTest(n[0][0].user), notifications.notifsProcessing))}
                    {mapComp(
                        (val, user) => (<UserNotifs setRedirect={setRedirect} userid={user} notifs={val} />),
                        filter(n=>!IsTest(n[0][0].user), notifications.byUser))}
                    <i>{impoTxt.notifsComptesTest}</i><br />
                    {mapComp(
                        (val, user) => (<UserNotifs isProcessing setRedirect={setRedirect} userid={user} notifs={val} />),
                        filter(n=>IsTest(n[0][0].user), notifications.notifsProcessing))}
                    {mapComp(
                        (val, user) => (<UserNotifs setRedirect={setRedirect} userid={user} notifs={val} />),
                        filter(n=>IsTest(n[0][0].user), notifications.byUser))}

                </GridItem>
            </GridContainer>
        </WrapingImpotPage>
    );
}

function strMin(a, b) {
    return a < b ? a : b;
}
function strMax(a, b) {
    return a > b ? a : b;
}

export default withWidth()(withStyles(messagesPageStyle)(impoHOC(MessagesPage, "MessagesPage")));