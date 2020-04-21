

const autoSuggestStyle = {
  container: {
    position: "relative",
    height: "100 %",
    width: "282px",
    margin: "5px 10px",
    display: "inline-block",
  },

  input: {
    width: "240px",
    height: "30px",
    padding: "10px 20px",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: "300",
    fontSize: "@font-size",
    border: "1px solid @border-color",
    borderRadius: "@border-radius",
    webkitAppearance: "none",
    "&::-ms-clear": {
      display: "none",
    }
  }


  ,inputOpen: {
    borderBottomLeftRadius: "0",
    borderBottomRightRadius: "0",
  }
  
  ,inputFocused: {
    outline: "none",
  }
  
  ,suggestionsContainer: {
    display: "none",
  }
  
  ,suggestionsContainerOpen: {
    display: "block",
    position: "absolute",
    top: "51px",
    width: "280px",
    border: "1px solid @border-color",
    backgroundColor: "#fff",
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: "300",
    fontSize: "@font-size",
    borderBottomLeftRadius: "@border-radius",
    borderBottomRightRadius: "@border-radius",
    zIndex: "2",
    maxHeight: 'calc( 80vh - 52px)',
    overflowY: "auto",
  }
  
  ,suggestionsList :{
    margin: "0",
    padding: "0",
    listStyleType: "none",
  }
  
  ,suggestion :{
    cursor: "pointer",
    padding: "10px 20px",
  }
  
  ,suggestionHighlighted: {
    backgroundColor: "#ddd",
  }
  
  ,sectionContainer :{
    borderTop: "1px dashed #ccc",
  }
  
  ,sectionContainerFirst: {
    borderTop: "0",
  }
  
  ,sectionTitle: {
    padding: "10px 0 0 10px",
    fontSize: "12px",
    color: "#777",
  }

};

export default autoSuggestStyle;
