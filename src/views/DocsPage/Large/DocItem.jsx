/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { useState } from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import docsItemStyle from "assets/jss/material-kit-react/views/docsItem.jsx";

import Button from "components/CustomButtons/Button.jsx"; 
import { Paper, Typography, IconButton, Dialog, DialogContent, DialogActions,  Slide } from '@material-ui/core';

import { Delete, WarningOutlined, Edit } from "@material-ui/icons";

import ImageZoom from 'components/MediumLikeZoom'; // Peut être enlevé mais est supposé aider les performances

import CatText from '../CategoryText';
import NewMessage from "../../Messages/NewMessage";
import MessageHistory from "../../Messages/MessageHistory";

import auth from 'utils/auth';
import DAL from 'utils/DataAccess/DALimpotx';
import localData from "utils/DataAccess/localData";

import impoTxt from 'texts/localization';


function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function getMsgHistory(file) {
  var messagesParQuestion = DAL.getMessagesPerDoc(file._id);

  return (<React.Fragment>
    {messagesParQuestion.length > 0 &&
      (
        <React.Fragment><h6 style={{ textAlign: "center" }}>{impoTxt.chatQuestionToTeam}</h6>

          <MessageHistory messages={messagesParQuestion} />
        </React.Fragment>)}
  </React.Fragment>
  );
}


const ListDocItem = (props) => {
  let [modal, setModal] = useState(false);

  const { classes, file, onZoom, onClickDetails } = props;


  const InfoButton = () => <Button
    color="transparent"
    target="_blank"
    justIcon
    onClick={() => {
      if (file) onClickDetails(file);
    }}
  >
    <Edit />
  </Button>;

  return (
    <Paper style={{ width: "100%", marginTop: 5, marginBottom: 5 }}>
      <Typography  className={classes.titreDocLarge} component="h5" variant="h5">
        {file.titre}
      </Typography>

      <div style={{ display: "flex", width: "100%", justifyContent: "center", overflowX: "hidden" }}>
        <ImageZoom
          className={classes.cardImg}
          image={{
            src: process.env.REACT_APP_SERVER_URL + "/" + MakeImageURL(file._id, true, isPDF(file.url)),//utils.pdfUrlReform(addMediumSuffix(file.url)),
            alt: file.titre,
            style: { width: "auto", height: "50vh", borderRadius: "2px 6px 6px 2px" }
          }}
          zoomImage={{
            src: process.env.REACT_APP_SERVER_URL + "/" + MakeImageURL(file._id, false, isPDF(file.url)),// + utils.pdfUrlReform(file.url),
            alt: file.titre,
            //style: { width: '100%', height:"100%" }
          }
          }
          zoomMargin={5}
          onZoom={() => onZoom(file.id || file._id)}
          onUnzoom={() => onZoom(null)}
          sideForms={null}
        />
      </div>
      <div style={{ width: "100%" }} >
        <div style={{ float: "left" }}>
          <InfoButton />
        </div>
        <div style={{ width:"auto" }}>
          <CatText file={file} />
        </div>

        <div style={{ float: "right" }}>
          {!isNaN(file.montant) && isDep(file.category) &&
            <Typography style={{ marginTop: 20, marginLeft: 30 }} variant="caption" color="textPrimary">
              {file.montant}&nbsp;$
              </Typography>}

          {!auth.isAdmin() && (<>
            <IconButton onClick={() => setModal(true)}
              style={{ float: "right" }}>
              <Delete />
            </IconButton>
          <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={modal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setModal(false)}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogContent
            id="classic-modal-slide-description"
            className={classes.modalBody}
            style={{ paddingBottom: 0 }}
          >
            <WarningOutlined style={{ fill: "red" }} />
            <p>
              {impoTxt.docValiderSuppression}
            </p>
          </DialogContent>
          <DialogActions
            style={{ marginTop: 0 }}
            className={classes.modalFooter}>
            <Button
              onClick={() => {
                props.onDelete(file);
                setModal(false);
              }}
              color="transparent"
              simple>
              {impoTxt.Oui}
            </Button>

            <Button
              onClick={() => setModal(false)}
              color="danger"
              simple
            >
              {impoTxt.Non}
            </Button>
          </DialogActions>
          </Dialog></>)}
        </div>
      </div>

      <div className={classes.newMessage}>
          <h6>{impoTxt.docRenseignement}</h6>
          <NewMessage doc={file._id} onSent={() => this.handleNewMessage()//forceUpdate()
          } />
        </div>
      <div className={classes.msgHistory} >
          {getMsgHistory(file)}
        </div>
        
    </Paper >
  );
}


function isPDF(url) {
  return url && /.*pdf/gi.test(url);
}
function MakeImageURL(fileId, isMedium, convertPDF) {
  return "files/" + (auth.isAdmin() ? localData.getStorage("currentUserId") : "me") +
    "/" + fileId +
    "/" + auth.getToken() +
    "/" + (isMedium ? "true" : "false") +
    (convertPDF ? "/pdf" : "/false");
}

function isDep(cat) {
  return DAL.getDepenses().some(dep => dep.idperso === cat);
}
export default withStyles(docsItemStyle)(ListDocItem);
