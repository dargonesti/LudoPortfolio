import React from 'react'
import { useLocalStore } from 'mobx-react-lite'
//Servers as an example : 
//    import {createQuotesStore} from "./Quotes"
// from : https://github.com/andresrestrepo/tictactoe/blob/master/src/stores/ConfigStore.js 

const storeContext = React.createContext();

function createGameStore() {

    return {
        font: "Special Elite",
        changeFont(newFont) {
            this.font = newFont
        },
        replacesStickyHeader:false,
        replaceSticky(val){
            this.replacesStickyHeader=val
        },
    //Servers as an example : 
      //  ,...createQuotesStore()
    }
}

export const StoreProvider = ({ children }) => {
    const store = useLocalStore(createGameStore)
    return <storeContext.Provider value={store}>{children}</storeContext.Provider>
}

export const useStore = () => {
    const store = React.useContext(storeContext)
    if (!store) {
        throw new Error('You have forgot to use StoreProvider, shame on you.')
    }
    return store
}