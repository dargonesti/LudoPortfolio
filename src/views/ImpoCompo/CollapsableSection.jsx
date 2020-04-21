import React, {
  useState, useEffect
} from "react";
// @material-ui/core components 

import withStyles from "@material-ui/core/styles/withStyles";
import { Collapse, Button } from '@material-ui/core';
import { ExpandMore, ExpandLess } from "@material-ui/icons";

import profilePageStyle from "assets/jss/material-kit-react/views/adminPages.jsx";

/**** ALTERNATIVE : PAPER
   <Paper className={classes.UserSummaryPaper}>

    <h3 style={{ paddingBottom: 10 }} >{this.getExpandBtn("openAdmin")}{impoTxt.sumSectAdmin}</h3>

    <Collapse in={this.state.openAdmin} timeout={{ enter: 666, exit: 666 }}>
      <SectionAdmin user={this.state.user} />
    </Collapse>
  </Paper>
 */



const CollapsableSection = ({ startOpen, onOpen, disabled = false, inverseIcons, paper, titre, sousTitre, children, classes }) => {
  let [open, setOpen] = useState(startOpen ? true : false);
  let [delayedOpen, setDelayedOpen] = useState(startOpen ? true : false);
  var style = {};
  if (disabled) {
    style.color = "#aaa"
  }

  useEffect(() => {
    let idTimeout = -1;
    if (open) {
      setDelayedOpen(true);
    }
    else {
      idTimeout = setTimeout(() => {
        setDelayedOpen(false);
      }, 666);
    }
    return () => {
      clearTimeout(idTimeout);
    }
  }, [open]);

  return (
    <>
      <h3 style={style}>
        <Button onClick={() => {
          setOpen(!open);
          if (onOpen) onOpen(!open);
        }}
          style={{
            display: "inline-block",
            float: "left"
          }}
          disabled={disabled}
        >
          {open ^ inverseIcons ?
            <ExpandLess className={classes.expandIcon} /> :
            <ExpandMore className={classes.expandIcon} />}
        </Button>
        {titre}</h3>
      <Collapse in={open} timeout={{ enter: 666, exit: 666 }}>
        {(delayedOpen || open) && (<>
          {sousTitre && <i>{sousTitre}</i>}
          {children}
        </>)}
      </Collapse>
    </>
  );
};

export default withStyles(profilePageStyle)(CollapsableSection);
