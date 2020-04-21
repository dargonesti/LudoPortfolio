
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDFxbkpAP3Ce-Ev_bMwxkx6mFdN10HCgw4",
    authDomain: "support-chat-gnitic.firebaseapp.com",
    databaseURL: "https://support-chat-gnitic.firebaseio.com",
    projectId: "support-chat-gnitic",
    storageBucket: "support-chat-gnitic.appspot.com",
    messagingSenderId: "443930676845",
    appId: "1:443930676845:web:6a50807d190f2c32"
  };

export default firebase.initializeApp( firebaseConfig);