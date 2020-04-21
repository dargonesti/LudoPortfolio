/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import docsItemStyle from "assets/jss/material-kit-react/views/docsItem.jsx";

import {  Typography } from '@material-ui/core';
 
import DAL from 'utils/DataAccess/DALimpotx'; 
import utils from "utils/utils";
import impoTxt from 'texts/localization';
  
 const CatString = ({file})=>{
  if (file.category) {
    if (isDep(file.category)) {
      return (<Typography component="span" variant="body1">
        {impoTxt.docDepense} : {DAL.getDepenses().find(dep => dep.idperso == file.category).titre}
      </Typography>);
    } else if (isFeuil(file.category)) {
      return (<Typography component="span" variant="body1">
        {impoTxt.docFeuillet} : {DAL.getFeuillets().find(fl => fl.idperso == file.category).titre}
      </Typography>);
    } else if (isAdminFile(file.category)) {
      return (<><Typography component="span" variant="body1">
        {impoTxt.docDocAdmin} : {DAL.getAdminFile().find(fl => fl.idperso == file.category).titre}
      </Typography>
        <p>{/signed/gi.test(file.statut) ? impoTxt.toastSigned : impoTxt.toastToSign}</p>
        <p></p>
      </>);
    } else {
      utils.log("Cannot find category.")
    }
  }
  else
    return null;
}
 
function isDep(cat) {
  return DAL.getDepenses().some(dep => dep.idperso === cat);
}
function isFeuil(cat) {
  return DAL.getFeuillets().some(dep => dep.idperso === cat);
}
function isAdminFile(cat) {
  return DAL.getAdminFile().some(fl => fl.idperso === cat);
}

 
export default withStyles(docsItemStyle)(CatString);
