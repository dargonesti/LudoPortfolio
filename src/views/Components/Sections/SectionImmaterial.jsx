import React from "react";
// react plugin that creates slider 


// core components 
import Button from "components/CustomButtons/Button.jsx";

import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx";

class SectionImmaterial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [24, 22],
      selectedEnabled: "b",
      checkedA: true,
      checkedB: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  handleChangeEnabled(event) {
    this.setState({ selectedEnabled: event.target.value });
  }
  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  }
  render() {
    let { classes } = this.props;
    classes = {}
    return (
      <div className={classes.sections}>
        <div className={classes.container}>
          <div className={classes.title}>
            <h2>Immaterial (ne viennent pas de MaterialUI)</h2>
          </div>

          <div id="awesome-react">
            <div className={classes.title}>
              <h3>
                Awesome React Components
                <br />
                <small>
                  Awesome React Components est une librairie contenant des tonnes de components, <br />
                  un peut la même chose que un plugin store habituel...<br />
                  Voir leur site <a href="https://github.com/brillout/awesome-react-components">sur GIT.</a>
                </small>
              </h3>
            </div>


            <div className={classes.space50} />


          </div>

          <div id="autoresponsive">
            <div className={classes.title}>
              <h3>
                AutoResponsive-React   https://github.com/brillout/awesome-react-components
                <br />
                <small>
                  Component pour avoir de belles grids responsives, se trouve <a href="https://github.com/xudafeng/autoresponsive-react">sur git.</a>
                </small>
              </h3>
            </div>
            <Button color="primary">Default</Button>
            <Button color="primary" round>
              round
                </Button>


            <div className={classes.space50} />

          </div>

          <div id="eventual">
            <div className={classes.title}>
              <h3>
                Pour utilisation future
                <br />
                <small>
                  Components intéressants qui devraient éventuellement être ajoutés au site.
                </small>
              </h3>
            </div>
            <ul>

              <li><a href="https://github.com/teambit/bit">Bit ( Git Hub ) Une collection de components ouvers ++ </a></li>
              <li><a href="https://reactcommunity.org/react-transition-group/with-react-router">react-transition Avec router</a></li>
              <li><a href="https://www.react-spring.io/">React-Spring, pour les animations</a></li>

              <li><a href="https://cssinjs.org/react-jss/?v=v10.1.1">React-JSS, Librairie de css in JS</a></li>
              <li><a href="https://material-ui.com/styles/basics/">Material UI + withStyle</a></li>
              <li><a href="#">Basic alternative : Use SASS but no eact Library</a></li>              


              <li><a href="http://kidjp85.github.io/react-id-swiper/">Un beau Slider ( react-id-swiper )</a></li>
              <li><a href="https://github.com/availity/react-block-ui">Block UI</a></li>
              <li><a href="http://yuanyan.github.io/halogen/">Halogen loaders</a></li>
              <li><a href="https://github.com/pqx/react-ui-tree">Menu tree</a></li>
              <li><a href="http://bryce.io/react-intense/">React Intense ( Zoom sur une image Hi-Rez )</a></li>
              <li><a href="http://jossmac.github.io/react-images/">React Images ( Met une image en Full screened diaporama quand on la clic )</a></li>
              <li><a href="https://frontend-collective.github.io/react-image-lightbox/">React Image Lightbox</a></li>
              <li><a href="https://github.com/AdeleD/react-paginate">React Paginate</a></li>
              <li><a href="https://javier.xyz/react-blur/">React Blur ( Floue le background )</a></li>
              <li><a href="http://react-split-pane.surge.sh/subcomponent">React Split Pane</a></li>
              <li><a href="https://github.com/gilbarbara/react-joyride">React Joyride ( Tour guidé du site )</a></li>
              <li><a href="https://jedwatson.github.io/react-input-autosize/">React Input Autosize</a></li>
              <li><a href="https://github.com/aleksei0807/react-images-uploader">Image Uploader</a></li>

              <li><a href="https://tkh44.github.io/data-driven-motion/#/demos">Data Driven Animations</a></li>
              <li><a href="http://react.semantic-ui.com/elements/button/#types-button">react.semantic-ui.com ( Toogles à 3 states, Boutons animés, Cards, Modals,  etc. )</a></li>
              <li><a href="http://elemental-ui.com">http://elemental-ui.com ( Comme semantic mais moisn gros )</a></li>
              <li><a href="https://react.foundation/">https://react.foundation/</a></li>
              <li><a href="https://github.com/jeroencoumans/react-scroll-components">Scrolling Components</a></li>

              <li><a href="https://github.com/heroku/react-refetch">React Re-Fecth ( Binds rest calls to components )</a></li>
              <li><a href="https://github.com/appleboy/react-recaptcha">CAPTCHAS</a></li>
              <li><a href="https://github.com/souporserious/react-measure">SelfMesure</a></li>
              <li><a href="https://github.com/ctrlplusb/react-sizeme">React SizeMe ( Comme Self Mesure )</a></li>

              <li><a href="https://github.com/bvaughn/react-window#how-is-react-window-different-from-react-virtualized"><b>React-Window</b> - virtual scrolling pour enlever le lag de Questions Toutes</a></li>


              <li><a href="https://material-ui.com/demos/autocomplete/">Material UI Supported autosuggest</a></li>

              <li>Aussi voir : https://github.com/kingdido999/zooming</li>

              <li><a href="https://raygun.com/javascript-debugging-tips">Javascript debugging tips (console.table, time, polyfill todo etc.)</a></li>


              <li><a href="http://impotx.com/faq#1">Lien FAQ Site Static 1</a></li>
              <li><a href="http://impotx.com/faq#2">Lien FAQ Site Static 2</a></li>
              <li><a href="http://impotx.com/faq#3" rel="noopener noreferrer" target="_blank">Lien FAQ Site Static 3</a></li>

              <li><a href="http://compromise.cool/" >Comprimise - Text AI -</a></li>
              <li><a href="https://github.com/NaturalNode/natural" >Natural - Text AI, more complex -</a></li>

              <li><a href="https://github.com/tensorflow/tfjs-examples"  >Tensor Flow Js - Examples</a></li>
              <li><a href="https://github.com/tensorflow/workshops" >Tensor Flow Js - Workshops</a></li>
              <li><a href="https://ai.google/education" >Google's AI Classes</a></li>

              <li><a href="https://github.com/BrainJS/brain.js#examples"  >BrainJs ( Auto AI )</a></li>
              <li><a href="https://github.com/stevenmiller888/mind"  >Mind ( Auto AI )</a></li>


              <li><a href="https://github.com/brunnolou/react-morph"  >Animation react-morph</a></li>

              <li><a href="https://github.com/ebakhtarov/http2-chat-example"  >Chat via http2</a></li>

              <li>react-firebase-hooks</li>

              <li><a href="https://bit.dev/aayush1408/must-have-hooks-in-your-toolbox" >10 must have custom hook</a></li>

            </ul>

          </div>
        </div>
      </div>
    );
  }
}

export default (SectionImmaterial);
