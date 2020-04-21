import React, { createContext } from "react";
import { useLocalStore } from "mobx-react-lite";

import quotesJson from "./quotes.json";

//////// SERVES AS AN EXAMPLE : //////////
/* [
  {
    Quote:"Blah blahh...", 
    Author: "Mr. John",
    Tags: [tag1, tag 2, etc.],
    Popularity: 0.132131, 
    Category: "Life"
}, ... x 48391]*/
const adaptDataset = false;
if (adaptDataset) {
  let shortLength = 20, longLength = 300;

  //TODO : filter uniq

  let shortQuotes = quotesJson.filter(q =>
    q.Quote.length <= shortLength);
  let normalQuotes = quotesJson.filter(q =>
    q.Quote.length > shortLength && q.Quote.length < longLength);
  let longQuotes = quotesJson.filter(q =>
    q.Quote.length >= longLength);

  console.log(shortQuotes)
  console.log(longQuotes)
}


function binarySearch(ar, el, compare_fn = (el1, el2) => (el1 - el2)) {
  var m = 0;
  var n = ar.length - 1;
  while (m <= n) {
    var k = (n + m) >> 1;
    var cmp = compare_fn(el, ar[k]);
    if (cmp > 0) {
      m = k + 1;
    } else if (cmp < 0) {
      n = k - 1;
    } else {
      return k;
    }
  }
  return -m - 1;
}

console.log(quotesJson.length)
console.log(quotesJson[0])

//console.log(quotesJson.map(q=>q.Popularity))

let sommePop = quotesJson.reduce((p, c) => {
  c.sommePop = p + c.Popularity;
  return p + c.Popularity;
}, 0);

function groupBy(arr, fnMod) {
  return arr.reduce((p, c) => {
    p[fnMod(c)] = p[fnMod(c)] || 0
    p[fnMod(c)]++
    return p;
  }, {})
}
console.log(groupBy(quotesJson, q => q.Quote.length));

console.log("Somme Popularity : ", sommePop)

for (let i = 0; i < 10; i++) {
  //getRandomQuote();
}

export const createQuotesStore = () => ({
  currentQuoteInd: 0,
  getCurrentQuote: () => quotesJson[this.currentQuoteInd],
  getRandomQuote: () => {
    let randTarget = Math.random() * sommePop;
    let indexNewQuote = Math.abs(
      binarySearch(quotesJson, randTarget,
        (target, quote) => target - quote.sommePop))
    //console.log("Target pop : " , randTarget)

    console.log(indexNewQuote, " : ", quotesJson[indexNewQuote]);

    this.currentQuoteInd = indexNewQuote

    return quotesJson[indexNewQuote]
  }
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

    currentQuoteInd: 0,
    getCurrentQuote: () => quotesJson[this.currentQuoteInd],
    getRandomQuote: () => {
      let randTarget = Math.random() * sommePop;
      let indexNewQuote = Math.abs(
        binarySearch(quotesJson, randTarget,
          (target, quote) => target - quote.sommePop))
      //console.log("Target pop : " , randTarget)

      console.log(indexNewQuote, " : ", quotesJson[indexNewQuote]);

      this.currentQuoteInd = indexNewQuote

      return quotesJson[indexNewQuote]
    },

    startNew: () => {
      this.finalWPM = 0
      this.touchesTimes = []
      this.raceStartTime = null
      this.playingState = "countdownStart"
      return this.getRandomQuote()
    },

    tryAgain: () => {
      this.finalWPM = 0
      this.touchesTimes = []
      this.raceStartTime = null
      this.playingState = "countdownStart"
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

export default { quoteContext, QuoteProvider };