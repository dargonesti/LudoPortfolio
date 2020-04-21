import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";

import { TextField } from '@material-ui/core';
import Button from "components/CustomButtons/Button";

import { Send } from "@material-ui/icons";

import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx";

import BlockUi from 'react-block-ui';

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from "utils/auth.js";
import utils from "utils/utils";
import localData from "utils/DataAccess/localData";
import impoTxt from 'texts/localization';

import {closeMessage} from "utils/chatSocket";


class NewMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            titre: "",
            texte: "",
            sendingMessage: false
        };

        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.lastMsgToAnswer = this.lastMsgToAnswer.bind(this);
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    }

    sendMessage = ev => {
        if (this.state.texte.length > 1) {
            if (this.props.replaceOnSent) {
                this.props.replaceOnSent(this.state.texte);
                this.setState({texte:""});
            } else {
                this.setState({ sendingMessage: true });

                var userId = "";
                var adminId = "";
                if (auth.isAdmin()) {
                    userId = localData.getStorage("currentUserId");
                    adminId = auth.getUserInfo()._id;
                } else {
                    userId = auth.getUserInfo()._id;
                    adminId = null;
                }

                DAL.saveMessage({
                    titre: this.state.titre,
                    texte: this.state.texte,
                    question: this.props.question,
                    doc: this.props.doc,
                    user: userId,
                    admin: adminId
                })
                    .then(res => {
                        utils.log(res);
                        var txt = this.state.texte;

                        this.setState({
                            titre: "",
                            texte: "",
                            sendingMessage: false,
                        });
                        if (this.props.onSent)
                            this.props.onSent(txt);
                    });
            }
        }
        else {
            //Message toast, "plz écrivez un message pour en envoyer yun"
        }
    }

    lastMsgToAnswer(){
        var lastMsg = this.props.lastMessage;
        return lastMsg && !lastMsg.me && !lastMsg.closed;
    }

    render() {
        return (
            <BlockUi tag="div" blocking={this.state.sendingMessage} style={{
                marginLeft: 5,
                clear: "both",
                paddingTop: 10
            }}>
                {false && <TextField
                    label="titre"
                    value={this.state.titre}
                    onChange={this.handleChange('titre')}
                    type="text"
                />}

                <TextField
                    style={{ marginLeft: 10 }}
                    multiline={true}
                    rows={1}
                    rowsMax={8}
                    label="Envoyer Message"
                    value={this.state.texte}
                    onChange={this.handleChange('texte')}
                    type="text"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !(e.shiftKey)) {
                            utils.log(e);
                            this.sendMessage();
                            e.preventDefault();
                        }
                    }
                    }
                />
                <Button
                    color="transparent"
                    target="_blank"
                    justIcon
                    onClick={this.sendMessage}
                    disabled={this.props.user ? true : false}
                >
                    <Send />
                </Button>
                {auth.isAdmin() && this.lastMsgToAnswer() && (<Button onClick={(ev)=>{
                    ev.preventDefault();
                    closeMessage(this.props.username, this.props.lastMessage.key);
                }}
                style={{    width: 10, padding: "10px 20px", margin:0 }}
                >{impoTxt.notifsVoir}</Button>)}
            </BlockUi>
        );
    }
}


export default withStyles(basicsStyle, { withTheme: true })(NewMessage);