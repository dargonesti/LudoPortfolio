import React, { createContext } from "react";
import { useLocalStore } from "mobx-react-lite";
  

export const createQuotesStore = () => ({
  currentQuoteInd: 0,
  getCurrentQuote() { return 1 },
  getCurrentText() {
    return 1;
  },
  getRandomQuote() {
    return 1
  },

  startNew() {
    this.finalWPM = 0
    this.touchesTimes = []
    this.raceStartTime = null
    this.playingState = "countdownStart"
    console.log("start new")
    return this.getRandomQuote()
  },

  tryAgain() {
    this.finalWPM = 0
    this.touchesTimes = []
    this.raceStartTime = null
    this.playingState = "countdownStart"
    console.log("try again")
  },

})

export const quoteContext = createContext();

export const QuoteProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    raceStartTime: null,
    raceEndTime: null,
    playingState: "home", //countdownStart, typing, result, stats
    touchesTimes: [],
    finalWPM: 0,
    currentText: "",

    getStartTime: ()=>{
      if(this.touchesTimes.length > 0){
        return this.touchesTimes[0].time;
      }
      else{
        return Date.now();
      }
    },

    currentQuoteInd: 0,
    getCurrentQuote: () =>1,
    getRandomQuote: () => {
      return 1
    },

    changedTexte: (newText) => {
      this.currentText = newText
      if (newText === this.getCurrentQuote()) {
        this.raceEndTime = Date.now()
        this.playingState = "result"
      }
      else {
        this.playingState = "typing"
      }
    }
  }));

  return (
    <quoteContext.Provider value={store}>{children}</quoteContext.Provider>
  );
};

export default { quoteContext, QuoteProvider, createQuotesStore };