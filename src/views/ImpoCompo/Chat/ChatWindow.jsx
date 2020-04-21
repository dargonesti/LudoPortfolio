import React, {
  useState, useEffect, useRef
} from "react";

import Collapsable from "../CollapsableSection";

import { Button, Fade } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

import ChatMessageHistory from "./ChatMessageHistory";
import NewChatMessage from "./NewChatMessage";

import impoTxt from 'texts/localization';
import utils from "utils/utils";
import DAL from "utils/DataAccess/DALimpotx";
import auth from "utils/auth";
import localData from "utils/DataAccess/localData";

const WINDOW_WIDTH = 300;

const ChatWindow = ({ winNumber = 0, startHidden, userId, firebaseData, classes }) => {
  let [startOpen, setStartOpen] = useState(localData.getStorage("ChatWindowOpen" + winNumber));
  let [messages, setMessages] = useState(localData.get("chatCache") || []);
  let [loadedOlder, setLoadedOlder] = useState(localData.get("loadedOlder"+userId));
  
  let messageListRef = useRef(null);
  let [closed, setClosed] = useState(() => {
    if (userId) {
      return startHidden || (localData.getStorage("chatWindowClosed") || []).some(item => item === userId);
    }
    return (startHidden || localData.getStorage("chatWindowClosed")) ? true : false;
  });
  let close = () => {
    setClosed(true);
    if (auth.isAdmin()) {
      localData.setStorage("chatWindowClosed", [...(localData.getStorage("chatWindowClosed") || []), userId]);
    } else {
      localData.setStorage("chatWindowClosed", true);
    }
  }
  var nbAdmins = utils.getFB(firebaseData, "adminCount") || 0;
  //localData.getStorage("ChatAdminCount");

  let user = DAL.getCachedUser(userId);

  let myMessages = messages;
  if (userId) {
    myMessages = messages[userId] || [];
  }

  useEffect(() => {
    utils.addListener("receivedMessage", "chatWindow" + userId, (newMessage) => {
      utils.log("ReceivedNewMessage! - " + newMessage);
      utils.log(newMessage);
      setMessages(localData.get("chatCache") ||[]);
      if(newMessage.isAdmin ^ auth.isAdmin()){
        //Force Open
        console.log("Should open chat window");
      }
    });

    if (messageListRef && messageListRef.current){
      messageListRef.current.scrollTop = 999999;
    }
    return () => {
      utils.removeListener("receivedMessage", "chatWindow"+ userId);
    }
  }, [myMessages, messages]);

  const isDisabledNoAdmin = ()=>((!userId && !(nbAdmins > 0)) ? true : false);

  if (closed || !utils.isChatActive()) return null;

  return (
    <div style={{ right: WINDOW_WIDTH * winNumber + 5 * (winNumber + 1) }} className={classes.chatWindow}>
      <Collapsable onOpen={(isOpen) => {
        localData.setStorage("ChatWindowOpen" + winNumber, isOpen);
      }} inverseIcons startOpen={startOpen && !isDisabledNoAdmin()} 
      titre={ (isDisabledNoAdmin()?impoTxt.chatNoAdmins : impoTxt.chatHead) + (user ? (" - " + user.username):"")}
      sousTitre={!auth.isAdmin()?(nbAdmins + " " + impoTxt.chatAdminsOnline):""}
      /*disabled={isDisabledNoAdmin()}*/
       >
        {/*<h5 className={classes.chatHeader}>Live Chat</h5>*/}

        <div ref={messageListRef}
          style={{
            overflowY: "auto",
            height: 234
          }}>
          {!loadedOlder && 
          <Button onClick={(ev)=>{
            utils.callEvent("showMoreMessages", userId);
            localData.set("loadedOlder"+userId, true);
            setLoadedOlder(true);
          }} >{impoTxt.chatVoirPlus}</Button>}

          <ChatMessageHistory messages={myMessages} />
          <ul style={{ marginTop: 0 }}>
            {/*
                messages.map(msg => <li key={msg + i++}>{msg}</li>)
                */}
          </ul>
        </div>

        <div className={classes.newMessage}>
        {isDisabledNoAdmin() ? (
          <Button onClick={(ev)=>{
            auth.showToast(impoTxt.chatRequestSent)
            DAL.notifyAdminRequested(userId || auth.getActiveUserId)
          }} >{impoTxt.chatDemandeAdmin}</Button>
        ) : 
          <NewChatMessage lastMessage={myMessages[myMessages.length-1]} username={user?user.username:null} replaceOnSent={(message) => {
            utils.callEvent("sendChatMessage", {message, targetUser:userId});
          }} />}
        </div>
      </Collapsable>
      <Button style={{ position: "absolute", top: 0, right: 0 }}
        onClick={() => close()} >
        x
        </Button>
    </div>
  );
};

const messagesStyle = {
  chatWindow: {
    position: "fixed",
    right: 5,
    bottom: 5,
    width: WINDOW_WIDTH,
    //height: 345,
    padding: 10,
    backgroundColor: "rgba(250,250,250,0.8)",// "#fffd",
    borderRadius: 4,
    border: "solid 1px black",
    "& h3": {
      marginTop: 0,
      marginBottom: 0,
      "& button": {
        padding: "6px 0px 0px 0px",
        margin: "0px -5px -15px -5px"
      }
    }
  },
  chatHeader: {
    marginTop: 0
  },
  newMessage: {
    // position: "fixed", 
    // backgroundColor: "#fff",
    // bottom: 5
  }
};

export default withStyles(messagesStyle)(ChatWindow);