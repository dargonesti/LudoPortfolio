
import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx"; 

import MessageBlock from "views/Messages/MessageBlock";
 
var style = {
    contentAlign:"Right",
    paddingBottom:10
};

const MessageHistory = ({messages}) => {
console.log(messages);
return (<div style={style}>
            {Array.isArray(messages) ?
             messages.map(msg => <MessageBlock key={msg.createdAt} titre={msg.titre} texte={msg.texte} dateSent={msg.createdAt} fromSelf={msg.me ? false : true} />)
        :
        null }
        </div>);
}    
export default withStyles(basicsStyle, { withTheme: true })(MessageHistory);