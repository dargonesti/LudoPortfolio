/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { Fragment } from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components  
import GridItem from "components/Grid/GridItem.jsx";
import { Select, InputLabel, Typography, FormControlLabel, Switch, } from '@material-ui/core';

import axios from "axios";
import DAL from "utils/DataAccess/DALimpotx.js";
import auth from "utils/auth.js";
import utils from "utils/utils.js";
import localData from "utils/DataAccess/localData";
import impoTxt from 'texts/localization';

import docsPageStyle from "assets/jss/material-kit-react/views/docsPage.jsx";

import BlockUi from 'react-block-ui';
import DocItem from "./List/DocItem.jsx";
import LargeDocItem from "./Large/DocItem.jsx";
import NewDoc from "./NewDoc.jsx";
import NewDocAdmin from "./NewDocAdmin.jsx";
import DropFiles from "components/UploadFiles/DropFiles";
import ModalDoc from "./ModalDoc.jsx";
import Clearfix from "components/Clearfix/Clearfix.jsx";

//TODO : Remplacer Selects par ça
import AutosuggestCategorie from 'views/DocsPage/AutosuggestCategorie';
import ThrottledTextField from "views/ImpoCompo/ThrottledTextField";

import 'react-block-ui/style.css';

import { scroller } from 'react-scroll'

class DocList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            newUploads: [],
            titre: "titre",
            desc: "desc",
            cat: 2,
            blocking: false,
            openedFile: null,
            annee: DAL.getAnnee("docs"),
            notifications: [],
            savedChanges: 0,
            filtre: "",
            modeLarge: localData.getStorage("modeLarge"),
            uploading: false
        };

        this.handleChangeAnnee = this.handleChangeAnnee.bind(this);
        this.refreshStrapiFiles = this.refreshStrapiFiles.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
        //this.getDialogDetails = this.getDialogDetails.bind(this);
        this.toogleInfos = this.toogleInfos.bind(this);
        this.handleChangeGeneric = this.handleChangeGeneric.bind(this);
        this.SaveFiles = this.SaveFiles.bind(this);
    }

    handleChangeGeneric = name => event => {
        var newVal = event.target.value;
        this.setState({ [name]: newVal });
    }
    getAnnees() {
        // TODO : Trouver année courrante plutôt que 2018
        // Todo : Min ( 10 ans ou la première réponse de l'utilisateur )
        var ret = [impoTxt.Toutes];
        for (var i = 0; i < 10; i++) {
            ret.push((new Date()).getFullYear() - i);
        }
        return ret;
    }

    toogleInfos(file) {
        var msgs = DAL.getMessagesPerDoc(file._id);

        if (msgs) {
            var lastMsg = msgs[msgs.length - 1];
            DAL.setMessageSeen(lastMsg);
        }

        this.setState({ openedFile: file });
    }


    handleChangeAnnee = event => {
        var newVal = event.target.value;
        this.setState({ annee: newVal });

        DAL.setAnnee(newVal, "docs");
    }

    componentDidMount() {
        this.refreshStrapiFiles();

        (auth.isAdmin() ?
            DAL.getAdminNotifications() :
            DAL.getUserNotifications())
            .then(res => {
                this.setState({ notifications: res });
            });
    }

    refreshStrapiFiles() {
        var isAdminDocs = this.props.adminDocs ? true : false;
        const filterByAdmin = (file) => {
            return (isAdminDocs === /admin.*/.test(file.category));
        };

        DAL.getUser(auth.isAdmin() ? localData.getStorage("currentUserId") : "me").then(usr => {
            localData.setStorage("selectedUser", usr);
            DAL.getFiles().then(resp => {
                try { // Cette ligne nous donne parfois, en prod seulement, une erreur comme quoi render n'as pas de return
                    // a.k.a. : Invariant Violation: Minified React error #152
                    this.setState({ files: resp.filter(filterByAdmin) });
                } catch (ex) {
                    console.log(ex);
                }
                var target = auth.getScrollTarget();
                if (target && target.doc) {
                    var newState = { targetId: target.doc }

                    utils.log("state.files");
                    utils.log(this.state.files);

                    if (this.state.files) {
                        var file = this.state.files.find(f => f._id === target.doc);
                        if (file && file.annee) {
                            newState.annee = file.annee;
                        }
                    }

                    this.setState(newState);

                    scroller.scrollTo(this[target.doc], {
                        offset: 200,
                        duration: 800,
                        delay: 0,
                        smooth: 'easeInOutQuart'
                    });
                    auth.setScrollTarget(null);
                }
            });
        });
    }

    handleDelete(file) {
        DAL.removeFile(file).then(res => {
            this.refreshStrapiFiles();
        }).catch(ex => {
            utils.log(ex);
            this.refreshStrapiFiles();
        });
    }

    onChangeCat = (newValue) => {
        var catTitre = utils.getCatTitre(newValue);
        if (newValue == "" || catTitre && catTitre != newValue) {
            this.setState({
                filtreFeuillet: newValue
            });
        }
    }
    onChangeCatDep = (newValue) => {
        var catTitre = utils.getCatTitre(newValue);
        if (newValue == "" || catTitre && catTitre != newValue) {
            this.setState({
                filtreDep: newValue
            });
        }
    }

    handleZoom = (docId, ev) => {
        if (this.state.openedDoc === docId)
            this.setState({ openedDoc: null });
        else
            this.setState({ openedDoc: docId });
    }

    
  SaveFiles = async function (onNext) {
    var annee = DAL.getAnnee("docs");//this.state.annee;
    var toUpload = this.state.files.filter(file => !file.done);

    if (this.state.uploading) {
      auth.showToast(impoTxt.toastAlreadyUpload, 3000, "info");
      return false;
    }
    if (toUpload.some(file => !(file.cat) || !(file.titre))) {
      auth.showToast(impoTxt.toastCatAndTitle, 3000, "danger");
      return false;
    }

    this.setState({uploading:true});

    for (var i = 0; i < toUpload.length; i++) {
      // let file = toUpload[i];
      let { name, titre, cat, file } = toUpload[i];

      utils.callEvent("uploadProgress-" + name, 5);

      await utils.canvasEncode(!(/\.pdf$/i.test(name)), file, async (blob) => {
        return new Promise(async (resolve, reject) => {
          const data = new FormData();
          data.append('filename', name);
          file = blob;
          data.append('file', file);

          let serveurPath = process.env.REACT_APP_SERVER_URL + "/";

          let response = await axios.post(serveurPath + 'upload', data, {
            onUploadProgress: (data) => {
              utils.callEvent("uploadProgress-" + name, 100 * data.loaded / data.total);
            }
          }).catch(function (error) {
            utils.log(error);
          });

          // console.log("Uploaded New Doc");
          utils.log(response);
          // appears Useless that.setState({ imageURL: serveurPath + response.data.file, uploadStatus: true });
          utils.log("Saving files to Strapi.");

          await DAL.saveFile(titre, cat, 0, response.data.file, annee)
            .then(res => {
              //setUploading(false);
            }).catch(ex => {
              auth.showToast("Fichier : " + titre + " n'a pu être uploader.", 3000, "danger");
            });
            resolve();
        });
      });
    }
    this.setState({uploading:false});
    onNext();
  }

    render() {
        const { annee, files, filtreFeuilletDep, filtreFeuillet, filtreDep, savedChanges, notifications, targetId, openedFile, modeLarge } = this.state;
        const { adminDocs, classes } = this.props;

        var i = 0 + savedChanges * 1000;
        const widthLG = 4;
        const widthMD = 4;

        const isF = filtreFeuilletDep == "feuillet";
        const isD = filtreFeuilletDep == "depense";

        if (!auth.getToken()) return null;

        utils.log("Files, pre-filtre : " + adminDocs);
        utils.log(files);
        var filteredDocs = (files || [])
            .filter(filtrerDocs.bind(this))
            .filter(file => (file.annee == annee || !utils.isNumeric(annee))
                && (adminDocs || checkFiltres(file, filtreFeuilletDep, filtreFeuillet, filtreDep)));

        utils.log("Files, post-filtre : " + adminDocs);
        utils.log(filteredDocs);

        // TODO : Généraliser <MySortHead> de FindUserPage
        return (<Fragment>
            <GridItem xs={12} sm={6} md={widthMD} lg={widthLG}>
                <ThrottledTextField onChange={(val) => {
                    this.setState({ filtre: val });
                }
                }
                    style={{ margin: "-10px 0px 10px 10px", padding: "0px 0px 0px 10px" }}
                    label={impoTxt.docfiltrerDocs} />
            </GridItem>

            <GridItem xs={12} sm={6} md={widthMD} lg={widthLG}>
                <InputLabel htmlFor="age-native-simple">{impoTxt.qstAnneeDuRap}</InputLabel>
                <Select
                    style={{ marginLeft: 10 }}
                    native
                    value={annee}
                    onChange={this.handleChangeAnnee}
                    inputProps={{
                        name: 'choixdereponse',
                        id: 'age-native-simple',
                    }}  >
                    {this.getAnnees()
                        .map(annee =>
                            <option value={annee} key={annee}>{annee}</option>)}
                </Select>
            </GridItem>

            {!adminDocs &&
                <GridItem xs={12} sm={6} md={widthMD} lg={widthLG}>
                    <InputLabel htmlFor="age-native-simple">{impoTxt.docFeuilDep}</InputLabel>
                    <Select
                        style={{ marginLeft: 10 }}
                        native
                        value={filtreFeuilletDep}
                        onChange={this.handleChangeGeneric("filtreFeuilletDep")}
                        inputProps={{
                            name: 'choixdereponse',
                            id: 'age-native-simple',
                        }}>
                        <option value={""} key="tous">{impoTxt.Tous}</option>
                        <option value={"feuillet"} key="feuilletfiltre">{impoTxt.docFeuillet}</option>
                        <option value={"depense"} key="depensefiltre">{impoTxt.docDepense}</option>
                    </Select>
                </GridItem>}

            {(isF || isD) && (
                <GridItem xs={12} sm={6} md={6} lg={4}>
                    <InputLabel htmlFor="age-native-simple">{isF ? impoTxt.docType : "Type"}</InputLabel>
                    <AutosuggestCategorie
                        forceFeuillet={isF}
                        forceDepense={isD}
                        defaultValue={isF ? filtreFeuillet : filtreDep}
                        onChange={isF ? this.onChangeCat : this.onChangeCatDep}
                    />
                </GridItem>)}

            <GridItem xs={12} sm={6} md={widthMD} lg={widthLG}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={modeLarge}
                            onChange={() => {
                                this.setState({ modeLarge: !modeLarge });
                                localData.setStorage("modeLarge", !modeLarge);
                            }}
                            value={modeLarge}
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
                    label={impoTxt.docModeLarge}
                />
            </GridItem>

            {adminDocs ?
                (auth.isAdmin() && <NewDocAdmin onSave={this.refreshStrapiFiles} />)
                :
                (<>
                    {/*<NewDoc onSave={this.refreshStrapiFiles} />*/}

                        <DropFiles onChange={fl => {
                            console.log(fl);
                            this.setState({newUploads: fl});
                        }}
                        onSave={x=>{
                            console.log(x);
                            this.refreshStrapiFiles();
                        }} />
                        <div style={{height:0, width:"300px"}} />
                    <div  style={{height:0, width:"100px"}} />
                </>)}

            {/* SECTION FILE LIST */}
            {filteredDocs
                .map(file => {
                    if (modeLarge) {
                        return <LargeDocItem key={file._id}
                            isTarget={targetId == file._id ? true : false}
                            hasNotification={notifications.some(notif => notif[0].doc === file._id)}
                            onClickDetails={this.toogleInfos}
                            onZoom={this.handleZoom}
                            file={file}
                            onDelete={this.handleDelete} />;
                    } else {
                        return <DocItem key={file._id}
                            isTarget={targetId == file._id ? true : false}
                            hasNotification={notifications.some(notif => notif[0].doc === file._id)}
                            onClickDetails={this.toogleInfos}
                            onZoom={this.handleZoom}
                            file={file}
                            onDelete={this.handleDelete} />;
                    }
                })}

            {isD && !adminDocs &&
                <Typography variant="subtitle2">
                    <b>{impoTxt.docTotalDep + filteredDocs
                        .filter(file => file.annee == annee
                            && checkFiltres(file, filtreFeuilletDep, filtreFeuillet, filtreDep))
                        .reduce((ret, file) => {
                            return ret + (isNaN(file.montant) ? 0 : parseFloat(file.montant));
                        }, 0)
                    } $</b>
                </Typography>
            }

            {filteredDocs.length <= 0 &&
                <Typography variant="body1">
                    {impoTxt.docAucunDoc}</Typography>}

            <ModalDoc files={this.state.files} openedFile={openedFile} savedChanges={savedChanges} key={openedFile ? openedFile._id : i++}
                onClose={() => this.setState({ openedFile: null })} />

        </Fragment>
        );
    }
}

function filtrerDocs(doc) {
    var regFiltre = RegExp(".*(" + this.state.filtre + ").*", "i");
    return doc.titre.match(regFiltre);
}

DocList.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    plain: PropTypes.bool,
    carousel: PropTypes.bool
};
function isDep(cat) {
    return DAL.getDepenses().some(dep => dep.idperso == cat);
}
function isFeuil(cat) {
    return DAL.getFeuillets().some(dep => dep.idperso == cat);
}
function checkFiltres(file, cat, feuil, dep) {
    return cat ? (
        (cat == "feuillet" &&
            ((feuil && feuil == file.category) || (feuil ? false : isFeuil(file.category))))
        || (cat == "depense" &&
            ((dep && dep == file.category) || (dep ? false : isDep(file.category)))))
        : true;
}

export default withStyles(docsPageStyle, { withTheme: true })(DocList);
