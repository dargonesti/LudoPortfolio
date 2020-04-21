/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { Fragment } from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import docsItemStyle from "assets/jss/material-kit-react/views/docsItem.jsx";
// core components  
import { TextField, InputLabel, Select, FormControlLabel, Switch, CardContent, Typography, IconButton, Popover} from '@material-ui/core';
import Card from "components/Card/Card.jsx";

import { CloudUpload, ContactSupport } from "@material-ui/icons"; 

import classNames from 'classnames';
import Dropzone from "react-dropzone";

import { useShallowEqual } from 'shouldcomponentupdate-children'; // Peut être enlevé mais est supposé aider les performances
import BlockUi from 'react-block-ui';

import axios from "axios";
import auth from 'utils/auth';
import utils from 'utils/utils';
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

var i = 0;
const optionsFeuillets = DAL.getFeuillets().map(fl =>
    <option value={fl.idperso} key={fl.idperso + (i++)}>{fl.titre}</option>);
const optionsDepenses = DAL.getDepenses().map(fl =>
    <option value={fl.idperso} key={fl.idperso}>{fl.titre}</option>);

const formatList = ["jpg", "jpeg", "png", "pdf", "webp"];
const acceptedFormat = /^.*\.(jpg|jpeg|png|pdf|webp)$/i;

const DocTypeSelector = ({ labelText, options, value, idTxt, changeCB, classes }) => (<Fragment>
    <InputLabel htmlFor="age-native-simple">{labelText}</InputLabel>
    <Select
        style={{ marginLeft: 10 }}
        className={classNames(classes.textField, classes.dense)}
        id={idTxt}
        value={value}
        onChange={changeCB}
    >
        {options}
    </Select>
</Fragment>);

class NewDoc extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            titre: "",
            desc: "",
            newFile: null,
            modal: false,
            detailCompression: false,
            blocking: false,
            typeNewDoc: "feuillet",
            typeFeuillet: "",
            typeDep: "",
            montant: 0,
            progress: 0,
            shouldCompress: true
        }

        this.onDrop = this.onDrop.bind(this);
        this.isTypeSelected = this.isTypeSelected.bind(this);
        this.onSave = this.onSave.bind(this);
        this.handle = this.handle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeGeneric = this.handleChangeGeneric.bind(this);
        this.handleUploadProgress = this.handleUploadProgress.bind(this);
    }

    isTypeSelected(){
        return this.state.typeNewDoc == "feuillet" ? 
            this.state.typeFeuillet :
            this.state.typeDep;
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
        this.setState({ progress });
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
 
    onDrop(acceptedFiles, rejectedFiles) {
        var realAccepted = acceptedFiles.filter((file) => acceptedFormat.test(file.name));
        var wrongFormatFiles = acceptedFiles.filter((file) => !acceptedFormat.test(file.name)); 
    
        if (wrongFormatFiles.length > 0) {
          auth.showToast("Certains fichiers ne sont pas du bon format. Les formats acceptés sont : " + formatList.join(", ") + ".", 3000, "danger");
        } 
    
        var file = realAccepted.pop(); 

        this.setState({ newFile: file });
    }

    onSave() {
        this.handle(this.state.titre, this.state.typeNewDoc == "feuillet" ?
            this.state.typeFeuillet : this.state.typeDep, this.state.montant, this.state.newFile);
    }

    async handle(titre, cat, montant, file) {
        var that = this;
        var annee = DAL.getAnnee("docs");//this.state.annee;

        if(!(titre) || !(cat)){
            auth.showToast(impoTxt.toastCatAndTitle, 3000, "danger");
        }

        this.setState({ blocking: true });

         utils.canvasEncode(this.state.shouldCompress && !(/\.pdf$/i.test(file.name)), file, (blob)=>{ 

            const data = new FormData();
            data.append('filename', file.name);
            file = blob;
            data.append('file', file);
    
            var serveurPath = process.env.REACT_APP_SERVER_URL + "/";
    
            axios.post(serveurPath + 'upload', data, {
                onUploadProgress: (data) => {
                    localData.set("uploadProgress", data.loaded / data.total);
                    utils.callEvent("uploadProgress");
                }
            })
                .then(function (response) {
                    utils.log("Uploaded New Doc");
                    utils.log(response);
                    that.setState({ imageURL: serveurPath + response.data.file, uploadStatus: true });
                    utils.log("Saving files to Strapi.");
    
                    DAL.saveFile(titre, cat, montant, response.data.file, annee)
                        .then(res => {
                            utils.log("Saved Strapi New Doc");
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
        });

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

        if (auth.isAdmin()) return null;
 
        return (<>
         <IconButton      
                buttonRef={node => {
                  this.anchorElBottom = node;
                }}        
                onClick={() => this.setState({detailCompression:!this.state.detailCompression})}
              >
                <ContactSupport />
              </IconButton>
              <Popover
                classes={{
                  paper: classes.popover
                }}
                open={this.state.detailCompression}
                anchorEl={this.anchorElBottom}
                anchorReference={"anchorEl"}
                onClose={() => this.setState({detailCompression:false})}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "left"
                }}
              >
                {/*<h3 className={classes.popoverHeader}>[Entete]</h3>*/}
                <div className={classes.popoverBody}>
                  {impoTxt.docDescCompression}
                </div>
              </Popover>
            <FormControlLabel
            control={
              <Switch
                checked={this.state.shouldCompress}
                onChange={()=>this.setState({shouldCompress: !this.state.shouldCompress})}
                value="shouldCompress"
                classes={{
                  switchBase: classes.switchBase,
                  checked: classes.switchChecked,
                  icon: classes.switchIcon,
                  iconChecked: classes.switchIconChecked,
                  bar: classes.switchBar
                }}
              />
            }
            classes={{
              label: classes.label
            }}
            label={impoTxt.docCompressToggle} 
          />

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
                                <option value="feuillet" key="Feuillet">{impoTxt.docFeuillet}</option>
                                <option value="depense" key="depense">{impoTxt.docDepense}</option>
                            </Select>

                            <br />

                            {this.state.typeNewDoc == "feuillet" ?
                                <DocTypeSelector labelText={impoTxt.docTypeFeuillet} options={optionsFeuillets} value={this.state.typeFeuillet}
                                    idTxt={"typeFeuillet"} changeCB={this.handleChangeGeneric("typeFeuillet")} classes={classes} />
                                :
                                <DocTypeSelector labelText={impoTxt.docTypeDepense} options={optionsDepenses} value={this.state.typeDep}
                                    idTxt={"typeDep"} changeCB={this.handleChangeGeneric("typeDep")} classes={classes} />
                            }

                            {this.state.typeNewDoc == "depense" &&
                                <TextField
                                    style={{ marginLeft: 20, marginTop: 8, width: 100 }}
                                    id="standard-number"
                                    label="Montant"
                                    value={this.state.montant}
                                    onChange={this.handleChangeGeneric('montant')}
                                    type="number"
                                />
                            }

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
            </>
        );
    }
}

export default withStyles(docsItemStyle)(useShallowEqual(NewDoc));
