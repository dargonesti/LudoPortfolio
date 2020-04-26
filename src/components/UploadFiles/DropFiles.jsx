/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, {
  useState, useEffect
} from "react";
 
import BlockUi from 'react-block-ui';

import Dropzone from "react-dropzone";
 

import SmallerTextField from "views/ImpoCompo/SmallerTextField";
import ProgressOverlay from "views/ImpoCompo/ProgressOverlay";

import axios from "axios";

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from 'utils/auth';
import utils from "utils/utils";
import translatedTxt from 'texts/localization';

/* STYLES */

const dropzoneStyle = {
  width: 130,
  //height: "50%",
  margin: 5,
  border: "2px dashed green",
  borderRadius: 5,
  float: "left"
};

const tutoStyle = (theme) => ({
  /* Examples : */
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

  line: {
    border: "2px dashed grey",
    borderRadius: 5,
    margin: 3,
    position: "relative",
    display: "flex",
    justifyContent: "space-between"
  },

  files: {
  },
  "@media (max-width: 700px)": {    
    line: {
      position: "relative",
      display: "block",
    },
  }
});

//#WoW, so simple!
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiOutlinedInput: {
      input: {
        paddingTop: 5,
        paddingBottom: 5
      }
    },
    MuiInputLabel: {
      shrink: {
        color: "rgba(0,0,0,0) !important"
      },
      formControl: { top: -10 }
    },
    MuiInput: {
      formControl: {
        marginTop: "0px !important",
      }
    }
  }
});

/*  CODE - Sous Component, LINE - */
const formatList = ["jpg", "jpeg", "png", "pdf", "webp"];
const acceptedFormat = /^.*\.(jpg|jpeg|png|pdf|webp)$/i;

var i = 0;
const optionsFeuillets = DAL.getFeuillets().map(fl =>
  <option value={fl.idperso} key={fl.idperso + (i++)}>{fl.titre}</option>);
const optionsDepenses = DAL.getDepenses().map(fl =>
  <option value={fl.idperso} key={fl.idperso}>{fl.titre}</option>);
const optionsAll = optionsFeuillets.concat(optionsDepenses).concat([<option value="" key="null"></option>]);

////////////// FILE LINE
const FileLine =  (({ fileObj, onChange, onRemove, classes }) => {
  var file = fileObj.file;
  var [fileToUpload, setFileToUpload] = useState({ cat: "", titre: "", ...fileObj });
  var [uploadProgress, setProgress] = useState(104);

  useEffect(() => {
    utils.addListener("uploadProgress-" + fileObj.name, "FileLine", (newProgress) => {
      utils.log("Catched Event - Progress " + newProgress + " on file " + fileObj.name);

      if (newProgress > 98) {
        var newFile = { ...fileToUpload, done: true };
        setFileToUpload(newFile);
        if (onChange) onChange(newFile);
      }
      setProgress(newProgress);
    });
    return () => {
      utils.removeListener("uploadProgress-" + fileObj.name);
    }
  }, []);

  var selFileType = (
    <Select
      style={{ marginLeft: 10 }}
      id="idTestCHANGEME"
      value={fileToUpload.cat}
      onChange={(ev) => {
        var newFile = { ...fileToUpload, cat: ev.target.value };
        setFileToUpload(newFile);
        if (onChange) onChange(newFile);
      }}
      input={
        <OutlinedInput
          name="type"
          id="outlined-age-native-simple"
          labelWidth={100}
        />
      }
    >
      {optionsAll}
    </Select>);

  var progressBar = null;
  if (uploadProgress >= 0 && uploadProgress <= 100) {
    progressBar = <ProgressOverlay fromLeft={true} height="100%" color="rgba(0,255,0,0.3)" curStep={100 - uploadProgress} totalSteps={100} />;
  }

  return (<MuiThemeProvider theme={theme}>
    <div className={classes.line} style={{
      border: "2px dashed grey",
      borderRadius: 5,
      margin: 3,
      paddingLeft: 3,
      paddingRight: 3,
      //position: "relative"
    }}>
      <b>{file ? utils.shorterString(file.name, 12) : "[File name]"}</b>
      <SmallerTextField
        label="titre"
        value={fileToUpload.titre}
        onChange={val => {
          var newFile = { ...fileToUpload, titre: val };
          setFileToUpload(newFile);
          if (onChange) onChange(newFile);
        }}
        type="text" />
      <div>
        <b>Type :</b> {selFileType}
        <Button onClick={() => {
          onRemove();
        }}>
          <Clear />
        </Button>
      </div>
      {progressBar}
    </div>
  </MuiThemeProvider>);
});


////////TUTO DROP FILES
const TutoDropFiles =  (({ onSave, onChange, classes }) => {
  var [files, setFiles] = useState([]);
  var [uploading, setUploading] = useState(false);

  function wasAlreadyThere(newFile) {
    return files.some(file => file.name === newFile.name);
  }
  function onDrop(acceptedFiles, rejectedFiles) {
    acceptedFiles = acceptedFiles.map(fl => ({ file: fl, name: fl.name }));
    var realAccepted = acceptedFiles.filter((file) => acceptedFormat.test(file.name) && !wasAlreadyThere(file));
    var wrongFormatFiles = acceptedFiles.filter((file) => !acceptedFormat.test(file.name));
    var alrdyAdded = acceptedFiles.filter(wasAlreadyThere);

    if (wrongFormatFiles.length > 0) {
      auth.showToast(translatedTxt.toastPasBonFormat + formatList.join(", ") + ".", 3000, "danger");
    }
    if (alrdyAdded.length > 0) {
      auth.showToast(translatedTxt.toastFilesSameName, 3000, "danger");
    }

    //this.setState({ newFile: file });
    setFiles([...files, ...realAccepted]);
  }

  async function SaveFiles() {//onNext) {
    var annee = DAL.getAnnee("docs");//this.state.annee;
    var toUpload = files.filter(file => !file.done);

    if (uploading) {
      auth.showToast(translatedTxt.toastAlreadyUpload, 3000, "info");
      return false;
    }
    if (toUpload.some(file => !(file.cat) || !(file.titre))) {
      auth.showToast(translatedTxt.toastCatAndTitle, 3000, "danger");
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

          if (response && response.data) {
            await DAL.saveFile(titre, cat, 0, response.data.file, annee)
              .then(res => {
                //setUploading(false);
              }).catch(ex => {
                auth.showToast("Fichier : " + titre + " n'a pu être uploader.", 3000, "danger");
              });
          }
          resolve();
        });
      });
    }
    setUploading(false);
    //onNext();
    if (onSave) onSave();
    setFiles([]);

    auth.showToast(translatedTxt.toastSuccessUpload, 3000);
  }

  //onChange(files);

  ///////////MAIN RENDER 
  return (
    <BlockUi tag="div" blocking={uploading} style={{ width: "100%" }}>
      <Dropzone
        style={dropzoneStyle}
        inputProps={{
          style: {
            width: "inherit"
          }
        }}
        onDrop={(files) => onDrop(files)}>
        <div style={{ paddingTop: 0, textAlign: "center" }}>
          {translatedTxt.docDragDrop}
        </div>
      </Dropzone>

      <IconButton style={{ margin: 7 }} disabled={uploading || files.length < 1} onClick={SaveFiles}>
        <CloudUpload />
      </IconButton>

      <br />

      <div className={classes.files}>
        {files.map((file, ind) => <FileLine key={file.name} fileObj={file} onChange={newFile => {
          files[ind] = newFile;
          setFiles(files);
          onChange(files);
        }}
          onRemove={() => {
            setFiles(files.filter(fl => fl.name != file.name));
          }} />)}
      </div>
    </BlockUi>
  );
});


export default TutoDropFiles; //basicsStyle
