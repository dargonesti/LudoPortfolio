import React, { createContext } from "react";
import { useLocalStore } from "mobx-react-lite";

import textJson from "./text.json";


//console.log(quotesJson.map(q=>q.Popularity))

const ENGLISH = 0;
const FRENCH = 1;


function groupBy(arr, fnMod) {
  return arr.reduce((p, c) => {
    p[fnMod(c)] = p[fnMod(c)] || 0
    p[fnMod(c)]++
    return p;
  }, {})
}

export const createTextStore = () => ({
  lan: ENGLISH,
  //getCurrentQuote() { return quotesJson[this.currentQuoteInd] || "[Pick a new quote]" },
  get(cat, key) {
    if(key == null){
      key=cat;
      cat="general";
    }
    if (cat in textJson && key in textJson[cat])
      return textJson[cat][key][this.lan];
    else
      return key
  },
  toggleLanguage() {
    this.lan = this.lan == FRENCH ? ENGLISH : FRENCH;
  }
})

export const textContext = createContext();

export const TextProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    lan: ENGLISH,
    currentQuoteInd: 0,

    get(cat, key) {
      if (cat in textJson && key in textJson[cat])
        return textJson[cat][key][this.lan];
      else
        return key
    },
    
    toggleLanguage() {
      this.lan = this.lan == FRENCH ? ENGLISH : FRENCH;
    }
  }));

  return (
    <textContext.Provider value={store}>{children}</textContext.Provider>
  );
};

export default { textContext, TextProvider: TextProvider, createTextStore: createTextStore };