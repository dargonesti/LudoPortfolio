import React, { Component } from 'react';
import { Container, Row, Col, Mask, Fa, View, Button } from 'mdbreact';
import './css/App.css'
import ScrollAnimation from 'react-animate-on-scroll';
import ReactGA from 'react-ga';
// ReactGA.pageview(window.location.href);

const AboutPage = () => {
    window.scroll({
        top: 0,
        behavior: "smooth"
    });    // console.log("*******Lazy Load*******");
    ReactGA.event({
        category: 'LandedOn: /AboutPage',
        action: 'Landed On',
    });
    return (
        <ScrollAnimation delay={300} animateIn="fadeIn" animateOnce={true}>

            <Container id="aboutpage" className="marginTop3">
                {/* <h2 className="h1-responsive font-weight-bold text-center">Who am I?</h2> */}
                <p className="text-center w-responsive mx-auto ">
                    Welcome to my portfolio!
                    <br />
                    I'm a photographer, hiker.
                   </p>
                   <hr style={{width: "50%"}}/>

                <Row className="border-bottom">
                    <Col lg="5">
                        <View className="rounded z-depth-4 mb-lg-0 mb-4 " hover waves>
                            <img className="img-fluid" src={require("../images/About_Page/desktop/about6.webp")} alt="Sample image" />
                            <a><Mask overlay="white-slight" /></a>
                        </View>
                    </Col>
                    <Col lg="7">
                
                        <h2 className="font-weight-bold mb-3 p-0"> <Fa icon="image" className="pr-2 fa-camera-retro"></Fa><strong>Photographer</strong></h2>
                        <p className="">
                            What kind of photography do I do? Well, I do all types. Anywhere from travel, landscapes, lifestyle to wedddings, portraits, and events. Well
                            pretty much whatever you need me to do I can do for you! I've even dabbled in food and product photography.
                        </p>
                        <p>
                            Initially, I found my inspiration came from traveling around the world seeing different kinds of people, places, and things. As you can tell from my photos, I love colors.
                            <br />
                            <br />
                            -- Open for shoots and collaborations! Feel free to email me for rates and more info at <strong><a className="email" href="mailto:my.name@gmail.com"> my.name@gmail.com</a></strong>
                        </p>

                        <h4 className="tech-info"> My Camera Gear</h4>
                        <ul style={{ marginLeft: '1em' }}>
                            {["Canon Rebel", 
                            "Mavic Air2", 
                            "50mm f/1.8", 
                            "85mm f/1.8"]
                            .map(txt=><li className="camera-info-list" key={txt}>{txt}</li>)}
                        </ul>
                        
                        <h4 className="tech-info"> My Lights</h4>
                        <ul style={{ marginLeft: '1em' }}>
                            {["Goddox AD200", 
                            "Aperture 300D", 
                            "C-Stand", 
                            "5' Softbox"]
                            .map(txt=><li className="camera-info-list" key={txt}>{txt}</li>)}
                           
                        </ul>

                    </Col>
                </Row>

                <Row className="border-bottom">
                    <Col lg="7" className="allign-vert">
                        {/* <a className="pink-text">
                            <h6 className="font-weight-bold mb-3">
                                <Fa icon="image" className="pr-2"></Fa>Lifestyle </h6>
                        </a> */}
                        <h3 className="font-weight-bold mb-3 p-0">  <Fa icon="image" className="pr-2"></Fa><strong>Edits</strong></h3>
                        <p> <i>Get the body you always wanted!</i> <br />
                        Only need a few hours of retouching!</p>
                       

                    </Col>
                    <Col lg="5">
                        <View className="rounded z-depth-2 mb-lg-0 mb-4" hover waves>
                            <img className="img-fluid" src={require("../images/About_Page/desktop/about7.webp")} alt="Sample image" />
                            <a><Mask overlay="white-slight" /></a>
                        </View>
                    </Col>
                </Row>

                <Row className="border-bottom-tech">
                    <Col lg="5">
                        <View className="rounded z-depth-4 mb-lg-0 mb-4 " hover waves>
                            <img className="img-fluid"  src={require("../images/About_Page/desktop/about.webp")} alt="Sample image" />
                            <a><Mask overlay="white-slight" /></a>
                        </View>
                    </Col>
                    <Col lg="7">
                     

                        <h4 className="tech-info"> This Portfolio was built with</h4>
                        <ul style={{ marginLeft: '1em' }}>
                            <li><a className="tech-info-list" href="https://reactjs.org/" target="_blank"> Reactjs</a> - A JavaScript framework for building user interfaces</li>
                            <li><a className="tech-info-list" href="https://redux.js.org/" target="_blank"> Redux</a> - is a predictable state container for JavaScript apps</li>
                            <li><a className="tech-info-list" href="https://webpack.js.org/" target="_blank"> Webpack</a> - JavaScript module bundler</li>
                            <li><a className="tech-info-list" href="http://babeljs.io/" target="_blank"> Babel</a> - JavaScript transpiler/compiler</li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </ScrollAnimation>

    );
}
export default AboutPage;