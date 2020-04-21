/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { TextField } from "@material-ui/core/";

import debounce from "lodash.debounce";

import customInputStyle from "assets/jss/material-kit-react/components/customInputStyle.jsx";

import utils from "utils/utils";

class ThrottledTextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastEdit: 0
    };

    this.animId = -1;

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDebounced = this.handleChangeDebounced.bind(this);
  }

  handleChange = (ev) => {
    utils.log("filtre input call");
    this.handleChangeDebounced(ev.target.value);

    if (this.animId < 0) {
      utils.log("startInterval");
      this.animId = setInterval(() => {
        this.forceUpdate();
        //console.log("anim Step");
      }, 1000 / 60);
    }

    if(!this.props.noAnimation)
      this.setState({ lastEdit: Date.now() });
  }

  handleChangeDebounced = debounce((value) => {
    this.props.onChange(value);
  }, this.props.delay, { leading: false, trailing: true })

  componentWillUnmount() {
    if (this.animId > 0) {
      clearInterval(this.animId);
      this.animId = -1;
    }
  }


  getWidth(ratio) {
    return Math.min(100, ratio * 100) + "%";
  }
  getHeight(ratio) {
    var ret = 0;
    //if (ratio < 0.5) ret = (ratio *ratio ) ;
     if (ratio <= 1) ret = ratio*ratio ;
     else if (ratio > 1) ret = 1 + (1 - ratio) * 4;
     if(ratio < 1 && ratio != 0) ret = 1;
    // if (ratio < 1.25) ret = (1 - (ratio - 1) * 4) ** 2;
    return (ret * 100 ) + "%";
  }
  getColor(ratio) {
    var alpha = 0;
    if (ratio < 0.5) alpha = (ratio * 2) ** 2;
    else if (ratio <= 1) alpha = 1;
    else if (ratio > 1) alpha = 1 + (1 - ratio) * 4;

    var blue = 200;
    if(ratio >0.5) blue = 200 - (Math.min(1,ratio)-0.5) * 2 * 175;

    return "rgba(25,200,"+blue+"," + alpha / 2 + ")";
  }

  render() {
    var ratio = 0;
    if (this.animId > 0) {
      ratio = (Date.now() - this.state.lastEdit) / this.props.delay;
      ratio = Math.min(1.25, Math.max(0, ratio));
      if (ratio >= 1.25) {
        clearInterval(this.animId);
        this.animId = -1;
      }
     // console.log(ratio);
    }

    return (
      <div style={{
        border: 0,
        display: "inline-flex",
        padding: 0,
        margin: 0,
        flexDirection: "column",
        position: "relative"
      }}>
        <TextField value={this.state.value} label={this.props.label}
          style={this.props.style}
          onChange={this.handleChange}>
        </TextField>

        <div style={{
          backgroundColor: this.getColor(ratio),
          position: "absolute",
          left: 0, bottom: 0,
          width: this.getWidth(ratio),
          height: this.getHeight(ratio)
        }} > </div>
      </div>);
  }
}

ThrottledTextField.defaultProps = {
  delay: 500
};

ThrottledTextField.propTypes = {
  delay: PropTypes.number,
  onChange: PropTypes.func.isRequired,

  style: PropTypes.object,

};

export default withStyles(customInputStyle)(ThrottledTextField);
