
import React, { Fragment } from "react";

import withStyles from "@material-ui/core/styles/withStyles";

import {  Typography, Collapse } from '@material-ui/core'; 

import messageStyle from "assets/jss/material-kit-react/views/messages.jsx";
 


class MessageBlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            /* PROPS : 
            titre:"",
            texte: "",
            dateSent:"",
            fromSelf: true*/
        };

        this.onClick = this.onClick.bind(this);
    }

    onClick = ev => {
        this.setState({ open: !this.state.open });
    }

    render() {

        const { classes } = this.props;

        var classesCollapsedMsgs = [classes.collapseContainer, classes.textInBubble];
        if (!this.props.fromSelf)
            classesCollapsedMsgs.push(classes.ccNotMe);

        var buttonClasses = [classes.messageBlock,
        (this.props.fromSelf ? classes.mbMe : classes.mbNotMe)
        ];
        if (this.props.className)
            buttonClasses.push(this.props.className);

        buttonClasses = buttonClasses.join(" ");

        return (<Fragment>
            <Collapse in={this.state.open} className={classesCollapsedMsgs.join(" ")}>
                <Typography variant="caption">
                    {this.props.titre}
                </Typography>
            </Collapse>

            <button className={buttonClasses}
                onClick={this.onClick} >
                <Typography className={classes.textInBubble} variant="body1">
                    {this.props.texte
                        .replace(/(?:\r\n|\r|\n)/g, "<br/>")
                        .split("<br/>")
                        .reduce((ret, obj, ind, arr) => {
                            if (obj)
                                return <Fragment>
                                    {ret}{obj}
                                    {ind < arr.length - 1 && <br />}
                                </Fragment>;
                            else
                                return ret;
                        }, <Fragment></Fragment>)
                    }
                </Typography>
            </button>

            <Collapse  in={this.state.open} className={classesCollapsedMsgs.join(" ")}>
                <Typography variant="caption">
                    {this.props.dateSent}
                </Typography>
            </Collapse>
        </Fragment>
        );
    }
}


export default withStyles(messageStyle, { withTheme: true })(MessageBlock);