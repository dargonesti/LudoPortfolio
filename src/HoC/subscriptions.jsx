import React from "react";

import DAL from "utils/DataAccess/DALimpotx.js";
import localData from "utils/DataAccess/localData";
import utils from "utils/utils";

const isFunc = fnTest => typeof (fnTest) === "function"; 

function getDataKey(dataObj) {
  return keyToString(dataObj);
  if (isFunc(dataObj)) {
    return dataObj();
  } else {
    return dataObj;
  }
}

function keyToString(key){
  if(typeof(key) == "function") return keyToString(key());
  if(key.key) return keyToString(key.key);
  return key;
}

function getDependencies(queryObj) {
  //TODO : Avoir un dic de dep/nom de query plutôt que de les spécifier chaque fois?
  if (queryObj && queryObj.dependencies) {
    return queryObj.dependencies();
  }
  return [];
}

function isJustLocal(queryObj){
  return queryObj && queryObj.justLocal;
}

//requiredData contains an array of either Strings, or functions returning a string
//The functions can be necessary to insert a parameter like the userId in the string
function withSubscription(WrappedComponent, requiredData, renderCondition) {//selectData) {
  requiredData = requiredData || [];

  //Déplacé après avoir enregistré les events sur didMount : DAL.updateData(requiredData);
  return class extends React.Component {
    constructor(props) {
      super(props);

      var stringedRequiredData = requiredData.map(getDataKey) || [];
      // TODO : Parallel queries with : 
      //const responses = await Promise.all([
      //         fetchUserAsync(),
      //         fetchPostsAsync(),
      //         ]);

      this.state = {
        data: DAL.getAndCallUpdate(requiredData),
        requiredData: stringedRequiredData,
      };//remove comment

      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      // if (this.state.requiredData) {
     // this.state.
      requiredData
        .forEach(query => {
          console.info("Added listener : " + getDataKey(query));
          DAL.addChangeListener(getDataKey(query), this.handleChange);

          // TODO 
          getDependencies(query).forEach(dep => {
            utils.log("TODO - bind event on dependence changed");
          });
        });

      DAL.updateData(requiredData);
      //  }
    }

    componentWillUnmount() {
      // if (this.state.requiredData) {
      this.state.requiredData
        .forEach(query => {
          DAL.removeChangeListener(getDataKey(query), this.handleChange);

          // TODO 
          getDependencies(query).forEach(dep => {
            utils.log("TODO -remove dependence handle ... if last listener?");
          });
        });
      // }
    }

    handleChange(newData) {//test
      this.setState({
        data: DAL.getFromCache(this.state.requiredData)
      });
      //var newState = {...this.state.data, ...newData};
      //this.setState({data:newState});
    }

    handleDependencChanged(queryName) {
      utils.log("TODO");
    }

    render() {
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}

export default withSubscription;