/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { Fragment } from "react";
// nodejs library that concatenates classes
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components 
import { Button, Dialog, DialogContent, DialogActions, Fade, withWidth } from '@material-ui/core';

import { Save } from "@material-ui/icons";

import auth from "utils/auth.js";
import utils from "utils/utils.js";
import localData from "utils/DataAccess/localData";
import impoTxt from 'texts/localization';
import DAL from "utils/DataAccess/DALimpotx.js";

import docsPageStyle from "assets/jss/material-kit-react/views/docsPage.jsx";

import NewMessage from "../Messages/NewMessage";
import MessageHistory from "../Messages/MessageHistory";

import { RIEInput, RIENumber } from 'riek';

import BlockUi from 'react-block-ui';
import AutosuggestCategorie from 'views/DocsPage/AutosuggestCategorie';
import 'react-block-ui/style.css';

import {downloadFile} from 'utils/downloadFile';

import axios from "axios";

function Transition(props) {
  return <Fade  {...props} />;
} 

const getCatTitre = id => (DAL.getDepenses().find(dep=>dep.idperso == id)
 || DAL.getFeuillets().find(dep=>dep.idperso == id) 
 || {titre:id} )
 .titre;

class DocDetailModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      titre: "",
      montant: "",
      cat: "",
      catTitre: "",
      suggestions: []
    }

    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.isDepense = this.isDepense.bind(this);
    this.SaveChanges = this.SaveChanges.bind(this);
    this.getSelectOptions = this.getSelectOptions.bind(this);
    this.saveSignature = this.saveSignature.bind(this)
  }
   getSuggestions = value => {
    utils.log("Getting suggest: " +  value );
    const inputValue = value.trim().toLowerCase();
   
    var fullOptions = this.getSelectOptions()
    var filteredOps = fullOptions.filter(cat =>
      {
     return ( new RegExp(".*" + inputValue + ".*", "i")).test(cat.text);
      }
    );
    return filteredOps;
  };
  getSelectOptions() {
    if (this.props.file) {
      var cat = [];
      if (this.isDepense(this.props.file.category)) {
        cat = DAL.getDepenses();
      }
      else {
        cat = DAL.getFeuillets();
      }
      return cat.map(c=>({id:c.idperso, text:c.titre}));
    }
    else
      return [];
  }

  isDepense() {
    return this.props.file &&
      DAL.getDepenses().some(dep => dep.idperso == this.props.file.category);
  }

  SaveChanges() {
    DAL.changeFile(this.props.file._id, this.state.titre, this.state.montant, this.state.cat)
      .then(res => {
        auth.showToast(impoTxt.toastSaved);
        if (this.props.onSaveChange) {
          this.props.onSaveChange(this.props.file._id, this.state.titre, this.state.montant, this.state.cat);
        }

        this.setState({ saving: false });
      });
    this.setState({ saving: true });
  } 
  componentDidMount() {
    var file = this.props.file;
    var oldF = this.state.file;
    if (file && (oldF == null || oldF._id != file._id)) {
      var montant = isNaN(file.montant) ? 0 : parseFloat(file.montant);
      this.setState({
        titre: file.titre,
        montant: montant,
        cat: file.category,
        catTitre: getCatTitre(file.category), 
        file: file
      });
    }

  }

  // TODO : Ajouter Loader, 
  // Ajouter champs pour titre, desc, cat
  // Card UI pour prev files


  getMsgHistory(file) {
    var messagesParQuestion = DAL.getMessagesPerDoc(file.id);

    return (<React.Fragment>
      {messagesParQuestion.length > 0 &&
        (
          <Fragment><h6 style={{ textAlign: "center" }}>{impoTxt.chatQuestionToTeam}</h6>

            <MessageHistory messages={messagesParQuestion} />
          </Fragment>)}
    </React.Fragment>
    );
  }

  handleNewMessage() {
    if (auth.isAdmin()) {
      DAL.getUser(auth.isAdmin() ? localData.getStorage("currentUserId") : "me")
        .then(res => {
          localData.setStorage("selectedUser", res);
          this.forceUpdate();
        });
    }
    else {
      this.forceUpdate();
    }
  }

  //AutoSuggest
  
  onChange = ( newValue) => {
    var catTitre = getCatTitre(newValue);
    if(catTitre && catTitre != newValue)
    {
      this.setState({
        catTitre: catTitre,
        cat : newValue
      });
    }else{
     auth.showToast(impoTxt.toastCat + newValue + impoTxt.toastNonTrouvee, null, "danger");
    }
  };
 
  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };
 
  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  saveSignature(){
      DAL.signerDoc(this.props.file._id)
      .then(res=>{
        if(this.props.onSaveChange){
          this.props.onSaveChange(this.props.file._id, this.state.titre, this.state.montant, this.state.cat);
          this.setState({signed:true});
        }
      });
  }
  render() {
    const { file, onChangeFile, onClose, classes, width } = this.props;

    if (file == null) return null;
    if (!(file.id)) file.id = file._id; 
    var adminTitre = DAL.getAdminFile().find(cat=>cat.idperso == (file && file.category));
    adminTitre = adminTitre && adminTitre.titre; 
 
    return (<Dialog
      maxWidth={false}
      fullWidth={true}
      fullScreen={["sm", "xs"].includes(width)}
      classes={{
        root: classes.center + " " + classes.detailModalRoot,
        paper: classes.modal + " " + classes.detailModalRoot,
      }}
      scroll="paper"
      open={file ? true : false}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="classic-modal-slide-title"
      aria-describedby="classic-modal-slide-description"
    >
      <DialogContent
        id="classic-modal-slide-description"
        className={[classes.modalBody, classes.detailModalContent].join(' ')}
        style={{ paddingBottom: 0 }} >

        <img className={[
          classes.imgRaised,
          classes.imgFluid,
          classes.imgRounded,
          classes.imgDetails
        ].join(" ")
        }
          src={process.env.REACT_APP_SERVER_URL + "/" + MakeImageURL(file._id, true, isPDF(file.url))// utils.pdfUrlReform(addMediumSuffix(file.url))
        }
          alt={file.titre} 
          lazyload="on" />

        <div className={classes.titreDetailsModal}>
        {adminTitre ? this.state.titre :
          <RIEInput
            value={this.state.titre || "-titre-"}
            change={(ch) => this.setState(ch)}
            propName="titre">
    </RIEInput>}

          {this.isDepense() &&
            <Fragment>
              <br />Montant :
              <RIENumber
                value={this.state.montant}
                change={(ch) => this.setState(ch)}
                propName="montant" /> $
                
            </Fragment>
          }
                <br />
                Categorie :
                {adminTitre ?  adminTitre : 
      <AutosuggestCategorie
        defaultValue={this.state.cat}
          onChange={this.onChange}        
      />}
      <br/>

      {impoTxt.docDownloadOri} : <Button onClick={()=>
        dlOri(process.env.REACT_APP_SERVER_URL + "/" + MakeImageURL(file._id), //file.url,
         file.titre.split(".").shift() + "."+file.url.split(".").pop(),
         "application/" + file.url.split(".").pop())
        }>{file.titre}</Button>
         
          <br/>
      {adminTitre && !auth.isAdmin() && 
      (<>
      {impoTxt.EnCliquantVous + impoTxt[file.category]}
      <Button onClick={this.saveSignature} disabled={/signed/gi.test(file.statut) || this.state.signed}>{impoTxt.docSigner}</Button>
      </>)}

        </div>

        <div className={classes.msgHistory} >
          {this.getMsgHistory(file)}
        </div>
        <div className={classes.newMessage}>
          <h6>{impoTxt.docRenseignement}</h6>
          <NewMessage doc={file._id} onSent={() => this.handleNewMessage()//forceUpdate()
          } />
        </div>

      </DialogContent>

      <DialogActions style={{ marginTop: 0 }} className={classes.modalFooter}>

        <BlockUi tag="div" blocking={this.state.saving} >
          <Button onClick={this.SaveChanges}>
            <Save />
          </Button>
        </BlockUi>

        <Button onClick={onClose} >
          Quit
            </Button>

        <br />
        <Button
          color="default"
          onClick={() => {
            if (onChangeFile) onChangeFile(-1);
          }}
        >
          Prev
            </Button>

        <Button
          color="default"
          onClick={() => {
            if (onChangeFile) onChangeFile(1);
          }}
        >
          Next
            </Button>
      </DialogActions>
    </Dialog>);
  }
}

function isPDF(url) {
  return url && /.*pdf/gi.test(url);
}
function MakeImageURL(fileId, isMedium, convertPDF){
  return "files/" + (auth.isAdmin() ? localData.getStorage("currentUserId") : "me") +
   "/" + fileId + 
  "/" + auth.getToken() + 
  "/" +( isMedium ? "true" : "false") + 
  (convertPDF ? "/pdf" : "/false");
}
 
function dlOri(url, titre, type){
  axios.get(url, { responseType: 'blob'})
  .then(resp=>downloadFile(resp.data, titre, "octet/stream"));
}

export default withWidth()(withStyles(docsPageStyle)(DocDetailModal));