

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


  , inputOpen: {
    borderBottomLeftRadius: "0",
    borderBottomRightRadius: "0",
  }

  , inputFocused: {
    outline: "none",
  }

  , suggestionsContainer: {
    display: "none",
  }

  , suggestionsContainerOpen: {
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

  , suggestionsList: {
    margin: "0",
    padding: "0",
    listStyleType: "none",
  }

  , suggestion: {
    cursor: "pointer",
    padding: "10px 20px",
  }

  , suggestionHighlighted: {
    backgroundColor: "#ddd",
  }

  , sectionContainer: {
    borderTop: "1px dashed #ccc",
  }

  , sectionContainerFirst: {
    borderTop: "0",
  }

  , sectionTitle: {
    padding: "10px 0 0 10px",
    fontSize: "12px",
    color: "#777",
  }

};

//Viens de GitHub/rommguy/react-custom-scroll
const tstMars = {
  ".rcs-custom-scroll": {
    minHeight: 0,
    minWidth: 0,
  },
  ".rcs-custom-scroll .rcs-outer-container": {
    overflow: "hidden",
  },
  ".rcs-custom-scroll .rcs-outer-container .rcs-positioning": {
    position: relative,
  },
  ".rcs-custom-scroll .rcs-outer-container:hover .rcs-custom-scrollbar": {
    opacity: 1,
    transitionDuration: "0.2s",
  },
  " .rcs - custom - scroll.rcs - inner - container ": {
    overflowX: "hidden",
    overflowY: "scroll",
    webkitOverflowScrolling: "touch",
  },
  ".rcs - custom - scroll.rcs - inner - container : after": {
    content: '',
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: 0,
    backgroundImage: "linear - gradient(to bottom, rgba(0, 0, 0, 0.2) 0 %, rgba(0, 0, 0, 0.05) 60 %, transparent 100 %)",
    pointerEvents: "none",
    transition: "height 0.1s ease -in",
    willChange: "height",
  },
  ".rcs - custom - scroll.rcs - inner - container.rcs - content - scrolled: after": {
    height: 5,
    transition: "height 0.15s ease - out",
  },
  ".rcs - custom - scroll.rcs - scroll - handle - dragged.rcs - inner - container": {
    userselect: "none",
  },
  ".rcs - custom - scroll.rcs - custom - scrollbar": {
    position: "absolute",
    height: "100 %",
    width: 6,
    right: 3,
    opacity: 0,
    zIndex: 1,
    transition: "opacity 0.4s ease - out",
    padding: "6px 0PX",
    boxSizing: "border - box",
    willChange: "opacity",
    pointerEvents: "none",
  },
  ".rcs - custom - scroll.rcs - custom - scrollbar.rcs - custom - scrollbar - rtl ": {
    right: "auto",
    left: 3,
  },
  ".rcs-custom-scroll.rcs-scroll-handle-dragged .rcs-custom-scrollbar": {
    opacity: 1,
  },
  ".rcs-custom-scroll .rcs-custom-scroll-handle": {
    position: "absolute",
    width: "100%",
    top: 0,
  },
  ".rcs-custom-scroll .rcs-inner-handle": {
    height: "calc(100% - 12px)",
    marginTop: 6,
    backgroundColor: "rgba(78, 183, 245, 0.7)",
    borderRadius: 3
  }
};


export default autoSuggestStyle;