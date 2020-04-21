import React from "react";

import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import QuestionItemBool from "./QuestionItemBool.jsx"
import QuestionItemChiffre from "./QuestionItemChiffre.jsx"
import QuestionItemChoix from "./QuestionItemChoix.jsx"
import QuestionItemDate from "./QuestionItemDate.jsx"
import QuestionItemTexte from "./QuestionItemTexte.jsx"

import NewMessage from "../Messages/NewMessage"
import MessageHistory from "../Messages/MessageHistory"

import { Collapse, Paper } from '@material-ui/core';
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import { ContactSupport } from "@material-ui/icons";

import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx";

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from "utils/auth.js";
import utils from "utils/utils";
import impoTxt from "texts/localization";
import localData from "utils/DataAccess/localData";

import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import LazyLoad from 'react-lazyload';
import { PulseLoader } from 'halogenium';

import { useShallowEqual } from 'shouldcomponentupdate-children';  // Peut être enlevé mais est supposé aider les performances

basicsStyle.Paper = {
  margin: "5px -10px",
  minHeight: 67,
  maxHeight: 500,
  overflowY: "auto"
};
basicsStyle.Collapse = {
  padding: 15
};

basicsStyle.defaultPaper = {
};
basicsStyle.SelectedPaper = {
  boxShadow: "0px 2px 5px 6px rgba(0, 222, 0, 0.2), 0px 2px 2px 0px rgba(0, 123, 0, 0.14), 0px 3px 1px -2px rgba(0, 123, 0, 0.12)"
};
basicsStyle.InfoComplete = {
  //backgroundColor: "#acffc6",
  boxShadow: "0px 2px 5px 6px rgba(0, 222, 0, 0.2), 0px 2px 2px 0px rgba(0, 123, 0, 0.14), 0px 3px 1px -2px rgba(0, 123, 0, 0.12)"
  //boxShadow : ""
};
basicsStyle.NotificationPaper = {
  boxShadow: "0px 2px 5px 6px rgba(0, 0, 222, 0.2), 0px 2px 2px 0px rgba(0, 0, 123, 0.14), 0px 3px 1px -2px rgba(0, 0, 123, 0.12)"
};
basicsStyle.CompletedPaper = {
  backgroundColor: "#dadada",
};

const widthLarge = 6;
var intervalId = 0;

class QuestionItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rep: DAL.getReponse(props.question.id),
      detailsOpen: false,
      titre: "",
      texte: "",
      sendingMessage: false,
      closingHeight: -1
    };
    this.myRef = React.createRef();

    if (this.props.shouldRemove) {
      ////////////TODO : Trouver une bonne façon pour animer la fermeture
      var start = Date.now();
      var delay = 123;
      var duration = 500;

      if (intervalId > 0) {
        utils.log("Clearing and starting interval for closing question");
        clearInterval(intervalId);
      }
      utils.log("start Interval");
      intervalId = setInterval(() => {
        var timeSinceStart = Date.now() - start;
        var animRatio = (timeSinceStart - delay) / duration;
        if (animRatio > 0) {
          if (animRatio > 1) {
            clearInterval(intervalId);
            intervalId = 0;
            utils.log("onChange Null");
            this.props.onChange(null);
          } else {
            var hRatio = 1 - animRatio * animRatio;
            utils.log("animate : " + hRatio);
            this.setState({ closignHeight: hRatio * 80 });
          }
        }
      }, 1000 / 60);
    }

    this.toogleInfos = this.toogleInfos.bind(this);
    this.getInfoButton = this.getInfoButton.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
    this.formatMessages = this.formatMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.setMessageSeen = this.setMessageSeen.bind(this);

    this.handleSaveRep = this.handleSaveRep.bind(this);
    this.scrollToQst = this.scrollToQst.bind(this);

    var that = this;
    utils.addListener("annee", "QuestionItem" + this.props.answered + this.props.question.idperso, (ev) => {
      var newRep = DAL.getReponse(that.props.question.id);
      that.setState({ rep: newRep });
    });
  }

  componentWillUnmount() {
    utils.removeListener("annee", "QuestionItem" + this.props.answered + this.props.question.idperso);
  }

  handleNewMessage() {
    DAL.getUser(auth.isAdmin() ? localData.getStorage("currentUserId") : "me")
      .then(res => {
        localData.setStorage("selectedUser", res);
        this.forceUpdate();
      });
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  toogleInfos() {
    this.setState({ detailsOpen: !this.state.detailsOpen });
  }

  getInfoButton() {
    return (
      <Button
        color="transparent"
        target="_blank"
        justIcon
        onClick={this.toogleInfos}
      >
        <ContactSupport />
      </Button>
    )
  }

  setMessageSeen() {
    var msgs = DAL.getMessagesPerQuestion(this.props.question.id);

    if (msgs) {
      var lastMsg = msgs[msgs.length - 1];
      DAL.setMessageSeen(lastMsg);
    }
  }

  getCollapsableDetails(classe) {
    var messagesParQuestion = DAL.getMessagesPerQuestion(this.props.question.id);
    var lastMsg = messagesParQuestion[messagesParQuestion.length - 1];

    if (this.state.detailsOpen && !auth.isAdmin() &&
      lastMsg && lastMsg.isAdmin && !lastMsg.repondu) {
      this.setMessageSeen();
    }
    var langSuffix = auth.isFr() ? "" : "en";

    return (
      <Collapse in={this.state.detailsOpen} timeout={{ enter: 666, exit: 666 }}>
        <div className={classe}  ref={this.myRef}
        name={"container"+this.props.question.idperso} >
          {this.state.detailsOpen && (<>
            <p>{utils.replaceA(this.props.question["texte" + langSuffix])}</p>

            {messagesParQuestion.length > 0 &&
              (<React.Fragment>
                <h6>{impoTxt.chatQuestionToTeam}</h6>
                {//this.formatMessages(messagesParQuestion)
                }

                <MessageHistory messages={messagesParQuestion} />
              </React.Fragment>)}

            {false && <h6 style={{
              clear: "both",
              paddingTop: 10
            }}>{impoTxt.chatDemanderRenseignements} </h6>}
            <NewMessage question={this.props.question.id} onSent={() => this.handleNewMessage()} />
          </>
          )}
        </div>
      </Collapse>
    );
  }

  formatMessages(messagesParQuestion) {
    return messagesParQuestion
      .map(msg => (
        <div key={msg.createdAt}>
          <h5>{msg.titre}</h5>
          <p>{msg.texte}</p>
          {msg.createdAt}
        </div>
      ));
  }

  sendMessage = ev => {
    if (this.state.texte.length > 1) {
      this.setState({ sendingMessage: true });
      DAL.saveMessage({
        titre: this.state.titre,
        texte: this.state.texte,
        question: this.props.question.id,
        user: auth.getUserInfo().id
      })
        .then(res => {
          utils.log(res);
          this.setState({
            titre: "",
            texte: "",
            sendingMessage: false,
          });
        });
    }
    else {
      //Message toast, "plz écrivez un message pour en envoyer yun"
    }
  }

  handleSaveRep() {
    DAL.getUser(auth.isAdmin() ? localData.getStorage("currentUserId") : "me")
      .then(res => {
        localData.setStorage("selectedUser", res);
        this.setState({ rep: DAL.getReponse(this.props.question.id) });
        utils.callEvent("userHasRep");
      });
  }

  scrollToQst(){
    // TODO Ludovic : scrollTo ne marche pas car ref.offsetTop ne fonctionne pas
    //     ... raison => flex || collapsable ?
    //console.log(this);
   // window.scrollTo(0, this.myRef.current.offsetTop);
    /*scroller.scrollTo(this["container"+this.props.question.idperso], {
      offset: -200,
      duration: 666,
      delay: 0,
      smooth: 'easeInOutQuart'
  });*/
  }
  getQuestion() {
    var question = this.props.question;
    var { classes, onChange, ...rest } = this.props;
    rest = {scrollToTop:  this.scrollToQst, ...rest};
    var combinedOnChange = () => {
      this.handleSaveRep();
      if (onChange) {
        onChange();
      }
    }

    if (question) {
      if ("choixdereponse" in question &&
        question.choixdereponse.length > 0) {
        if (question.reptype !== 2)
          utils.log("ATTENTION, la question " + question.titre + " as un choix de réponse mais n'est pas de type choix de réponse!");

        return <QuestionItemChoix onChange={combinedOnChange}  {...rest} rep={this.state.rep} widthLarge={widthLarge} />;

      } else if (question.reptype === 1 ||
        question.reptype === 6) {
        return <QuestionItemTexte onChange={combinedOnChange}  {...rest} rep={this.state.rep} widthLarge={widthLarge} />;  // question={this.props.question}

      } else if (question.reptype === 3) {
        return <QuestionItemDate onChange={combinedOnChange}  {...rest} rep={this.state.rep} widthLarge={widthLarge} />; //  question={this.props.question}

      } else if (question.reptype === 4 ||
        question.reptype === 5) {
        return <QuestionItemChiffre onChange={combinedOnChange}  {...rest} rep={this.state.rep} widthLarge={widthLarge} />;   //question={this.props.question}

      } else {
        return <QuestionItemBool onChange={combinedOnChange}  {...rest} rep={this.state.rep} widthLarge={widthLarge} />;// question={this.props.question}  {...this.props}
      }

    }
    else
      return null;
  }

  render() {
    const { classes, question } = this.props;
    //v <GridItem xs={12}  sm={this.state.widthLarge} md={this.state.widthLarge} lg={this.state.widthLarge}  style={{
    // display:"flex",
    //  alignContent:"space-between"}} >
    //var maxH = this.state.closignHeight > 0 ? this.state.closignHeight : 300; // style={{ maxHeight: maxH }}

    var currentStateClass = classes.defaultPaper;
    if (question && question.idperso === "special-pret-a-faire") {
      currentStateClass = classes.InfoComplete;
    }
    else if (this.props.isTarget) {
      currentStateClass = classes.SelectedPaper;
    }
    else if (this.props.hasNotification) {
      currentStateClass = classes.NotificationPaper;
    }

    return (
      <GridItem xs={12} sm={12} md={widthLarge} lg={4}
      >
        <Paper className={[classes.Paper, currentStateClass].join(" ")} style={{
          overflow: this.state.detailsOpen ? "auto" : "visible"
        }}>
          {this.getInfoButton()}
          {this.getQuestion()}
          {this.getCollapsableDetails(classes.Collapse)}
        </Paper>
      </GridItem>
    );
  }
}

QuestionItem.propTypes = {
  onAdminSave: PropTypes.func,
  onChange: PropTypes.func,
  question: PropTypes.object.isRequired
};

const QuestionPlaceholder = ({ classes }) => 
  (<GridItem xs={12} sm={12} md={6} lg={4}
  >
    <Paper className={classes.Paper}>
      <PulseLoader color="#26A65B" size="16px" margin="4px" style={{
        position: "absolute",
        left: "50%",
        top: "50%"
      }} />
    </Paper>
  </GridItem>)

const MyPerformantQuestion = useShallowEqual(QuestionItem);
const LazyQuestion = (props) => (
  <LazyLoad heigh={490} offset={50} placeholder={<QuestionPlaceholder classes={props.classes} />}>
    <QuestionItem {...props} />
  </LazyLoad>
)


export default withStyles(basicsStyle)(LazyQuestion);

