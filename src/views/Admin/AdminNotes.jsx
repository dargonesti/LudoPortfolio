
import React, { Fragment } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
 
import { Typography, TextField } from '@material-ui/core';

import { Send } from "@material-ui/icons";
import Button from "components/CustomButtons/Button.jsx";

import GridItem from "components/Grid/GridItem.jsx";

import messageStyle from "assets/jss/material-kit-react/views/messages.jsx";

import DAL from "utils/DataAccess/DALimpotx.js";
import impoTxt from 'texts/localization';

class AdminNotes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            /* PROPS : 
            titre:"",
            texte: "",
            dateSent:"",
            fromSelf: true*/
            newNote: "",
            donneesAdmin: {} 
        };

        this.onClick = this.onClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onSave = this.onSave.bind(this);
        //DAL.getDonneesAdmin(this.props.user._id, props.annee)
        //    .then(res => this.setState({ donneesAdmin: res[this.props.user._id] }));
    }

    onClick = ev => {
        this.setState({ open: !this.state.open });
    }

    onSave = ev => {
        this.onConfirm(true);
    }
    onConfirm = ev => {
        if (ev) {
            //saveDonneesAdmin: function (user, key, val) {
            DAL.saveDonneesAdmin(this.props.user._id,  this.props.annee, "NoteAdmin" + Date.now(), this.state.newNote)
                .then(res => {
                    //this.props.onChange(newQuestion, this.props.indQst) 
                    DAL.getDonneesAdmin(this.props.user._id,  this.props.annee)
                        .then(res => this.setState({
                            donneesAdmin: res[this.props.user._id],
                            newNote: ""
                        }));
                });
        }
    }

    getNotes() {
        var da = this.props.donneesAdmin;
        if (da)
            return Object.keys(da)
                .filter(key => key.startsWith("NoteAdmin") && da[key].val)
                .map(noteKey => da[noteKey]);
        else
            return [];
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    }

    render() {

        const { classes } = this.props;

        var classesCollapsedMsgs = [classes.collapseContainer, classes.textInBubble];
        if (!this.props.fromSelf)
            classesCollapsedMsgs.push(classes.ccNotMe);

        var buttonClasses = [classes.messageBlock,
        (this.props.fromSelf ? classes.mbMe : classes.mbNotMe)
        ];
        if (this.props.className)
            buttonClasses.push(this.props.className);

        buttonClasses = buttonClasses.join(" ");

        return (<Fragment>
            <h5>{impoTxt.Notes} : </h5>


            <GridItem xs={12} sm={12} md={12}>
                <TextField
                    style={{ marginLeft: 20, marginTop: 8, width: "calc(100% - 110px - 200px)" }}
                    id="standard-number"
                    label={impoTxt.adminAjouterNote}
                    value={this.state.newNote}
                    onChange={this.handleChange('newNote')}
                    type="text"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter')
                            this.onSave();
                    }}
                />
                <Button
                    color="transparent"
                    target="_blank"
                    justIcon
                    onClick={this.onSave}
                >
                    <Send />
                </Button>
            </GridItem>

            {this.getNotes()
                .map(note => {
                    return (<Typography variant="body1" key={note.createdAt}>
                        {note.createdAt.split("T").join(" ").split(".")[0]} -
                    from {note.admin} : <b>{note.val}</b>
                    </Typography>)
                })}
        </Fragment>
        );
    }
}


export default withStyles(messageStyle, { withTheme: true })(AdminNotes);