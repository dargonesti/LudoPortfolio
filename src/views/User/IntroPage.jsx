/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, {
  Fragment, useState, useEffect
} from "react";
import impoHOC from "HoC/impoHOC.js";
import { FadeLoader } from 'halogenium';

import withStyles from "@material-ui/core/styles/withStyles";
import { Typography,  Button, Slide, Paper} from '@material-ui/core';
import { ContactSupport,  } from "@material-ui/icons";
import Clearfix from "components/Clearfix/Clearfix.jsx";

import Carousel from "react-slick";
import imgFac from "assets/img/impotx/factureCrushed.webp";
import imgCoffee from "assets/img/impotx/coffee.webp";
import imgSwipe from "assets/img/impotx/cardSwipe.webp";
import ImageMessages from "assets/img/impotx/echangeMessage.png";

import exUp1 from "assets/img/impotx/exUp1.jpg";
import exUp1w from "assets/img/impotx/exUp1.webp";
import exUp2 from "assets/img/impotx/exUp2.jpg";
import exUp2w from "assets/img/impotx/exUp2.webp";
import exUp3 from "assets/img/impotx/exUp3.jpg";
import exUp3w from "assets/img/impotx/exUp3.webp";
import exUp4 from "assets/img/impotx/exUp4.jpg";
import exUp4w from "assets/img/impotx/exUp4.webp";

import BlockUi from 'react-block-ui';

import ProgressHeader from "views/ImpoCompo/ProgressHeader.jsx";

import TutoBoolQuestion from "./TutoBoolQuestion";
import TutoChoixQuestion from "./TutoChoixQuestion";
import TutoTextQuestion from "./TutoTextQuestion";
import TutoDropFiles from "components/UploadFiles/DropFiles";

import axios from "axios";

import DAL from "utils/DataAccess/DALimpotx.js";
import localData from "utils/DataAccess/localData.js";
import auth from "utils/auth.js";
import utils from "utils/utils.js";
import impoTxt from 'texts/localization';

import profilePageStyle from "assets/jss/material-kit-react/views/adminPages.jsx";

const HeaderH = 50;

const tutoStyle = {
  skip: {
    color: "#f44336",
    "&:hover": {
      backgroundColor: "rgba(250, 0, 0, 0.08)"
    }
  },
  nextPrev: {
    "&:hover": {
      backgroundColor: "rgba(0, 250, 0, 0.2)"
    }
  },
  done: {
    color: "#4caf50",
    "&:hover": {
      backgroundColor: "rgba(0, 250, 0, 0.2)"
    }
  },
  contentPaper:
  {
    overflowX: "hidden", position: "absolute", top: 0, marginTop: 66, paddingLeft: 20,
    width: "calc( 100% - 100px )", height: "calc( 100% - 100px )", left: 50,
    "@media (max-width: 500px)":{
      height:"100%", width:"100%", left:0, top :0, marginTop:0
    }
  }
};

const Loader = () => <FadeLoader style={{ top: "calc( 50% - 25px)", left: "calc( 50% - 25px )", position: "relative" }}
  color="#26A65B" size="160px" margin="0px" />;

var hasQuestions = false;

function isLoading() {
  return !hasQuestions;
}

const AnimationNotXS = ({children, direction, shown, width})=>{
  if(window.innerWidth > 500){
    return (<Slide direction={direction} in={shown} timeout={1000}>
    {children}
    </Slide>);
  }else
  {
    return shown ? children : null;
  }
};

const TutoWraper = withStyles(tutoStyle)(({ classes, onChangeSection, shown, dir, onNext, onPrev, onDone, children, sectionInd, stepInd, stepsTotal, width }) => {
  var direction = (dir ? shown : !shown) ? "up" : "down";
  // console.log("Direction : " + direction + "   dir : " + dir + " shown : " + shown);


  return (<AnimationNotXS direction={direction} shown={shown} >
    <Paper elevation={4} className={classes.contentPaper} >

      <ProgressHeader
        onClickHeader={onChangeSection}
        headerTexts={[impoTxt.headquestions, impoTxt.headdocs, impoTxt.sumSectMsg]}
        stepCountPerSection={[stepsTotal, stepsTotal, stepsTotal]}
        curSectionInd={sectionInd} stepNo={stepInd} animateDelay={0} animateDuration={999}
        resetAnimation={getAnimReseter(stepInd)} />

      {isLoading() && false
        ?
        <Loader />
        :
        (<Fragment>
          {children}

          <div style={{ position: "relative", bottom: 0, left: "calc(50% - 120px)" }}>
            <Button className={classes.nextPrev}
              disabled={stepInd === 0 && sectionInd === 0}
              onClick={onPrev}>{"<<<"} {impoTxt.tutoPrev}</Button>
            {stepInd < stepsTotal - 1 || sectionInd < 2 ?
              <Button className={classes.nextPrev}
                onClick={onNext}>{impoTxt.tutoNext} {">>>"}</Button>
              :
              <Button className={classes.done}
                onClick={onDone}>{impoTxt.tutoDone}</Button>}
          </div>
        </Fragment>)
      }
      <div style={{ position: "absolute", top: HeaderH + 1, right: 0 }}>
        <Button className={classes.skip}
          onClick={() => {
            localData.setStorage("skipIntro", true);
            utils.callEvent("changeIntroStep", "skip");
            window.location.reload();
          }}>{impoTxt.tutoSkip}</Button>
      </div>
    </Paper>
  </AnimationNotXS>);
}); 

const QstTutoBool = (props) => {
  var questions = props.questions || [];
  questions = questions.filter(qst => qst != null);
  return (<TutoWraper {...props} loading={isLoading()}>
    <h3>{impoTxt.tutoIntroQst}</h3>
    <h5><i>{impoTxt.tutoStep} {props.stepInd + 1} / {props.stepsTotal}</i></h5>

    <Typography variant="body1">{impoTxt.tutoQstBool}</Typography>

    <br />
    {questions.length > 0 ?
      questions.map(qst => <TutoBoolQuestion key={qst._id} question={qst} setSaveFn={props.setSaveFn} />)
      :
      <Loader />}
  </TutoWraper>);
}
const QstTutoChoix = (props) => {
  var questions = props.questions || [];
  questions = questions.filter(qst => qst != null);
 // var t = impoTxt.tutoFirstIntroMessage;
  return (<TutoWraper {...props} loading={isLoading()} >
    <h3>{impoTxt.tutoIntroQst}</h3>
    <h5><i>{impoTxt.tutoStep} {props.stepInd + 1} / {props.stepsTotal}</i></h5>

{props.stepInd == 0 && 
    <Typography style={{textAlign:"center", marginBottom:15}} variant="body1"><b>{utils.replaceBR(impoTxt.tutoFirstIntroMessage)}</b></Typography>
}
    <Typography variant="body1">{impoTxt.tutoQstChoice}</Typography>

    {questions.length > 0 ?
      questions.map(qst => <TutoChoixQuestion key={qst._id} question={qst} setSaveFn={props.setSaveFn} />)
      :
      <Loader />}
  </TutoWraper>);
}
const QstTutoText = (props) => {
  var questions = props.questions || [];
  questions = questions.filter(qst => qst != null);
  return (<TutoWraper {...props} >
    <h3>{impoTxt.tutoIntroQst}</h3>
    <h5><i>{impoTxt.tutoStep} {props.stepInd + 1} / {props.stepsTotal}</i></h5>

    <Typography variant="body1">{impoTxt.tutoQstText}</Typography>

    {questions.length > 0 ?
      questions.map(qst => <TutoTextQuestion key={qst._id} question={qst} setSaveFn={props.setSaveFn} />)
      :
      <Loader />}
  </TutoWraper>);
}

const TutoDocDisplay = (props) => {
  const settings = {
    dots: false, 
    arrows:false,
    infinite: true,
    autoplaySpeed:2300,
    speed: 990,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  };

  return (<TutoWraper {...props} loading={isLoading()} >
    <h3>{impoTxt.tutoIntroDoc}</h3>
    <h5><i>{impoTxt.tutoStep} {props.stepInd + 1} / {props.stepsTotal}</i></h5>

    <Typography variant="body1">{impoTxt.tutoDoc1}</Typography>

    <div style={{ margin: "auto", width: 350 }} >
      <Carousel   {...settings}>
        <div ><img
          height={250}
          src={ utils.canUseWebP() ? exUp3w : exUp3}
          alt="Coffee slide"
          className="slick-image"
        /></div>
        <div ><img
          height={250}
          src={ utils.canUseWebP() ? exUp2w : exUp2}
          alt="Swipe slide"
          className="slick-image"
        /></div>
        <div ><img
          height={250}
          src={ utils.canUseWebP() ? exUp4w : exUp4}
          alt="Swipe sld3"
          className="slick-image"
        /></div>
       {/*} <div ><img
          height={250}
          src={imgFac}
          alt="First slide"
          className="slick-image"
        /></div>{/**/}
      </Carousel>
    </div>

  </TutoWraper>)
}
const TutoDocDisplay2 = (props) => {
  var [uploading, setUploading] = useState(false);
  var [files, setFiles] = useState([]);

  async function SaveFiles(onNext) {
    var annee = DAL.getAnnee("docs");//this.state.annee;
    var toUpload = files.filter(file => !file.done);

    if (uploading) {
      auth.showToast(impoTxt.toastAlreadyUpload, 3000, "info");
      return false;
    }
    if (toUpload.some(file => !(file.cat) || !(file.titre))) {
      auth.showToast(impoTxt.toastCatAndTitle, 3000, "danger");
      return false;
    }

    setUploading(true);

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
    setUploading(false);
    onNext();
  }
  async function uploadFilesBefore(fnUpload) {
    SaveFiles(props.onNext);
  }

  var newProps = { ...props, onNext: uploadFilesBefore };

  return (
    <TutoWraper {...newProps} loading={isLoading()} >

      <h3>{impoTxt.tutoIntroDoc}</h3>
      <h5><i>{impoTxt.tutoStep} {props.stepInd + 1} / {props.stepsTotal}</i></h5>

      <Typography variant="body1">{impoTxt.tutoDoc2}</Typography>

      <br />
      <BlockUi tag="div" blocking={uploading} style={{ width: "100%" }}>
        <TutoDropFiles
          onChange={fl => {
            // console.log(fl);
            setFiles(fl);
          }} />
      </BlockUi>
      <br />
    </TutoWraper>)
}

const TutoMsgDisplay = (props) => {
  return (<TutoWraper {...props} loading={isLoading()} >

    <h3>{impoTxt.tutoIntroMsg}</h3>
    <h5><i>{impoTxt.tutoStep} {props.stepInd + 1} / {props.stepsTotal}</i></h5>

    <Typography variant="body1">{impoTxt.tutoMsg1}</Typography>

    <br />
    <div>
      {impoTxt.tutoClickIcon}<ContactSupport />{impoTxt.tutoAccessMessages}
    </div>
    <img src={ImageMessages} alt="tuto echange messages" />
    {/*impoTxt.tutoForAccess}
    <div style={{ border: "1px dashed rgba(50,250,50, 0.9)", borderRadius: 4, width: 250 }}>
      <NewMessage onSent={(texte) => {
        auth.showToast(impoTxt.tutoSentMsg);
      }} />
    </div>
    */}
    <Clearfix />
    <br />

  </TutoWraper>)
}
const TutoMsgDisplay2 = (props) => {
  return (<TutoWraper {...props} loading={isLoading()} >

    <h3>{impoTxt.tutoIntroMsg}</h3>
    <h5><i>{impoTxt.tutoStep} {props.stepInd + 1} / {props.stepsTotal}</i></h5>

    <Typography variant="body1">{impoTxt.tutoMsg2}</Typography> <br />
    <Typography variant="body1">{impoTxt.tutoMsg21}</Typography> <br />

  </TutoWraper>)
}

const lstQst = [
  p => <QstTutoChoix {...p} />,
  p => <QstTutoChoix {...p} />,
  p => <QstTutoText {...p} />,
  p => <QstTutoBool {...p} />,];

const lstDocs = [
  p => <TutoDocDisplay {...p} />,
  p => <TutoDocDisplay2 {...p} />
];

const lstMsgs = [
  p => <TutoMsgDisplay {...p} />,
  p => <TutoMsgDisplay2 {...p} />
];

const sections = [lstQst, lstDocs, lstMsgs];

//Page 1 Qst : Voiçi quelques questions faciles Oui / Non, 
// vous pouvez en sauter et passer à la page suivante quand vous le désirez! :)
//Page 2 Qst : Voiçi quelques questions à choix de réponse, ... 
//Page 3 Qst : Voiçi quelques questions en texte, ... 
//var questionsTuto = ["user-moyen-de-comm", "corresp-language", "user-first-name", "user-last-name", "user-sex", "user-tel-day"];

var saveOnNext = {};
var animReseter = {};
function getAnimReseter(id) {
  if (animReseter[id] == null) animReseter[id] = Math.random() * 100;
  return animReseter[id];
}
function resetAnim(id) {
  animReseter[id] = Math.random() * 100;
}

const IntroPage = (props) => { 

  var [direction, setDirection] = useState("next");
  var [indQst, setIndQst] = useState(0);
  var [indSection, setIndSection] = useState(0);
  //var [navigCount, setNavigCount] = useState(0);

  // eslint-disable-next-line
  var [questions, setQuestions] = useState([]);

  function curSectLen() {
    if (indSection >= 0 && indSection < sections.length)
      return sections[indSection].length;
    return sections[0].length;
  }

  useEffect(() => {
    DAL.getQuestions()
      .then(res => {
        setQuestions(res);
        hasQuestions = true;
      });
  }, []);

  function nextTuto() {
    Object.values(saveOnNext).forEach(fnSave => fnSave());
    saveOnNext = {};
    setDirection("next");


    if (indSection < sections.length - 1 && indQst + 1 == curSectLen()) {
      setIndQst(0);
      setIndSection(indSection + 1);
    } else {
      resetAnim(indQst + 1 % curSectLen());
      setIndQst((indQst + 1) % curSectLen());
    }
  }
  function prevTuto() {
    saveOnNext = {};
    setDirection("prev");

    if (indQst == 0 && indSection > 0) {
      setIndQst(sections[indSection - 1].length - 1);
      setIndSection(indSection - 1);
    } else {
      setIndQst((curSectLen() + indQst - 1) % curSectLen());
    }
  }
  function tutoDone() {
    Object.values(saveOnNext).forEach(fnSave => fnSave());
    saveOnNext = {};
    setDirection("next");

    if (indSection < sections.length - 1) {
      setIndQst(0);
      setIndSection(indSection + 1);
    } else {
      localData.setStorage("skipIntro", true);
      utils.callEvent("changeIntroStep", "skip");
      window.location.reload();
    }
  }
  function changeSection(ind) {
    saveOnNext = {};
    setDirection("next");
    setIndQst(0);
    setIndSection(ind);
  }

  //console.log(questionsPerStep[0].map(DAL.getQuestion));

  return <Fragment>
    <div style={styleCatchMouseEvents} ></div>
    {sections.reduce((ret, cur, indS) => [...ret, cur.map((fnQstItem, ind) => fnQstItem({
      shown: ind === indQst && indS === indSection,
      dir: direction == "next",
      onNext: nextTuto,
      onPrev: prevTuto,
      onDone: tutoDone,
      onChangeSection: changeSection,
      key: ind,
      sectionInd: indSection,
      stepsTotal: curSectLen(),
      stepInd: ind,
      questions: questionsPerStep[ind].map(DAL.getQuestion),
      setSaveFn: (saveFn, idperso) => {
        saveOnNext[idperso] = saveFn;
      }
    }))], [])}
  </Fragment>;
};
var questionsPerStep = [
  ["corresp-language", "user-moyen-de-comm"],
  ["user-sex", "remote-choice"],
  ["user-first-name", "user-last-name", "user-tel-day"],
  ["diplome-credit", "user-biens-etranges"],
]//.map(arQst=>arQst.map(idperso=>DAL.getQuestion(idperso)));


const styleCatchMouseEvents = {
  height: "100%",
  width: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  overflow: "visible",
  pointerEvents: "all",
  backgroundColor: "rgba(250,250,250,0.0001) !important",
};

export default withStyles(profilePageStyle)(impoHOC(IntroPage, "UserProfile"));
