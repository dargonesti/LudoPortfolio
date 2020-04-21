/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import docsItemStyle from "assets/jss/material-kit-react/views/docsItem.jsx"; 
import { TextField, InputLabel, Select } from '@material-ui/core';
import Card from "components/Card/Card.jsx";
import { CardContent, Typography, IconButton, } from '@material-ui/core';

import { CloudUpload, } from "@material-ui/icons";

import classNames from 'classnames';
import Dropzone from "react-dropzone";

import { useShallowEqual } from 'shouldcomponentupdate-children'; // Peut être enlevé mais est supposé aider les performances
import BlockUi from 'react-block-ui';

import axios from "axios";
import utils from 'utils/utils';
import auth from 'utils/auth';
import DAL from 'utils/DataAccess/DALimpotx';
import localData from "utils/DataAccess/localData";

import impoTxt from 'texts/localization';
 
const dropzoneStyle = {
    width: 130,//200,//"100%",
    height: "50%",
    margin: 5,
    border: "2px dashed green",
    borderRadius: 5
};


class NewDocAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            titre: "",
            desc: "",
            newFile: null,
            modal: false,
            blocking: false,
            typeNewDoc: "",
            montant: 0,
            progress: 0
        }

        this.onDrop = this.onDrop.bind(this);
        this.onSave = this.onSave.bind(this);
        this.handle = this.handle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeGeneric = this.handleChangeGeneric.bind(this);
        this.handleUploadProgress = this.handleUploadProgress.bind(this);
    }

    componentDidMount() {
        if (this.props.file == null)
            utils.addListener("uploadProgress", "docUpload", this.handleUploadProgress);
    }
    componentWillUnmount() {
        if (this.props.file == null)
            utils.removeListener("uploadProgress", "docUpload");
    }
    handleUploadProgress() {
        var progress = localData.get("uploadProgress");
        if (!(progress > 0 && progress <= 1))
            progress = 0;
        this.setState({ progress: progress });
    }

    handleChange = event => {
        utils.log(event);
        if (event.target)
            this.setState({
                [event.target.id]: event.target.value
            });
    }

    handleChangeGeneric = name => event => {
        var newVal = event.target.value;
        this.setState({ [name]: newVal });
    }

    // <Collapse collapsedHeight={50} in={false} timeout={{ enter: 666, exit: 2222 }}>
    onDrop(acceptedFiles, rejectedFiles) {
        var file = acceptedFiles.pop();

        this.setState({ newFile: file });
    }

    onSave() {
        utils.log(this.state.typeNewDoc);
        if (this.state.typeNewDoc) {
            this.handle(this.state.titre, this.state.typeNewDoc, this.state.montant, this.state.newFile);
        }
        else {
            auth.showToast(impoTxt.toastNeedCategory, 2341, "danger");
        }
    }

    handle(titre, cat, montant, file) {
        var that = this;
        var annee = DAL.getAnnee("docs");//this.state.annee;

        //TODO : Block UI with a Loader
        // npm install --save react-block-ui
        // https://availity.github.io/react-block-ui/

        this.setState({ blocking: true });

        const data = new FormData();
        data.append('file', file);
        data.append('filename', file.name);

        var serveurPath = process.env.REACT_APP_SERVER_URL + "/"; // localhost:8080

        axios.post(serveurPath + 'upload', data, {
            onUploadProgress: (data) => {
                localData.set("uploadProgress", data.loaded / data.total);
                utils.callEvent("uploadProgress");
            }
        })
            .then(function (response) {
                utils.log(response);
                //this.setState({ imageURL: `http://localhost:8000/${body.file}`, uploadStatus: true });
                that.setState({ imageURL: serveurPath + response.data.file, uploadStatus: true });
                utils.log("Saving files to Strapi.");

                DAL.saveFile(titre, cat, montant, response.data.file, annee, localData.getStorage("currentUserId"))
                    .then(res => {
                        that.setState({ blocking: false });

                        if (that.props.onSave) {
                            that.props.onSave();
                        }
                        that.setState({
                            newFile: null,
                            desc: "",
                            titre: "",
                            montant: 0
                        });
                    }).catch(ex => {
                        utils.log(ex);
                        that.setState({ blocking: false });
                    });
            })
            .catch(function (error) {
                utils.log(error);
            });//*/
    }

    render() {
        const { classes } = this.props;
        const { blocking } = this.state;
        var that = this;

        var stateClass = classes.defaultPaper;
        if (this.props.isTarget) {
            stateClass = classes.SelectedPaper;
        }
        else if (this.props.hasNotification) {
            stateClass = classes.NotificationPaper;
        }

        return (

            <BlockUi tag="div" blocking={blocking} style={{ width: "100%" }}>
                <Card className={[classes.card, stateClass].join(" ")}>
                    <div className={classes.details}>
                        <CardContent className={classes.content}>

                            <InputLabel htmlFor="age-native-simple">{impoTxt.Type}</InputLabel>
                            <Select
                                style={{ marginLeft: 10 }}
                                className={classNames(classes.textField, classes.dense)}
                                id="typeNewDoc"
                                value={this.state.typeNewDoc}
                                onChange={this.handleChangeGeneric("typeNewDoc")}
                            >
                                {DAL.getAdminFile().map(cat => <option value={cat.idperso} key={cat.idperso}>{cat.titre}</option>)}
                            </Select>

                            <br />

                        </CardContent>
                        <div className={classes.controls}>
                            <TextField
                                style={{ marginBottom: 20, marginLeft: 30 }}
                                onChange={(ev) => {
                                    that.handleChange(ev);
                                }}
                                className={classNames(classes.textField, classes.dense)}
                                label={impoTxt.docTitre}
                                id="titre"
                            />
                            {(this.state.progress > 0 && this.state.progress < 1) &&
                                (<Typography component="span" variant="body1" style={{ margin: "auto" }}>
                                    {Math.floor(this.state.progress * 100)} / 100%
                  </Typography>)}
                        </div>
                    </div>

                    <div className={classes.details} style={{ alignItems: "center" }}>
                        <Dropzone
                            style={dropzoneStyle}
                            inputProps={{
                                style: {
                                    width: "inherit"
                                }
                            }}
                            onDrop={(files) => this.onDrop(files)}>
                            <div style={{ paddingTop: 0, textAlign: "center" }}>
                                {this.state.newFile ?
                                    this.state.newFile.name : impoTxt.docDragDrop
                                    // "Drag/Drop || Click"
                                }
                            </div>
                        </Dropzone>
                        <div>
                            <IconButton disabled={this.state.newFile ? false : true} onClick={this.onSave}>
                                <CloudUpload />
                            </IconButton>
                        </div>
                    </div>
                </Card>
            </BlockUi>
        );
    }
}
 
export default withStyles(docsItemStyle)(useShallowEqual(NewDocAdmin));
