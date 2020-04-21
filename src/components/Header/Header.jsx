import React from "react";
import { Link } from "react-router-dom";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import headerStyle from "assets/jss/material-kit-react/components/headerStyle.jsx";

//Image Logo
import imageLogo from "assets/img/impotx/LOGO5.png";
import wimageLogo from "assets/img/impotx/LOGO5.webp";
import HeaderLinks from "components/Header/HeaderLinks.jsx";

import utils from "utils/utils";
import { useStore } from 'utils/mobx/ConfigStore';
import { observer } from 'mobx-react-lite';
//TODO Ludovic : Ajouter MobX pour que Qst List lui dise quand se cacher 

import throttle from 'lodash.throttle';
import { useEffect } from "react";

const WithMobx = observer((props) => {
  const store = useStore()
  useEffect(() => {
    console.log(store.replacesStickyHeader)
  }, [store.replacesStickyHeader])

  return <Header {...props} stickyReplace={store.replacesStickyHeader} />
})

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.headerColorChange = this.headerColorChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }


  throttledHandleWindowResize = () => {
    return throttle(() => {
      utils.log("width is : " + window.innerWidth);
      //auth.showToast("width is : " + window.innerWidth, 500);
      //this.setState({ isMobile: window.innerWidth < 480 })
    }, 500);
  }

  handleDrawerToggle() {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }
  componentDidMount() {
    this._unmounting = false;
    if (this.props.changeColorOnScroll) {
      window.addEventListener("scroll", this.headerColorChange);
    }

    window.addEventListener('resize', this.throttledHandleWindowResize());
  }
  componentWillUnmount() {
    this._unmounting = true;
    if (this.props.changeColorOnScroll) {
      window.removeEventListener("scroll", this.headerColorChange);
    }

    window.removeEventListener('resize', this.throttledHandleWindowResize());
  }

  headerColorChange() {
    const { classes, color, changeColorOnScroll, stickyReplace } = this.props;
    //if(stickyReplace) return;
    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
    }
  }
  handleLogout() {
    if (!this._unmounting) {
      this.setState({ mobileOpen: false });
    }
  }
  render() {
    const {
      classes,
      color,
      leftLinks,
      //brand,
      fixed,
      absolute,
      stickyReplace
    } = this.props;
    const rightLinks = this.props.rightLinks || <HeaderLinks onLogout={this.handleLogout} />;
    const appBarClasses = classNames({
      [classes.appBar]: true,
      [classes[color]]: color,
      [classes.absolute]: absolute,
      [classes.fixed]: fixed
    });

    var urlRedirect = "/";//auth.getUserInfo()== null ? "/login-page" : "/user-profile";
    const brandComponent = (
      <Link to={urlRedirect}
        style={{ textDecoration: 'none', color: "white" }}>
        <Button className={classes.title} >
          <img alt="ImpotX Logo" src={utils.canUseWebP() ? wimageLogo : imageLogo} style={{ height: "3em" }} />
        </Button>
      </Link>
    );
    let ifSticky = stickyReplace ? " " + classes.stickyHidden:"";
    
      return (
        <AppBar className={appBarClasses + ifSticky}>
          <Toolbar className={classes.container}>
            {leftLinks !== undefined ? brandComponent : null}
            <div className={classes.flex}>
              {leftLinks !== undefined ? (
                <Hidden smDown implementation="css">
                  {leftLinks}
                </Hidden>
              ) : (
                  brandComponent
                )}
            </div>
            <Hidden smDown implementation="css">
              {rightLinks}
            </Hidden>
            <Hidden mdUp>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
              >
                <Menu />
              </IconButton>
            </Hidden>
          </Toolbar>
          <Hidden mdUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={"right"}
              open={this.state.mobileOpen}
              classes={{
                paper: classes.drawerPaper
              }}
              onClose={this.handleDrawerToggle}
            >
              <div className={classes.appResponsive}>
                {leftLinks}
                {rightLinks}
              </div>
            </Drawer>
          </Hidden>
        </AppBar>
      );
  }
}

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  rightLinks: PropTypes.node,
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // this.props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // this.props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark"
    ]).isRequired
  })
};

export default withStyles(headerStyle)(WithMobx);
