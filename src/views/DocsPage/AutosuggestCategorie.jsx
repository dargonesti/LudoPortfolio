/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// nodejs library that concatenates classes
// @material-ui/core components 
 

import { Clear } from "@material-ui/icons";
 
import utils from "utils/utils.js";
import DAL from "utils/DataAccess/DALimpotx.js";
  
 
import Autosuggest from 'react-autosuggest';
import theme from "assets/jss/material-kit-react/components/autoSuggest.jsx";
import 'react-block-ui/style.css';

const getSuggestionValue = suggestion => suggestion.idperso;

const renderSuggestion = suggestion => (
  <div>
    {suggestion.titre}
  </div>
);

class AutosuggestCategorie extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cat: "",
      catTitre: "",
      suggestions: []
    }

    this.isDepense = this.isDepense.bind(this);
    this.getSelectOptions = this.getSelectOptions.bind(this);
  }

  componentDidMount() {
    this.setState({
      cat: this.props.defaultValue,
      catTitre: utils.getCatTitre(this.props.defaultValue) || ""
    });
  }

  getSuggestions = value => {
    utils.log("Getting suggest: " + value);
    const inputValue = value.trim().toLowerCase();

    var fullOptions = this.getSelectOptions()
    var filteredOps = fullOptions.filter(cat => {
      return (new RegExp(".*" + inputValue + ".*", "i")).test(cat.titre);
    }
    );
    return filteredOps;
  }

  getSelectOptions() {
    var cat = [];
    var { defaultValue, forceFeuillet, forceDepense } = this.props;

    if (defaultValue || forceFeuillet || forceDepense) {
      if (forceDepense || (!forceFeuillet && this.isDepense(defaultValue))) {
        cat = DAL.getDepenses();
      }
      else {
        cat = DAL.getFeuillets();
      }
    }
    else {
      cat = DAL.getFeuillets().concat(DAL.getDepenses());
    }
    return cat;//.map(c=>({id:c.idperso, text:c.titre}));
  }

  isDepense(cat) {
    return DAL.getDepenses().some(dep => dep.idperso == cat);
  }

  //AutoSuggest

  onChange = (event, { newValue }) => {
    utils.log("onChange");
    utils.log(newValue);
    var catTitre = utils.getCatTitre(newValue);
    var catFound = DAL.getFeuillets().concat(DAL.getDepenses()).find(cat => cat.titre == newValue);
    if (catFound) newValue = catFound.idperso; // If the person typed the exact title by hand
    if (newValue == "" || catTitre && catTitre != newValue) {
      this.setState({
        catTitre: catTitre,
        cat: newValue
      });
      this.props.onChange(newValue);
    } else {
      this.setState({
        catTitre: newValue
      });
    }
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() { 

    return (
      <Fragment>
        <Autosuggest
          style={{ display: "inline-block" }}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          shouldRenderSuggestions={() => true}
          inputProps={{
            placeholder: 'Cherchez une catégorie',
            value: this.state.catTitre, // getCatTitre(this.state.cat),
            onChange: this.onChange//.bind(this)
          }}
          theme={theme}
        />
        <Clear style={{ cursor: "pointer", marginLeft: -50/*, paddingTop: 7 , boxSizing:"content-box"*/}}
          onClick={(ev => {
            this.onChange(null, { newValue: "" });
          })} />
      </Fragment>
    );
  }
}

AutosuggestCategorie.propTypes = {
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  forceFeuillet: PropTypes.bool,
  forceDepense: PropTypes.bool
};


export default AutosuggestCategorie;