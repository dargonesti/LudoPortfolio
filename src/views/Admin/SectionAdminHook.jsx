
import React, { Fragment , useState, useEffect} from "react";

import withStyles from "@material-ui/core/styles/withStyles";

import {Select, FormControl, InputLabel, Switch, Button } from '@material-ui/core';

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import messageStyle from "assets/jss/material-kit-react/views/messages.jsx";
import AdminNotes from "views/Admin/AdminNotes.jsx";

import utils from 'utils/utils';
import DAL from "utils/DataAccess/DALimpotx.js";
import localData from "utils/DataAccess/localData.js";
import impoTxt from 'texts/localization';



const SectionAdmin = (props) => {

    const { classes, ...rest } = props;
    const { user, fromSelf, className, } = props;

    let [annee, setAnnee] = useState(()=>DAL.getAnnee());
    let [etatCompte, setEtatCompte] = useState("");
    let [isTest, setIsTest] = useState(false);
    let [donneesAdmin, setDonneesAdmin] = useState({});
  
    useEffect(()=>{
        DAL.getDonneesAdmin(user._id, annee)
            .then(handleNewAdminData);
    }, []);

    function getAnnees() {
        // TODO : Trouver année courrante plutôt que 2018
        // Todo : Min ( 10 ans ou la première réponse de l'utilisateur )
        var ret = [impoTxt.Toutes];
        for (var i = 0; i < 10; i++) {
            ret.push((new Date()).getFullYear() - i);
        }
        return ret;
    };

    let handleChangeAnnee = event => {
        var newVal = event.target.value;
        if (!utils.isNumeric(newVal)) {
            newVal = null;
        }
        setAnnee(newVal);

        DAL.setAnnee(newVal);

        DAL.getDonneesAdmin(localData.getStorage("selectedUser")._id, newVal)
            .then(handleNewAdminData);
    };
    let handleNewAdminData =(res) =>{
        var curUserData = res[user._id];
        if (curUserData) res = curUserData["etatCompte"];
        if (res) res = res.val;

        let newIsTest =null;
        if (curUserData) newIsTest = curUserData["isTest"];
        if(newIsTest) newIsTest = newIsTest.val;
        
        setEtatCompte(res||"");
        setIsTest(newIsTest || false);
        setDonneesAdmin(curUserData);
    };



    var classesCollapsedMsgs = [classes.collapseContainer, classes.textInBubble];
    if (!fromSelf)
        classesCollapsedMsgs.push(classes.ccNotMe);

    var buttonClasses = [classes.messageBlock,
    (fromSelf ? classes.mbMe : classes.mbNotMe)
    ];
    if (className)
        buttonClasses.push(className);

    buttonClasses = buttonClasses.join(" ");

    return (<Fragment>

        <GridContainer>

            <GridItem xs={12} sm={6} md={6}>

                <InputLabel htmlFor="age-native-simple">{impoTxt.Annee}</InputLabel>
                <Select
                    style={{ marginLeft: 10 }}
                    native
                    value={annee}
                    onChange={handleChangeAnnee}
                    inputProps={{
                        name: 'annee',
                        id: 'age-native-simple',
                    }}
                >
                    {getAnnees()
                        .map(annee =>
                            <option value={annee} key={annee}>{annee}</option>)}
                </Select>

            </GridItem>

            <GridItem xs={12} sm={6} md={6}>

                <FormControl className={classes.formControl}
                    style={{ width: "calc(100% - 65px" }}>
                    <InputLabel htmlFor="age-native-simple">{impoTxt.adminEtatCompte}</InputLabel>
                    <Select
                        native
                        style={{ width: "100%" }}
                        value={etatCompte}
                        onChange={ event => {
                            var newVal = event.target.value;
                            setEtatCompte( newVal);                    
                            DAL.saveDonneesAdmin(user._id, annee, "etatCompte", newVal);
                        }
                        }
                        inputProps={{
                            name: 'etatCompte',
                            id: 'etat-compte',
                        }}
                    >
                        {(true) && // cond si question jamais répondue
                            <option value="" />}
                        {[1, 2, 3, 4, 5, 6].map(num =>
                            <option value={num.toString()} key={num.toString()}>{num + " - "}{impoTxt["adminEtat" + num]}</option>)}

                    </Select>
                </FormControl>
            </GridItem>


            <GridItem xs={12} sm={6} md={6}>
                {impoTxt.adminEstCompteTest}
                    <Switch
                        checked={isTest}
                        onChange={(ev)=>{
                            var newVal = !isTest;
                            setIsTest( newVal);                    
                            DAL.saveDonneesAdmin(user._id, annee, "isTest", newVal);
                        }}
                        value="isTestVal"
                        classes={{
                            switchBase: classes.switchBase,
                            checked: classes.switchChecked,
                            icon: classes.switchIcon,
                            iconChecked: classes.switchIconChecked,
                            bar: classes.switchBar
                        }}
                    />
            </GridItem>

<GridItem xs={12} sm={6} md={6}>
        <Button disabled={false} onClick={()=>{
localData.setStorage("chatWindowClosed", (localData.getStorage("chatWindowClosed") || []).filter(closedId=>closedId!=user._id));
        }}  >{impoTxt.adminOpenChat}</Button>
</GridItem>
        </GridContainer>

        <AdminNotes {...rest} annee={annee} donneesAdmin={donneesAdmin} />

    </Fragment>
    );
}

export default withStyles(messageStyle, { withTheme: true })(SectionAdmin);