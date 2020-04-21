
import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx"; 

import MessageBlock from "./MessageBlock";

import auth from "utils/auth";
 
var style = {
    contentAlign:"Right",
    paddingBottom:10
};

const MessageHistory = ({messages}) => (<div style={style}>
            {Array.isArray(messages) ? 
            messages
                .map(msg => {
            return <MessageBlock key={msg.createdAt} titre={msg.titre} texte={msg.texte} dateSent={msg.createdAt} fromSelf={(msg.admin ? false : true ) ==  auth.isAdmin()} />}) 
        :
        "Messages is not an array"}
        </div>);
    
export default withStyles(basicsStyle, { withTheme: true })(MessageHistory);