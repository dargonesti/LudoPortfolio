import React, { Component } from 'react';
import './css/App.css';
//Components
import NavigationBar from './NavigationBar';
import Routes from './Routes'
import FooterPage from './Footer';
// import Home from './Home'
// import ScrollAnimation from 'react-animate-on-scroll';
import Headroom from 'react-headroom'
import ReactGA from 'react-ga';

import { useStore, StoreProvider } from '../Data/ConfigStore'
import { observer, useObserver } from 'mobx-react-lite';

ReactGA.initialize('G-6L9PPHNKNE');//'UA-128379418-1');
ReactGA.pageview(window.location.href);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    // console.log("App > CDM() > Headroom Scroll");

    window.scroll({
      top: 70,
      behavior: "smooth"
    });
  }

  render() {
    // console.log("App > Render()",this.props);

    return (
      <StoreProvider>
        <div>
          <Headroom >
            <NavigationBar />
            <div>
              <br />
              <h1 style={{ color: "transparent" }}>_</h1>
            </div>
          </Headroom>

          <Routes />
          <FooterPage />
        </div>
      </StoreProvider>
    );
  }
}

export default App;

