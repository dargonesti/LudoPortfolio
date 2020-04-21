import React from "react";
import { Redirect } from 'react-router-dom';
import utils from "utils/utils";

function allowRedirect(WrappedComponent, PageName) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      };//remove comment

      this.handleRedirect = this.handleRedirect.bind(this);
    }

    handleRedirect(target) {
      this.setState({ redirect: target });
    }

    componentDidMount() {
      utils.addListener("language", PageName, (ev) => {
        this.forceUpdate();
      });
    }
    componentWillUnmount() {
      utils.removeListener("language", PageName);
    }

    render() {
      if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />;
      } else {
        return <WrappedComponent setRedirect={this.handleRedirect} {...this.props} />;
      }
    }
  };
}

export default allowRedirect;