import React from "react";
import PropTypes from "prop-types";
 
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { TextField } from "@material-ui/core";

const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    overrides: {
        MuiOutlinedInput: {
            input: {
                paddingTop: 5,
                paddingBottom: 5
            }
        },
        MuiInputLabel: {
            shrink: {
                color: "rgba(0,0,0,0) !important"
            },
            formControl: { top: -10 }
        },
        MuiInput: {
            formControl: {
                marginTop: "0px !important",
            },
           // textAlign: "center !important"
        }
    }
});



const SmallerTextField = ({ value, label, onChange, onReturn, onBlur, type = "text", style={} }) => {
    return (<MuiThemeProvider theme={theme}>
        <TextField
            style={{ marginLeft: 10, marginTop: 0, width: 150, ...style }}
            id="my-smaller-tf"
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type={type}
            onKeyPress={(e) => {
                if (e.key === 'Enter' && onReturn)
                    this.onSave();
            }}
            inputProps={{ 
                onBlur: () => {
                    if (onBlur) {
                        onBlur();
                    }
                }
            }} />
    </MuiThemeProvider>);
};


SmallerTextField.propTypes = {
    classes: PropTypes.object,
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onReturn: PropTypes.func,
    onBlur: PropTypes.func,
    type: PropTypes.string.isRequired, 
};

export default SmallerTextField;