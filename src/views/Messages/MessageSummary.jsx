import React, { Fragment } from "react"; 
import PropTypes from "prop-types";
// nodejs library that concatenates classes 
// @material-ui/core components 

import withStyles from "@material-ui/core/styles/withStyles";
// core components
import { Collapse, Button } from '@material-ui/core'; 
import Clearfix from "components/Clearfix/Clearfix.jsx";
 
import MessageBlock from "views/Messages/MessageBlock.jsx";
import NewMessage from "views/Messages/NewMessage.jsx";

import NotificationBadge from 'react-notification-badge';

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from "utils/auth.js"; 
import localData from "utils/DataAccess/localData.js"; 
import impoTxt from 'texts/localization';

import messageStyle from "assets/jss/material-kit-react/views/messages.jsx";

import { ExpandMore, ExpandLess, QuestionAnswerRounded, InsertDriveFileRounded } from "@material-ui/icons";
import { scroller } from 'react-scroll'


function getDocOrQst(msg, fileUploads) {
    if (msg.question) {
        var qst = DAL.getQuestionById(msg.question);
        return qst;
    } else if (msg.doc && Array.isArray(fileUploads)) {
       // var usr = (auth.isAdmin() ? DAL.getCachedUser(msg.user) : auth.getUserInfo());
        var doc = fileUploads.find(file => file._id === msg.doc);
        return doc;
    }
}

const SectionMessages = withStyles(messageStyle)(({ messages, notifications, classes }) => {
    var nbSplits = 4;
    // TODO : Gérer nbSplits différemment?
    var sections = [];
    
    var usr;
    if(auth.isAdmin()){
        if(messages && messages.length >0){
            usr = DAL.getCachedUser(messages[0][0].user)
        }else{
            return null; // may need more tests
        }
    }else{
        usr =  auth.getUserInfo();
    }
    var fileUploads = usr.fileuploads;//.find(file => file._id === msg.doc);
    let filteredMessages = messages.filter(m=>getDocOrQst(m[0], fileUploads));

    let mlen = filteredMessages.length/nbSplits;
    for (var i = 0; i < nbSplits; i++) {
      sections.push(filteredMessages.slice(Math.ceil(i * mlen),
         Math.ceil((i + 1) * mlen)));
    }
  
    return (<div className={classes.flexGroup}>
      {sections.map((sect, indSect) => <div className={classes.flexColumn} key={indSect}>
        {sect.map(notif => {
            let newNotif = notifications && notifications
            .find(nl=>nl.some(n=>n._id===notif[0]._id));
        return <MessageSummary classes={classes} newNotif={newNotif} key={notif[0]._id} notif={notif} />})}
      </div>)}
    </div>);
  });
class MessageSummary extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: props.open ? true : false,
            newMsg: []
        };

        this.getMB = this.getMB.bind(this);
    }

    componentDidMount() {

    }

    getMB(msg, question, doc) {
        var that = this;
        return (<Fragment key={"collapseNewMsg" + msg._id}>
            {(question || doc) && <Collapse in={this.state.open} timeout={{ enter: 666, exit: 666 }} >

                <NewMessage newNotif={that.props.newNotif} question={question} doc={doc} onSent={(message) => {
                   // var itemId = question || doc;
                    var newMessages = [
                        message
                        , ...that.state.newMsg];
                 
                        that.setState({newMsg : newMessages});                   
                }} />
            </Collapse>}
            <MessageBlock className={this.props.classes.mbSummary} key={(msg.createdAt || Date.now()).toString()} titre={msg.titre} texte={msg.texte} dateSent={msg.createdAt} fromSelf={msg.admin  ? auth.isAdmin() : !auth.isAdmin()} />
        </Fragment>);
    }

    getTitre(msg, fileUploads) {
        if (msg.question) {
            var qst = DAL.getQuestionById(msg.question);
            return qst ? qst.titre : "Question supprimée";
        } else if (msg.doc && Array.isArray(fileUploads)) {
           // var usr = (auth.isAdmin() ? DAL.getCachedUser(msg.user) : auth.getUserInfo());
            var doc = fileUploads.find(file => file._id === msg.doc);
            return doc ? doc.titre : "Document supprimé";
        }
        return "-non trouvé-";
    }
    setScrollTarget(msg) {
        if (msg.question) {
           // var qst = DAL.getQuestionById(msg.question);

        } else if (msg.doc) {
            //var usr = (auth.isAdmin() ? DAL.getCachedUser(msg.user) : auth.getUserInfo());
            //var doc = usr.fileuploads.find(file => file._id === msg.doc);

        } else {
            auth.showToast(impoTxt.toastErrElemNonScrollable, 3000, "danger");
        }
    }
    render() {
        const { classes, notif, newNotif} = this.props;
        var notifsAndNew = [ ...this.state.newMsg, ...notif ];
        
        var msg = notifsAndNew[0];
        var restMsg = notifsAndNew.slice(1, notifsAndNew.length);


        var usr = (auth.isAdmin() ? DAL.getCachedUser(msg.user) : auth.getUserInfo());  
        if(!usr) return <p>User Not Found</p>; 
        var fileUploads = usr.fileuploads;//.find(file => file._id === msg.doc);

        var expandse = (<Button onClick={e => this.setState({ open: !this.state.open })} style={{
            display: "inline-block",
            float: "left"
        }}>
            {this.state.open ?
                <ExpandLess className={classes.expandIcon} /> :
                <ExpandMore className={classes.expandIcon} />}
            {notifsAndNew.length > 1 &&
                <NotificationBadge
                    count={notifsAndNew.length}
                    style={{backgroundColor:"rgb(147, 148, 147)"}}
                    // top={-45} 
                    //effect={Effect.SCALE}
                    effect={[null, null, { top: '-4px', right: "-4px" }, {}]}
                    frameLength={45.0} />}
        </Button>);

        var iconTag = (<div className={classes.tagType} >
            {msg.question ?
                <QuestionAnswerRounded /> :
                <InsertDriveFileRounded />}
        </div>);

        if (msg.question || msg.doc) {

            let docQst = getDocOrQst(msg, fileUploads);
            // this.getTitre(msg, fileUploads)

            if(!docQst){
                return null;
            }
            return (<div className={classes.flexItem + (newNotif ? " " + classes.unseenMessage : "")}>
                <Clearfix />
                {iconTag} <span className={classes.qstTitre} onClick={e => {
                    auth.setScrollTarget(msg);
                    // TODO : Scroll to ? ( Il faudrait faire un système d'events attaché à auth... maybe?)

                    scroller.scrollTo(this[auth.getScrollTarget()], {
                        offset: 200,
                        duration: 800,
                        delay: 0,
                        smooth: 'easeInOutQuart'
                    });
                }}>
                    {docQst.titre}
                </span>
                <Clearfix />
                {expandse}
                {this.getMB(msg, msg.question, msg.doc)}
                <Clearfix />
                {restMsg.length > 0 &&
                    <Collapse in={this.state.open} timeout={{ enter: 666, exit: 666 }}>
                        {restMsg.map(msg => this.getMB(msg))}
                    </Collapse>}
            </div>);
        }
        else {
            return null; // TODO : Supporter les messages globaux?
        }

    }
}

MessageSummary.propTypes = {
    notif: PropTypes.array.isRequired
};


export default SectionMessages;
