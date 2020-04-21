/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, {
  useState, useEffect
} from "react";

import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';

import { Button, OutlinedInput, Select, } from "@material-ui/core";

import Dropzone from "react-dropzone";

import {Clear } from "@material-ui/icons";

import SmallerTextField from "views/ImpoCompo/SmallerTextField";
import ProgressOverlay from "views/ImpoCompo/ProgressOverlay";

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from 'utils/auth';
import utils from "utils/utils";
import impoTxt from 'texts/localization'; 

/* STYLES */

const dropzoneStyle = {
  width: 130,
  height: "50%",
  margin: 5,
  border: "2px dashed green",
  borderRadius: 5
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
    position: "relative"
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


const FileLine = withStyles(tutoStyle)(({ fileObj, onChange, onRemove, classes }) => {
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
      position: "relative"
    }}>
      <b>{file ? utils.shorterString(file.name, 12) : "[File name]"}</b> -
    <SmallerTextField
        label="titre"
        value={fileToUpload.titre}
        onChange={val => {
          var newFile = { ...fileToUpload, titre: val };
          setFileToUpload(newFile);
          if (onChange) onChange(newFile);
        }}
        type="text" />
      <b>Type :</b> {selFileType}
      <Button onClick={() => {
        onRemove();
      }}>
        <Clear />
      </Button>
      {progressBar}
    </div>
  </MuiThemeProvider>);
});


/*  CODE - Main Component, DropFiles - */

const TutoDropFiles = ({ onSave, onChange }) => {
  var [files, setFiles] = useState([]);

  function wasAlreadyThere(newFile) {
    return files.some(file => file.name === newFile.name);
  }
  function onDrop(acceptedFiles, rejectedFiles) { 
    acceptedFiles = acceptedFiles.map(fl => ({ file: fl, name: fl.name }));
    var realAccepted = acceptedFiles.filter((file) => acceptedFormat.test(file.name) && !wasAlreadyThere(file));
    var wrongFormatFiles = acceptedFiles.filter((file) => !acceptedFormat.test(file.name));
    var alrdyAdded = acceptedFiles.filter(wasAlreadyThere);

    if (wrongFormatFiles.length > 0) {
      auth.showToast(impoTxt.toastPasBonFormat + formatList.join(", ") + ".", 3000, "danger");
    }
    if (alrdyAdded.length > 0) {
      auth.showToast(impoTxt.toastFilesSameName, 3000, "danger");
    }

    //this.setState({ newFile: file });
    setFiles([...files, ...realAccepted]);
  }

  onChange(files);
  return (<>
    <Dropzone
      style={dropzoneStyle}
      inputProps={{
        style: {
          width: "inherit"
        }
      }}
      onDrop={(files) => onDrop(files)}>
      <div style={{ paddingTop: 0, textAlign: "center" }}>
        {impoTxt.docDragDrop}
      </div>
    </Dropzone>

    <br />

    {files.map((file, ind) => <FileLine key={file.name} fileObj={file} onChange={newFile => {
      files[ind] = newFile;
      setFiles(files);
      onChange(files);
    }}
      onRemove={() => {
        setFiles(files.filter(fl => fl.name != file.name));
      }} />)}

    </>
  );
}

export default TutoDropFiles; //basicsStyle