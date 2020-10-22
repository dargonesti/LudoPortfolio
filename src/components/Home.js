import React, { Component } from 'react';
import './css/App.css';
//Components
import GalleryContainer from './GalleryContainer';
import CarouselIntro from './CarouselIntro';
import ScrollAnimation from 'react-animate-on-scroll';
import { Parallax } from "react-parallax";
import AnchorLink from 'react-anchor-link-smooth-scroll'
// import Featured_Gallery from './PhotoProjects/Featured_Gallery.js'
import ProjectContainer from './Projects/ProjectContainer'
import LazyLoad from 'react-lazy-load';
import Featured from './PhotoProjects/Featured_Portfolio'
import ContactCard from './ContactCard'

//unused
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import NavigationBar from './NavigationBar';
import FooterPage from './Footer';
import BlogPage from './BlogPage'
import Routes from './Routes'
import All_Projects from './Projects/All_Projects'
import AboutPage from './AboutPage'
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidUpdate() {
        window.scroll({
            top: 0,
            behavior: "smooth"
        });
        console.log("HOME SCROLL_______");
    }
    componentDidMount() {
        window.scroll({
            top: 0.5,
            behavior: "smooth"
        });
        console.log("HOME SCROLL_______Did Mount");
    }

    render() {
        // Parallax Images will be local 
        // const Oregon_Image = require('../images/Featured_Portfolio/Travel/Travel-10.jpg');
        // const SF_Image = require('../images/08.18.18_Urban_SF/SF-17.jpg');
        return (
            <div>
                <div id="section1">
                    {/* <Parallax strength={500}> */}
                    <ScrollAnimation delay={700} animateIn="fadeIn" animateOnce={true}>
                        <CarouselIntro />
                    </ScrollAnimation>
                    {/* </Parallax> */}
                </div>

                {/* <ContactCard /> */}

                <div id="section2">
                    <ScrollAnimation animateIn="fadeIn" animateOnce={true}>
                        <ProjectContainer
                            showFilter={true}
                            imageArray={Featured.imageArray}
                            headerInfo={Featured.projectHeader}
                            renderType="feature"
                            // SHOW SMALLER MARGINS FOR GALLERY
                        // style={"container containerMarginTopFeature"}
                        />
                    </ScrollAnimation>
                </div>
                {/* <Parallax bgImage={SF_Image} strength={500}>
                            <div style={{ height: 800 }}>
                            </div>
                        </Parallax>  */}

                <ContactCard />

                {/* Unused */}
                {/* Lazy Load Will Cause Anchor Link issue */}
                {/* <div id="section4">
                    <LazyLoad>
                        <Parallax bgImage={SF_Image} strength={500}>
                            <div style={{ height: 500 }}>
                            </div>
                        </Parallax> 
                     </LazyLoad>
                </div> */}
            </div>
        );
    }
}

export default Home;

