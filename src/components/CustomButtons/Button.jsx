import React from "react"; 
import classNames from "classnames"; 
import PropTypes from "prop-types";  
 
const  Button = ({children, ...props}) => {
    
    return <button {...props} >{children}</button>
  }

export default Button;