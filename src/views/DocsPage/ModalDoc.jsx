/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { useState } from "react";
 
import DocDetailModal from "./DocDetailModal.jsx"; 

import 'react-block-ui/style.css';

const ModalDoc = (props) => {
   let [files, setFiles] = useState(props.files);
   let [openedFile, setOpenedFile] = useState(props.openedFile);
   let [savedChanges, setSavedChanges] = useState(props.savedChanges);

   function handleClose() {       
    if (props.onClose) {
        props.onClose();
    }
    else {
        setOpenedFile(null);
    }
   }

   function handleChangeFile(iNav) {
       var indCur = files.findIndex(f => f ==  openedFile) + iNav;
       var indNext = indCur >= 0 ? indCur :  files.length - 1;
       setOpenedFile(files[indNext % files.length]);
   } 

   var i = 0 + savedChanges * 1000;

   return  (<DocDetailModal
   key={openedFile ? openedFile._id : i++}
   file={openedFile}
   onClose={handleClose}
   onChangeFile={handleChangeFile}
   onSaveChange={(id, titre, montant, cat) => { 
       var f = files.findIndex(f => f._id == id);
       files[f].montant = montant;
       files[f].titre = titre;
       files[f].category = cat;
       setFiles(files);
       setSavedChanges(savedChanges + 1);
   }} />);
}


export default ModalDoc;
