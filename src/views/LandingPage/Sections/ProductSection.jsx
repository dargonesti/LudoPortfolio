import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Chat from "@material-ui/icons/Chat";
import Folder from "@material-ui/icons/Folder";
import Commute from "@material-ui/icons/Commute";
import AttachMoney from "@material-ui/icons/AttachMoney";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";

import productStyle from "assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx";

import impoTxt from 'texts/localization';

class ProductSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <h2 className={classes.title}>{impoTxt.landingTalkProduct}</h2>
            <h5 className={classes.description}>
             {impoTxt.landingDescProduct}
            </h5>
          </GridItem>
        </GridContainer>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <InfoArea
                title={impoTxt.landingCherchezPlus}
                description={impoTxt.landingCherchezPlusDesc}
                icon={Folder} 
                iconColor="info"
                vertical
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <InfoArea
                title={impoTxt.landingAucunDep}
                description={impoTxt.landingAucunDepDesc}
                icon={Commute}
                iconColor="success"
                vertical
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <InfoArea
                title={impoTxt.landingMeilleurPrix}
                description={impoTxt.landingMeilleurPrixDesc}
                icon={AttachMoney}
                iconColor="danger"
                vertical
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <InfoArea
                title={impoTxt.landingDansMesMots}
                description={impoTxt.landingDansMesMotsDesc}
                icon={Chat}
                iconColor="danger"
                vertical
              />
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(productStyle)(ProductSection);
