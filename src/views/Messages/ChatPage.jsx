/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { Fragment, useEffect, useState } from "react";
import { Redirect } from 'react-router-dom';
import WrapingImpotPage from "HoC/WrapingImpotPage.jsx";
import impoHOC from "HoC/impoHOC.js";
import withStyles from "@material-ui/core/styles/withStyles";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import { ExpandMore, ExpandLess } from "@material-ui/icons";
import CollapsableSection from "views/ImpoCompo/CollapsableSection.jsx";

import DAL from "utils/DataAccess/DALimpotx.js";
import utils from "utils/utils.js";
import auth from "utils/auth.js";
import localData from "utils/DataAccess/localData";
import impoTxt from 'texts/localization';
import { getActiveUsers, getRecentChatNotifications } from "utils/chatSocket.js";
import { keys, length, map, filter, compose, indexBy, flatten, groupBy, values } from "rambda";

import docsItemStyle from "assets/jss/material-kit-react/views/docsItem.jsx";

import { Button, Paper, Typography, IconButton, Dialog, DialogContent, DialogActions, Slide } from '@material-ui/core';

import 'react-block-ui/style.css';

const count = (obj) => keys(obj).length;
const mapComp = compose(values, map);

const ChatLine = ({ classes, notif, username, user }) => {

    /// Use : {display:"grid", pattern:"1fr 2fr 2fr 2fr 1fr", stretch:"left"}
    return (<>
        <Button style={{ float: "left", clear: "both" }} color="secondary"
            onClick={(ev) => {
                ev.preventDefault();

                var oldChatCache = localData.get("chatCache") || {};
                oldChatCache[user._id] = oldChatCache[user._id] || [];
                localData.set("chatCache", oldChatCache);
                utils.callEvent("openChatWithUser", user);
            }}>{impoTxt.chatAnswer}</Button>
        <Paper className={classes.details} >
            <Typography style={{
                marginLeft: 10 //width:123,
            }} component="h5" variant="h5">
                {username} :
        </Typography>

            <div style={{
                display: "flex", contentAlign: "center",
                justifyContent: "left", flexGrow: 1, marginLeft: 20
            }}>
                {notif.text}
            </div>
        </Paper>
    </>)
};

const OnlineUser = ({ user, fbUser, setRedirect }) => {
    // format chat for Impotx Users
    /// Use : {display:"grid-cell", size:2fr, stretch:"auto"}
    if (user)
        return (<div>
            <b>{user.username}</b> : <Button color="secondary"
                onClick={(ev) => {
                    ev.preventDefault();

                    var oldChatCache = localData.get("chatCache") || {};
                    oldChatCache[user._id] = oldChatCache[user._id] || [];
                    localData.set("chatCache", oldChatCache);
                    utils.callEvent("openChatWithUser", user);
                }}>{impoTxt.chatOpen}</Button>

            <Button color="secondary"
                onClick={(ev) => {
                    localData.setStorage("currentUserId", user._id);
                    localData.setStorage("selectedUser", user);

                    var oldChatCache = localData.get("chatCache") || {};
                    oldChatCache[user._id] = oldChatCache[user._id] || [];
                    localData.set("chatCache", oldChatCache);

                    utils.callEvent("openChatWithUser", user);

                    setRedirect("/user-summary-page");
                }}>{impoTxt.chatSeeFile}</Button>

        </div>);
    else {
        fbUser._id = fbUser.uid;

        return (<div>Non ImpotX user : <b>{fbUser.uid}</b> -
         <Button color="secondary"
                onClick={(ev) => {
                    ev.preventDefault();

                    var oldChatCache = localData.get("chatCache") || {};
                    oldChatCache[fbUser.uid] = oldChatCache[fbUser.uid] || [];
                    localData.set("chatCache", oldChatCache);
                    utils.callEvent("openChatWithUser", fbUser);
                }}>{impoTxt.chatOpen}</Button>

            <Button color="secondary"
                onClick={(ev) => {
                    localData.setStorage("currentUserId", fbUser.uid);
                    //localData.setStorage("selectedUser", fbUser);

                    var oldChatCache = localData.get("chatCache") || {};
                    oldChatCache[fbUser.uid] = oldChatCache[fbUser.uid] || [];
                    localData.set("chatCache", oldChatCache);

                    utils.callEvent("openChatWithUser", fbUser);

                    setRedirect("/user-summary-page");
                }}>{impoTxt.chatSeeFile}</Button>
        </div>);
    }
}

const ChatPage = ({ classes, firebaseData, setRedirect }) => {
    const [activeUsers, setUsers] = useState(getActiveUsers());
    const [users, setAllUsers] = useState([]);
    const [chatNotifs, setChatNotifs] = useState(getRecentChatNotifications());

    useEffect(() => {
        utils.addListener("userStatusChange", "ChatPage", setUsers);
        utils.addListener("userSentMessage", "ChatPage", (data) => {
            setChatNotifs(data);
        });

        DAL.getUsers().then(dalUsers => {
            setAllUsers(indexBy(usr => usr.username,
                values(dalUsers)));
        });

        return () => {
            utils.removeListener("userStatusChange", "ChatPage")
            utils.removeListener("userSentMessage", "ChatPage");
        };
    }, []);

    //localData.checkLocalDataAdmin();
    if (auth.isAdmin()) {
        return (<WrapingImpotPage firebaseData={firebaseData}>
            <h2>{impoTxt.chatHead}</h2>

            <CollapsableSection startOpen titre={impoTxt.chatCurrentExchanges}>
                {count(chatNotifs) > 0 ?
                    values(map((notif, username) => <ChatLine classes={classes} notif={notif} user={users[username]} key={username} username={username} />, chatNotifs))
                    :
                    <div>{impoTxt.chatNoCurrentMessages}</div>}
            </CollapsableSection>

            <CollapsableSection startOpen titre={impoTxt.chatUsersOnline}>
                {count(activeUsers.users) > 0 ?
                    map((username) => <OnlineUser key={username} fbUser={{ ...activeUsers.users[username], uid: username }} user={users[username]} setRedirect={setRedirect} />
                        , keys(activeUsers.users))
                    :
                    impoTxt.chatNoUsers}
            </CollapsableSection>
        </WrapingImpotPage>);
    }
    else {
        auth.showToast("Can't go there.", 3452, "danger");
        return <Redirect to="/" />;
    }
}

export default (withStyles(docsItemStyle)(impoHOC(ChatPage, "ChatPage")));