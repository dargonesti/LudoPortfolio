import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, withRouter, Redirect } from "react-router-dom";
import {
    Navbar, NavbarBrand, NavbarNav, NavItem, NavLink, NavbarToggler, Collapse, Container, FormInline,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'mdbreact';
import './css/App.css'
import AnchorLink from 'react-anchor-link-smooth-scroll'
// ******** Routes ******** //
import Home from './Home'
import GalleryContainer from './GalleryContainer';
import BlogPage from './BlogPage'
import TestPage from './TestPage'
import About from './AboutPage'
import ProjectHeader from './Projects/ProjectHeader'
import ProjectContainer from './Projects/ProjectContainer'
import Routes from './Routes'

import { observer } from 'mobx-react-lite';
import { useStore } from '../Data/ConfigStore';

// ******** Project Routes ******** //

const NavigationBar = observer((props) => {
    const store = useStore();
    let [collapse, setCollapse] = useState(false)
    let [showFullNav, setFullNav] = useState(true)
    console.log(store);

    const onClick = () => {
        setCollapse(!collapse);
    }

    const overlay = <div id="sidenav-overlay" style={{ backgroundColor: 'transparent' }} onClick={props.handleNavbarClick} />

    return (
        // <Router>
        <div id="navigation">
            <Navbar color="white" light expand="md" fixed="top" scrolling >
                <NavbarBrand href="/" >
                    <strong className="brand">My Name | Photo</strong>
                    {/* <div><img style={{width:'10%', marginRight:" -11em"}} src={require('../images/logo.png')}/> </div>  */}
                </NavbarBrand>
                <NavbarToggler onClick={onClick} />
                <Collapse isOpen={collapse} navbar>
                    <NavbarNav left>
                        <NavItem>
                            {/* <NavLink className="brand" to="/">Home</NavLink> */}
                            <NavLink onClick={onClick} className="" to="/">{store.get("home")}</NavLink>
                        </NavItem>
                        <NavItem>
                            <AnchorLink offset={() => 0} onClick={onClick} className="nav-link" href='#headerbox'>{store.get("portfolio")}</AnchorLink>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={onClick} className="" to="/projects">{store.get("projects")}</NavLink>
                        </NavItem>
                        <NavItem>
                            <a onClick={onClick} className="nav-link Ripple-parent" href="https://pixieset.com/prints" target="_blank">{store.get("prints")}</a>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={onClick} className="" to="/about">{store.get("about")}</NavLink>
                        </NavItem>
                        <NavItem>
                            {/* <NavLink onClick={this.onClick} className="" to="/blog">Blog</NavLink> */}
                        </NavItem>
                        <NavItem>
                            {/* <NavLink onClick={this.onClick} className="" to="/testpage">Test Page</NavLink> */}
                            {/* <NavLink onClick={this.onClick} className="" to="/contactcard">ContactCard</NavLink> */}
                        </NavItem>
                    </NavbarNav>
                    <NavbarNav right>
                        <NavItem >
                            <FormInline waves>
                                <div className="md-form my-0">
                                    <input className="form-control mr-sm-2" type="text" placeholder={store.get("search")} aria-label={store.get("search")} />
                                </div>
                            </FormInline>
                        </NavItem>
                        <NavItem >
                            <NavLink onClick={store.toggleLanguage} className="" to="#">{store.get("lan")}</NavLink>
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Navbar>

            {collapse && overlay}
        </div>
        // </Router>
    );

})

export default withRouter(NavigationBar);