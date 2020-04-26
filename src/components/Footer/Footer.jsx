/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/icons
//import Favorite from "@material-ui/icons/Favorite";

import footerStyle from "assets/jss/material-kit-react/components/footerStyle.jsx";
 
import auth from "utils/auth.js";
import utils from "utils/utils.js";
import localData from 'utils/DataAccess/localData';
import translatedTxt from 'texts/localization';


class Footer extends React.Component {

  constructor(props) {
    super(props);

    var selectVal = this.getSavedLanguage();

    translatedTxt.setLanguage(selectVal);

    this.state = {
      language: selectVal
    };


    this.handleChange = this.handleChange.bind(this);
  }


  handleChange = name => event => {
    var newVal = event.target.value;
    this.setState({ [name]: newVal });
    if (newVal != "") {
      localData.setStorage("prefLang", newVal);
      setTimeout(() => utils.callEvent("language"), 100);
    }
    //TODO : Comment reloader tous les texts?
  }

  getSavedLanguage() {
    return auth.isFr() ? "fr" : "en";
  }

  render() {
    let  { classes, whiteFont } = this.props;

    if(classes == null) classes = {};

    const footerClasses = classNames({
      [classes.footer]: true,
      [classes.footerWhiteFont]: whiteFont
    });
    const aClasses = classNames({
      [classes.a]: true,
      [classes.footerWhiteFont]: whiteFont
    });

    translatedTxt.setLanguage(this.getSavedLanguage());
    return (
      <footer className={footerClasses}>
        <div className={classes.container}>
          <div className={classes.left}>
            <ul className={classes.list}>
              <li className={classes.inlineBlock}>
                <a
                  href="https://www.gnitic.com/"
                  className={classes.block}
                  target="_blank"
                >
                  Gnitic
              </a>
              </li>
              <li className={classes.inlineBlock}>
                <a
                  href="/about-us"
                  className={classes.block}
                  target="_blank"
                >
                  {translatedTxt.AboutUs}
                </a>
              </li>

              {/* /}
                <ListItem className={classes.inlineBlock}>
                  <a
                    href="http://impotx.com/FAQ"
                    className={classes.block}
                    target="_blank"
                  >
                {translatedTxt.FAQ}
              </a>
                </ListItem>
                {/* */}

              <li className={classes.inlineBlock}>
                <select
                  native
                  className={classes.inheritColor}
                  style={{ width: "100%", padding:"0px 0px 0px 10px" }}
                  value={this.state.language}
                  onChange={this.handleChange('language')}
                  inputProps={{
                    name: 'language',
                    id: 'pref-lang',
                  }}
                >
                  <option value="">Langue</option>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </li>

            </ul>
          </div>
          <div className={classes.right}>
            &copy; {1900 + new Date().getYear()} , {translatedTxt.MadeBy}
            <a
              href={process.env.REACT_APP_SERVER_URL}
              className={aClasses}
              target="_blank"
            >
              Gnitic
          </a>
          </div>
        </div>
      </footer>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool
};

export default (Footer);
