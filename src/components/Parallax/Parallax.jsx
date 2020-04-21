import React from "react"; 
import classNames from "classnames"; 
import PropTypes from "prop-types"; 
import withStyles from "@material-ui/core/styles/withStyles";
 
import parallaxStyle from "assets/jss/material-kit-react/components/parallaxStyle.jsx";  

class Parallax extends React.Component {
  constructor(props) {
    super(props);

    this.state = {  scrollTopRatio: 0  };

    this.resetTransform = this.resetTransform.bind(this);
    this.getScrollRatio = this.getScrollRatio.bind(this);

    var windowScrollTop = window.pageYOffset / this.getScrollRatio();
    this.state = {
      transform: "translate3d(0," + windowScrollTop + "px,0)",
      scrollTopRatio:0
    };
  }
  getScrollRatio(){
    var scrollBonusRatio = this.state.scrollTopRatio || 0;
    var target = this.props.shrinkTarget|| 0;
    
    return this.props.parallaxRatio * ( 1 + scrollBonusRatio * target);
  }
  componentDidMount() {
    var windowScrollTop = window.pageYOffset / this.getScrollRatio();

    this.setState({
      transform: "translate3d(0," + windowScrollTop + "px,0)"
    });
    window.addEventListener("scroll", this.resetTransform);

    if (this.props.shrinkTarget && this.props.shrinkDuration) {
      var that = this;
      var shrinkStartId = setTimeout(() => {
        var startTime = Date.now();
        clearTimeout(shrinkStartId);
        var shrinkAnim = setInterval(
          () => {

            var ratioDone = (Date.now() - startTime) / that.props.shrinkDuration;
            if (ratioDone > 1) {
              ratioDone = 1;
              clearInterval(shrinkAnim);
            }
            
            that.setState({scrollTopRatio: ratioDone * that.props.shrinkTarget}
              );
              that.resetTransform();
          },
          1000 / 60
        );
      },
        this.props.shrinkDelay || 0)

    }
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.resetTransform);
  }

  resetTransform() {
    var windowScrollTop = window.pageYOffset / this.getScrollRatio();
    this.setState({
      transform: "translate3d(0," + windowScrollTop + "px,0)"
    });
  }

  //Vert pale : #01a54e
  //Vert foncer : #00612e

  render() {
    const {
      classes,
      filter,
      className,
      children,
      style,
      image,
      small,
      xsmall,
      withGreen
    } = this.props;
    //    backgroundImage: "url(" + utils.toWebP(image) + ")",
    const parallaxClasses = classNames({
      [classes.parallax]: true,
      [classes.filter]: filter,
      [classes.small]: small,
      [classes.xsmall]: xsmall,
      [className]: className !== undefined
    });
    return (
      <>
      <div
        className={parallaxClasses}
        style={{
          ...style,
          backgroundImage: "url(" + image + ")",
          ...this.state
        }}
        ref="parallax"
      >

        {children}
      </div>
      {withGreen && 
      <div style={{
        background:"linear-gradient(to right, RGBA(78,166,79,1) 0%,RGBA(42,97,47,1) 100%)",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        textAlign: "left",
        zIndex:1}} />}
      </>
    );
  }
}
Parallax.defaultProps = {
  parallaxRatio: 3
};

Parallax.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  filter: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.string,
  image: PropTypes.string,
  shrinkTarget: PropTypes.number,
  shrinkDelay: PropTypes.number,
  shrinkDuration: PropTypes.number,
  parallaxRatio: PropTypes.number
};

export default withStyles(parallaxStyle)(Parallax);
