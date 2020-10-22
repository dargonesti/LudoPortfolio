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
                    I'm a photographer, hiker, and a software engineer.
                       I was born in the Northern-Québec but lived a little in Québec and Montreal. I used to be captivated by video-games, but redirected that energy towards photography these last years. <br/>
                       I'm a fan of Fantasy and Science-Fiction and I suggest you check my link to <a href="https://www.goodreads.com/user/show/43719355-ludovic-migneault" target="_blank">GoodReads</a> if you're bored and in search of a good story! 
                   </p>
                   <hr style={{width: "50%"}}/>

                <Row className="border-bottom">
                    <Col lg="5">
                        <View className="rounded z-depth-4 mb-lg-0 mb-4 " hover waves>
                            <img className="img-fluid" src={require("../images/About_Page/about6.jpg")} alt="Sample image" />
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
                            -- Open for shoots and collaborations! Feel free to email me for rates and more info at <strong><a className="email" href="mailto:ludovic.migneault@gmail.com"> ludovic.migneault@gmail.com</a></strong>
                        </p>

                        <h4 className="tech-info"> My Camera Gear</h4>
                        <ul style={{ marginLeft: '1em' }}>
                            {["Fujifilm X-T3 & X-T20", 
                            "Dji Mavic Mini", 
                            "Insta One X 360", 
                            "35mm f/2", 
                            "50-140mm f/2.8", 
                            "18-55mm f/2.8-4"]
                            .map(txt=><li className="camera-info-list" key={txt}>{txt}</li>)}
                        </ul>
                        
                        <h4 className="tech-info"> My Lights</h4>
                        <ul style={{ marginLeft: '1em' }}>
                            {["Goddox AD200", 
                            "Goddox TT760", 
                            "Goddox MC300", 
                            "Neweer C-Stand", 
                            "3' Octo-Softbox",
                            "6' Umbrella"]
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
                        <h3 className="font-weight-bold mb-3 p-0">  <Fa icon="image" className="pr-2"></Fa><strong>Edits & Composites</strong></h3>
                        <p> <i>Brigning stories to life!</i> <br />
                        Be transported in a workd of Magic and Wonders!</p>
                       

                    </Col>
                    <Col lg="5">
                        <View className="rounded z-depth-2 mb-lg-0 mb-4" hover waves>
                            <img className="img-fluid" src={require("../images/About_Page/about8.jpg")} alt="Sample image" />
                            <a><Mask overlay="white-slight" /></a>
                        </View>
                    </Col>
                </Row>

                <Row className="border-bottom-tech">
                    <Col lg="5">
                        <View className="rounded z-depth-4 mb-lg-0 mb-4 " hover waves>
                            <img className="img-fluid"  src={require("../images/About_Page/about.jpg")} alt="Sample image" />
                            <a><Mask overlay="white-slight" /></a>
                        </View>
                    </Col>
                    <Col lg="7">
                        <h3 className="font-weight-bold mb-3 p-0 tech-title"><Fa icon="hand-spock-o" className=""></Fa> <strong>Software Engineer</strong></h3>
                        <p>
                            I'm a software engineer with 5 years experience in the industry. I graduated with a B.S. in Computer Science at the Université Laval, Québec.
                            My expertise includes Frontend development with React and Angular, some Backend development in NodeJs and PHP, as well as Game Programing.
                            <br />
                        
                            Github <a href="https://github.com/dargonesti" target="_blank"> Repo </a>
                        </p>

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