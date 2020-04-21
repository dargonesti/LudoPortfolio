import firebase from "./DataAccess/initializedFirebase.js";// "firebase";
import fbApi from "firebase";
import debounce from "lodash.debounce";
import { keys, length, map, forEach, filter, flatten, groupBy, uniqWith, values } from "rambda";

import utils from "utils/utils";
import auth from "utils/auth";
import localData from "utils/DataAccess/localData";
import DAL from "utils/DataAccess/DALimpotx";
import impoTxt from 'texts/localization';
//firebase.initializeApp(firebaseConfig);

var username = localData.getStorage("username");

var socket = null;

var rawChatMessages = {};
var adminChatRef = {};
var adminChatRooms = {};
var adminInRooms = null;
var userChatRef = null;

var usersLastMessage = {};

var activeUsers = { admins: {}, users: {} };

function resetChatRefs() {
  forEach((v, k) => v.off(), adminChatRef);
  adminChatRef = {};
  adminChatRooms = {};
  rawChatMessages = {};
  usersLastMessage = {};
  activeUsers = { admins: {}, users: {} };

  if (adminInRooms) {
    adminInRooms.off();
    adminInRooms = null;
  }
  if (userChatRef) {
    userChatRef.off();
    userChatRef = null;
  }
}

function getChatRef(uid, msgCount, olderThanToday) {
  var ref = firebase.database().ref(`/chatRooms/${uid}`)
    .orderByChild("createdAt")
  if (olderThanToday) {
    // ref = ref.endAt(Date.now() - 24 * 60 * 60 * 1000);
  } else {
    ref = ref.startAt(Date.now() - 24 * 60 * 60 * 1000);
  }
  ref = ref.limitToLast(msgCount || 10);
  return ref;
  // .equalTo("online")
}


if (utils.isChatActive()) {
  const log = console.log;

  utils.addListener("registerToChat", "chatSocket", (newMsg) => {
    //if (auth.getUserInfo())
    //addSelf()
  });

  // Sends a chat message
  const sendMessage = (newMsg) => {
    var message = {
      //token: auth.getToken(),
      username,
      //targetUser: localData.get("currentUserId"),
      ...newMsg
    };
    //socket.emit('new message', message);
    if (auth.isAdmin()) {
      message.isAdmin = true;
      adminChatRef[newMsg.targetUser].ref.push({
        text: newMsg.message,
        adminId: firebase.auth().currentUser.uid,
        createdAt: fbApi.database.ServerValue.TIMESTAMP
      });
    } else {
      userChatRef.ref.push({
        text: newMsg.message,
        createdAt: fbApi.database.ServerValue.TIMESTAMP
      });
    }
  };

  utils.addListener("sendChatMessage", "chatSocket", sendMessage);

  //function setAndCacheMessages(newTxt, userId, me, closed) {
  function setAndCacheMessages(messageKey, message, userId, update) {
    var messages = localData.get("chatCache") || [];
    if (flatten(values(messages)).some(msg => msg.key == messageKey))
      return;

    var newMessage = {
      texte: message.text,
      createdAt: (new Date(message.createdAt)).toISOString(),
      me: !!message.adminId == auth.isAdmin(),
      closed: message.closed,
      key: messageKey
    };

    utils.log("setAndCacheMsg : ");
    utils.log(newMessage);

    var newMessages;
    if (userId) {
      newMessages = { ...messages };
      if (!(userId in newMessages)) newMessages[userId] = [];
      //if(update) newMessages[userId].pop();
      newMessages[userId].push(newMessage);
    } else {
      newMessages = [...messages, newMessage];
    }
    localData.set("chatCache", newMessages);
    //utils.log(newMessages);
    // setMessages(messages);
    //return newMessages;
  };

  utils.addListener("Login", "chatSocket", (params) => {
    console.log("Emit Login");
    //addSelf(params);
  });

  utils.addListener("Logout", "chatSocket", () => {
    console.log("Emit Disconnect");
    username = null;
    //socket.emit('user leave');
  });

  var _evDebouncer = {};
  var throttledCallEvent = (ev) => {
    if (!_evDebouncer[ev])
      _evDebouncer[ev] = debounce((value) => {
        utils.callEvent(ev, value);
      }, 500, { leading: true, trailing: true });
    return _evDebouncer[ev];
  };
  var debouncedCallEvent = (ev) => {
    if (!_evDebouncer[ev])
      _evDebouncer[ev] = debounce((value) => {
        utils.callEvent(ev, value);
      }, 500, { leading: false, trailing: true });
    return _evDebouncer[ev];
  };

  firebase.auth().onAuthStateChanged(function (user) {
    resetChatRefs();
    utils.removeListener("openChatWithUser", "chatSocket");

    //resetChatData()?
    if (user) {
      var uid = firebase.auth().currentUser.uid;
      var isAdmin = auth.isAdmin();

      if (isAdmin) {
        utils.addListener("showMoreMessages", "chatSocket", async (userId) => {
          try {
            let user = await DAL.getUser(userId);
            // user = user[userId];
            let pastMessagesRef = getChatRef(user.username, 1000, true);

            //TODO : GetValueOnce instead
            pastMessagesRef.once("value", data => {
              let messages = data.val();
              var lastMessage = null;
              var resetedChatCache = localData.get("chatCache");
              resetedChatCache[userId] = [];
              localData.set("chatCache", resetedChatCache);
              for (let messageId in messages) {
                setAndCacheMessages(messageId, messages[messageId], userId);
                lastMessage = { key: messageId, val: () => messages[messageId] }
              }
              //setAndCacheMessages(data.val().text, null, !data.val().adminId);
              //setAndCacheMessages(data.key, data.val());
              if (lastMessage) {
                throttledCallEvent('receivedMessage')(lastMessage);
              }
            });
          }catch(ex){

          }
        });
        adminInRooms = firebase.database().ref(`/adminInChat`);
        adminInRooms.on("child_added", data => {
          //addCommentElement(postElement, data.key, data.val().text, data.val().author);
          adminChatRooms[data.key] = data.val();
          throttledCallEvent('adminEnterChat')(adminChatRooms);
        });
        adminInRooms.on("child_changed", data => {
          adminChatRooms[data.key] = data.val();
          throttledCallEvent('adminEnterChat')(adminChatRooms);
        });
        adminInRooms.on("child_removed", data => {
          delete adminChatRooms[data.key];
          throttledCallEvent('adminEnterChat')(adminChatRooms);
        });

        const listenToUserChat = (newUser) => {
          if(newUser._id == null) newUser._id = newUser.uid;
          localData.setStorage("userChatActive", uniqWith((x, y) => x._id == y._id
            , [{ _id: newUser._id, username: newUser.username }, ...localData.getStorage("userChatActive", [])]));
          if (!adminChatRef[newUser._id]) {
            if(!newUser.username) newUser.username = newUser._id;
            firebase.database().ref(`/adminInChat/` + newUser.username + "/" + firebase.auth().currentUser.uid)
              .set(fbApi.database.ServerValue.TIMESTAMP);

            adminChatRef[newUser._id] = getChatRef(newUser.username);
            adminChatRef[newUser._id].on("child_added", (data) => {
              rawChatMessages[newUser.username] = rawChatMessages[newUser.username] || {};
              rawChatMessages[newUser.username][data.key] = data.val();
              //setAndCacheMessages(data.val().text, newUser._id, !!data.val().adminId);
              setAndCacheMessages(data.key, data.val(), newUser._id);
              throttledCallEvent('receivedMessage')(data);
            });
            adminChatRef[newUser._id].on("child_changed", (data) => {
              rawChatMessages[newUser.username] = rawChatMessages[newUser.username] || {};
              rawChatMessages[newUser.username][data.key] = data.val();
              //setAndCacheMessages(data.val().text, newUser._id, !!data.val().adminId);
              setAndCacheMessages(data.key, data.val(), newUser._id);
              throttledCallEvent('receivedMessage')(data);
            });
          }
        };

        localData.getStorage("userChatActive", []).forEach(listenToUserChat);
        utils.addListener("openChatWithUser", "chatSocket", listenToUserChat);

        // Add active Users
        var statusRef = firebase.database().ref('/status/')
          .orderByChild("state")
          .equalTo("online");
        activeUsers = { admins: {}, users: {} };

        const fnAddUser = (data) => {
          if (data.val().isAdmin) {
            activeUsers.admins[data.key] = data.val();
          }
          else {
            var userData = activeUsers.users[data.key] || data.val();
            if (!userData.lastMsgRef) {
              const setLastMsgAndNotify = (lastMsg) => {
                userData.lastMsg = lastMsg.val();
                debouncedCallEvent("userSentMessage")(getRecentChatNotifications());
              }
              userData.lastMsgRef = getChatRef(data.key, 1);
              userData.lastMsgRef.on("child_added", setLastMsgAndNotify);
              userData.lastMsgRef.on("child_changed", setLastMsgAndNotify);
            }
            activeUsers.users[data.key] = userData;
          }
          debouncedCallEvent('userStatusChange')(activeUsers);
        };

        statusRef.on("child_added", fnAddUser);
        statusRef.on("child_changed", fnAddUser);
        statusRef.on("child_removed", (data) => {
          delete activeUsers.users[data.key];
          delete activeUsers.admins[data.key];
          debouncedCallEvent('userStatusChange')(activeUsers);
        });

      } else {
        utils.addListener("showMoreMessages", "chatSocket", (userId) => {
          let pastMessagesRef = getChatRef(uid, 1000, true);

          //TODO : GetValueOnce instead
          pastMessagesRef.once("value", data => {
            let messages = data.val();
            var lastMessage = null;
            localData.set("chatCache", []);
            for (let messageId in messages) {
              setAndCacheMessages(messageId, messages[messageId]);
              lastMessage = { key: messageId, val: () => messages[messageId] }
            }
            //setAndCacheMessages(data.val().text, null, !data.val().adminId);
            //setAndCacheMessages(data.key, data.val());

            throttledCallEvent('receivedMessage')(lastMessage);
          });
        });
        userChatRef = getChatRef(uid);

        localData.set("chatCache", []);

        userChatRef.on("child_added", data => {
          //setAndCacheMessages(data.val().text, null, !data.val().adminId);
          setAndCacheMessages(data.key, data.val());
          throttledCallEvent('receivedMessage')(data);
        });
        console.log(userChatRef);
      }
    }
  });
}

function closeMessage(username, messageKey) {
  const showErrMsg = () => auth.showToast(impoTxt.toastErrClosingMessage, 3213, "danger");
  if (firebase.auth().currentUser) {
    var messages = rawChatMessages[username];
    if (messages && messages[messageKey] && !messages[messageKey].closed) {
      firebase.database().ref(`/chatRooms/${username}/${messageKey}`)
        .update({ closed: true });

      messages[messageKey].closed = true;
    }
  } else {
    showErrMsg();
  }
}

function getActiveUsers() {
  return activeUsers;
}

function getRecentChatNotifications() {
  if (activeUsers && activeUsers.users) {
    var notifs = map(statusData => statusData.lastMsg, activeUsers.users);
    notifs = filter((lastMsg, username) => {
      return lastMsg
        && !lastMsg.adminId && !lastMsg.closed
        && lastMsg.createdAt > Date.now() - 60 * 60 * 1000;
    },
      notifs);
    return notifs;
  }
  return {};
}

export {
  socket,
  closeMessage,
  getActiveUsers,
  getRecentChatNotifications
};