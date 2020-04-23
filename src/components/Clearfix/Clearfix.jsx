import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
 

const style = {
  clearfix: {
    "&:after,&:before": {
      display: "table",
      content: '" "'
    },
    "&:after": {
      clear: "both"
    }
  }
};

function Clearfix({ ...props }) {
  const { classes } = props;
  return <div className={classes.clearfix} />;
}

Clearfix.propTypes = {
  classes: PropTypes.object.isRequired
};

export default (Clearfix);
