/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { Fragment } from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { Button, Dialog, DialogContent, DialogActions, Slide } from '@material-ui/core';

import { WarningOutlined } from "@material-ui/icons";

// core components
import { Paper } from '@material-ui/core';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx";
import QuestionItem from "./QuestionItem.jsx"

//utils 
import auth from 'utils/auth';
import utils from "utils/utils";
import impoTxt from "texts/localization";
import localData from "utils/DataAccess/localData";

const textAucuneQuestion = <p>Aucune questions à afficher</p>;

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class QuestionList extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: [24, 22],
      selectedEnabled: "b",
      checkedA: true,
      disabled: false,
      nouvellesRep: null,
      callbackFunc: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
    this.handleQuestionItemChanged = this.handleQuestionItemChanged.bind(this);
    this.handleAdminSave = this.handleAdminSave.bind(this);
    this.onClickSaveAdmin = this.onClickSaveAdmin.bind(this);
    this.onClickDontAskAgainAdmin = this.onClickDontAskAgainAdmin.bind(this);
    this.mapQuestionItem = this.mapQuestionItem.bind(this);
    this.setQuestionItem = this.setQuestionItem.bind(this);

    this.lstQuestionsItems = {};
  }

  setQuestionItem(qstItem, index) {
    this.lstQuestionsItems[index] = qstItem;
  }

  componentDidMount() {
    var target = auth.getScrollTarget();
    if (target && target.question) {
      this.setState({ targetId: target.question });
      setTimeout(() => { auth.setScrollTarget(null); }, 5000);
    }
  }

  componentWillUnmount() {
    delete this.lstQuestionsItems;
  }

  handleClose(modal) {
    if (this.state.callbackFunc) {
      var cb = this.state.callbackFunc;
      cb(false);
      this.setState({ callbackFunc: null });
    }
  }

  handleQuestionItemChanged(question, index) {
    var ref = this.lstQuestionsItems[index + 1]
    if (ref && ref.current && ref.current.focus) {
      this.lstQuestionsItems[index + 1].current.focus();
    }
  }
  handleChange = name => event => {
    utils.log("name : " + name + " , val : " + event.target.checked);
    this.setState({ [name]: event.target.checked });
  };
  handleChangeEnabled(event) {
    this.setState({ selectedEnabled: event.target.value });
  }
  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  }

  handleAdminSave(callbackFunc) {
    var prevApproveDate = localData.get("approveAdminChanges");
    if (prevApproveDate > Date.now()) {
      callbackFunc(true);
    }
    else {
      this.setState({ callbackFunc });
    }
  }

  onClickSaveAdmin() {
    var cb = this.state.callbackFunc;
    this.setState({ callbackFunc: null });
    cb(true);
  }

  onClickDontAskAgainAdmin() {
    this.onClickSaveAdmin();
    // On ne demandes plus l'approbation pour 30 minutes.
    localData.set("approveAdminChanges", Date.now() + 1000 * 60 * 30);
  }

  renderSaveAdmin(classes) {
    return (
      <Dialog
        classes={{
          root: classes.center,
          paper: classes.modal
        }}
        open={this.state.callbackFunc ? true : false}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.handleClose}
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
            {impoTxt.adminCertain /*Êtes vous certain de vouloir sauvegarder?*/}
          </p>
        </DialogContent>
        <DialogActions
          style={{ marginTop: 0 }}
          className={classes.modalFooter}>
          <Button
            onClick={this.onClickDontAskAgainAdmin}
            simple="true">
            {impoTxt.adminOuiPlusDemander}
          </Button>
          <Button
            onClick={this.onClickSaveAdmin}
            simple="true">
            {impoTxt.Oui}
          </Button>

          <Button
            onClick={this.handleClose}
            simple="true"
          >
            {impoTxt.Non}
          </Button>
        </DialogActions>
      </Dialog>);
  }

  mapQuestionItem(qst, index) {
    var newRep = this.props.answered === "false" &&
      (this.state.nouvellesRep && qst._id === this.state.nouvellesRep._id) ? true : false;

    return (
        <QuestionItem
          answered={this.props.answered}
          sendRefToParent={(qstItem) => this.setQuestionItem(qstItem, index)}
          indQst={index}
          isTarget={this.state.targetId == qst._id ? true : false}
          hasNotification={this.props.notifications.some(notif => notif[0].question === qst._id)}
          shouldRemove={newRep}
          onAdminSave={this.handleAdminSave}
          user={this.props.user}
          question={qst}
          key={qst._id}
          onChange={this.handleQuestionItemChanged.bind(this)} />
      );
  }

  render() {
    const { classes, questions } = this.props;
    //var filteredQuestions = filter(questions, this.props.answered, this.state.nouvellesRep);

    //var refPrev;

    if (this.lstQuestionsItems) {
      // Delete the last stored question so we don't focus an item that's gone
      // delete this.lstQuestionsItems[questions.length];
    }

    // TODO : Ajouter un stretching container : https://devarchy.com/react/need/animated-collapse
    return (
      <Fragment>
        <GridContainer>
          {questions ? questions
            /* .map(qst => {
               var prevRef = refPrev;
 
               refPrev = function (nextThis) {
                 this.nextThis = nextThis;
                 return this;
               };
               return { qst, prevRef: prevRef, fnCalledByNext: refPrev };
             })*/
            .map(this.mapQuestionItem) :
            textAucuneQuestion}
        </GridContainer>
        {this.state.callbackFunc &&
          this.renderSaveAdmin(classes)
        }
      </Fragment>
    );
  }
}

QuestionList.defaultProps = {
  notifications: []
};


export default withStyles(basicsStyle)(QuestionList);
