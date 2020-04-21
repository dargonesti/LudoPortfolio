import React from "react";
// react plugin that creates slider
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
 

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
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
    const { classes } = this.props;
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
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8}>
                <Button color="primary">Default</Button>
                <Button color="primary" round>
                  round
                </Button>

              </GridItem>
            </GridContainer>


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
            <GridItem xs={12} md={12}>
              <List>

                <ListItemText><a href="http://kidjp85.github.io/react-id-swiper/">Un beau Slider ( react-id-swiper )</a></ListItemText>


                <ListItemText><a href="https://github.com/availity/react-block-ui">Block UI</a></ListItemText>
                <ListItemText><a href="http://yuanyan.github.io/halogen/">Halogen loaders</a></ListItemText>
                <ListItemText><a href="https://github.com/pqx/react-ui-tree">Menu tree</a></ListItemText>
                <ListItemText><a href="http://bryce.io/react-intense/">React Intense ( Zoom sur une image Hi-Rez )</a></ListItemText>
                <ListItemText><a href="http://jossmac.github.io/react-images/">React Images ( Met une image en Full screened diaporama quand on la clic )</a></ListItemText>
                <ListItemText><a href="https://frontend-collective.github.io/react-image-lightbox/">React Image Lightbox</a></ListItemText>
                <ListItemText><a href="https://github.com/AdeleD/react-paginate">React Paginate</a></ListItemText>
                <ListItemText><a href="https://javier.xyz/react-blur/">React Blur ( Floue le background )</a></ListItemText>
                <ListItemText><a href="http://react-split-pane.surge.sh/subcomponent">React Split Pane</a></ListItemText>
                <ListItemText><a href="https://github.com/gilbarbara/react-joyride">React Joyride ( Tour guidé du site )</a></ListItemText>
                <ListItemText><a href="https://jedwatson.github.io/react-input-autosize/">React Input Autosize</a></ListItemText>
                <ListItemText><a href="https://github.com/aleksei0807/react-images-uploader">Image Uploader</a></ListItemText>

                <ListItemText><a href="https://tkh44.github.io/data-driven-motion/#/demos">Data Driven Animations</a></ListItemText>
                <ListItemText><a href="http://react.semantic-ui.com/elements/button/#types-button">react.semantic-ui.com ( Toogles à 3 states, Boutons animés, Cards, Modals,  etc. )</a></ListItemText>
                <ListItemText><a href="http://elemental-ui.com">http://elemental-ui.com ( Comme semantic mais moisn gros )</a></ListItemText>
                <ListItemText><a href="https://react.foundation/">https://react.foundation/</a></ListItemText>
                <ListItemText><a href="https://github.com/jeroencoumans/react-scroll-components">Scrolling Components</a></ListItemText>

                <ListItemText><a href="https://github.com/heroku/react-refetch">React Re-Fecth ( Binds rest calls to components )</a></ListItemText>
                <ListItemText><a href="https://github.com/appleboy/react-recaptcha">CAPTCHAS</a></ListItemText>
                <ListItemText><a href="https://github.com/souporserious/react-measure">SelfMesure</a></ListItemText>
                <ListItemText><a href="https://github.com/ctrlplusb/react-sizeme">React SizeMe ( Comme Self Mesure )</a></ListItemText>

                <ListItemText><a href="https://github.com/bvaughn/react-window#how-is-react-window-different-from-react-virtualized"><b>React-Window</b> - virtual scrolling pour enlever le lag de Questions Toutes</a></ListItemText>
                

                <ListItemText><a href="https://material-ui.com/demos/autocomplete/">Material UI Supported autosuggest</a></ListItemText>

                <ListItemText>Aussi voir : https://github.com/kingdido999/zooming</ListItemText>

                <ListItemText><a href="https://raygun.com/javascript-debugging-tips">Javascript debugging tips (console.table, time, polyfill todo etc.)</a></ListItemText>


                <ListItemText><a href="http://impotx.com/faq#1">Lien FAQ Site Static 1</a></ListItemText>
                <ListItemText><a href="http://impotx.com/faq#2">Lien FAQ Site Static 2</a></ListItemText>
                <ListItemText><a href="http://impotx.com/faq#3" rel="noopener noreferrer" target="_blank">Lien FAQ Site Static 3</a></ListItemText>

                <ListItemText><a href="http://compromise.cool/" >Comprimise - Text AI -</a></ListItemText>
                <ListItemText><a href="https://github.com/NaturalNode/natural" >Natural - Text AI, more complex -</a></ListItemText>

                <ListItemText><a href="https://github.com/tensorflow/tfjs-examples"  >Tensor Flow Js - Examples</a></ListItemText>
                <ListItemText><a href="https://github.com/tensorflow/workshops" >Tensor Flow Js - Workshops</a></ListItemText>
                <ListItemText><a href="https://ai.google/education" >Google's AI Classes</a></ListItemText>

                <ListItemText><a href="https://github.com/BrainJS/brain.js#examples"  >BrainJs ( Auto AI )</a></ListItemText>
                <ListItemText><a href="https://github.com/stevenmiller888/mind"  >Mind ( Auto AI )</a></ListItemText>


                <ListItemText><a href="https://github.com/brunnolou/react-morph"  >Animation react-morph</a></ListItemText>

                <ListItemText><a href="https://github.com/ebakhtarov/http2-chat-example"  >Chat via http2</a></ListItemText>

                <ListItemText>react-firebase-hooks</ListItemText>
                
                <ListItemText><a href="https://bit.dev/aayush1408/must-have-hooks-in-your-toolbox" >10 must have custom hook</a></ListItemText>

              </List>
            </GridItem>

          </div>
{/*

          <h3>Test react-id-swiper</h3>
          <Swiper>
            <div>Slide 1  <TestLines/>
            </div>
            <div>Slide 2 <TestLines/></div>
            <div>Slide 3<TestLines/></div>
            <div>Slide 4 <TestLines/></div>
          </Swiper>

<br />
          Swiper 2
          <RenderSwiper2 />

          <br />
          Swiper 3 ( Vertical )
          <RenderSwiper2 direction='vertical' />
          */}
</div>
      </div>
    );
  }
}

export default withStyles(basicsStyle)(SectionImmaterial);
