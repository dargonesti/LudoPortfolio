/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React from "react";
import { Redirect } from 'react-router-dom';
import impoHOC from "HoC/impoHOC.js";
import WrapingImpotPage from "HoC/WrapingImpotPage.jsx";
import withStyles from "@material-ui/core/styles/withStyles";

// core components 
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { withWidth } from '@material-ui/core';

import DAL from "utils/DataAccess/DALimpotx.js";
import utils from "utils/utils.js";
import auth from "utils/auth.js";
import impoTxt from 'texts/localization';
import localData from "utils/DataAccess/localData";

import docsPageStyle from "assets/jss/material-kit-react/views/docsPage.jsx";

import DocList from "./DocList.jsx";

import axios from "axios";
import 'react-block-ui/style.css';


class DocsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      titre: "titre",
      desc: "desc",
      cat: 2,
      blocking: false,
      openedFile: null,
      annee: DAL.getAnnee("docs")
    };

    this.onDrop = this.onDrop.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleSaveFile = this.handleSaveFile.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    //this.getDialogDetails = this.getDialogDetails.bind(this);
    this.toogleInfos = this.toogleInfos.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
  }

  toogleInfos(file) {
    var msgs = DAL.getMessagesPerDoc(file._id);

    if (msgs) {
      var lastMsg = msgs[msgs.length - 1];
      DAL.setMessageSeen(lastMsg);
    }

    this.setState({ openedFile: file });
  }

  handleClose(modal) {
    this.setState({ openedFile: null });
  }

  handleChangeFile(iNav) {
    var indCur = this.state.files.findIndex(f => f == this.state.openedFile) + iNav;
    var indNext = indCur >= 0 ? indCur : this.state.files.length - 1;
    this.setState({ openedFile: this.state.files[indNext % this.state.files.length] });
  }

  handleDelete(file) {
    DAL.removeFile(file).then(res => {
      this.refreshStrapiFiles();
    }).catch(ex => {
      utils.log(ex);
      this.refreshStrapiFiles();
    });
  }

  handleUploadProgress(data) {
    localData.set("uploadProgress", data.loaded / data.total);
    utils.callEvent("uploadProgress");
  }

  handleSaveFile(titre, desc, cat, file) {
    var that = this;
    var annee = this.state.annee;

    //TODO : Block UI with a Loader
    // npm install --save react-block-ui
    // https://availity.github.io/react-block-ui/

    this.setState({ blocking: true });

    const data = new FormData();
    data.append('file', file);
    data.append('filename', file.name);

    var serveurPath = process.env.REACT_APP_SERVER_URL + "/"; // localhost:8080

    axios.post(serveurPath + 'upload', data, { onUploadProgress: this.handleUploadProgress })
      .then(function (response) {
        utils.log(response);
        //this.setState({ imageURL: `http://localhost:8000/${body.file}`, uploadStatus: true });
        that.setState({ imageURL: serveurPath + response.data.file, uploadStatus: true });
        utils.log("Saving files to Strapi.");

        DAL.saveFile(titre, desc, cat, response.data.file, annee).then(res => {
          that.setState({ blocking: false });
          that.refreshStrapiFiles();
        }).catch(ex => {
          utils.log(ex);
          that.setState({ blocking: false });
        })
      })
      .catch(function (error) {
        utils.log(error);
      });//*/
  }

  // <Collapse collapsedHeight={50} in={false} timeout={{ enter: 666, exit: 2222 }}>
  onDrop(acceptedFiles, rejectedFiles) {

  }


  render() { 
    var {classes, firebaseData} = this.props;
    if (auth.getToken())
      return (
        <WrapingImpotPage firebaseData={firebaseData}>
            <GridContainer justify="center" style={{width:"100%", marginLeft:0}}>
              <GridItem xs={12} md={12}>
                <h1>{impoTxt.Doc}</h1>
              </GridItem>
              <GridItem xs={12} md={12}>
                <p>{impoTxt.docparaEntete}</p>
              </GridItem>

              <DocList onSave={() => utils.log("onSave")} />
            </GridContainer>
        </WrapingImpotPage>
      );
    else
      return <Redirect to="/" />;
  }
}


export default withWidth()(withStyles(docsPageStyle)(impoHOC(DocsPage,"Docs")));
