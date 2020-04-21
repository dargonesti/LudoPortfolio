/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { useState, } from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import docsItemStyle from "assets/jss/material-kit-react/views/docsItem.jsx";

import Button from "components/CustomButtons/Button.jsx";
import { Paper, Typography, IconButton, Dialog, DialogContent, DialogActions, Slide } from '@material-ui/core';

import { Delete, WarningOutlined, Edit } from "@material-ui/icons";

import CatText from '../CategoryText';

import auth from 'utils/auth';
import DAL from 'utils/DataAccess/DALimpotx';

import impoTxt from 'texts/localization';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}


const filterByAdmin = (file) => {
  return (/admin.*/.test(file.category));
};

const ListDocItem = (props) => {
  let [modal, setModal] = useState(false);

  const { classes, file, isTarget, hasNotification, onClickDetails } = props;

  var stateClass = classes.defaultPaper;
  if (isTarget) {
    stateClass = classes.SelectedPaper;
  }
  else if (hasNotification) {
    stateClass = classes.NotificationPaper;
  }

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
    <Paper className={[classes.card, stateClass].join(" ")}>
      <div className={classes.details}>

        <Typography className={classes.titreDoc} style={{
          display: "flex", marginLeft: 10
          //width:123,
        }} component="h5" variant="h5">
          {file.titre}
        </Typography>

        <CatText file={file} />

        {!isNaN(file.montant) && isDep(file.category) &&
          <Typography  variant="caption" color="textPrimary">
            {file.montant}&nbsp;$
  </Typography>}

        <div style={{ display: "flex" }}>
          <InfoButton />

          {((!auth.isAdmin() //localData.getStorage("selectedUser") == null 
          && !filterByAdmin(file)) 
          || auth.isSuperAdmin())
          && (<>
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

    </Paper>
  );
}

function isDep(cat) {
  return DAL.getDepenses().some(dep => dep.idperso === cat);
}

export default withStyles(docsItemStyle)(ListDocItem);
