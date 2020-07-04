//*
import React, { createContext } from "react";
import { useLocalStore } from "mobx-react-lite";

export const context = createContext();

export const Provider = ({ children }) => {
  const store = useLocalStore(() => ({
  
    font: "Special Elite",
    changeFont(newFont){
      store.font = newFont
    }
  }));

  return (
    <context.Provider value={store}>{children}</context.Provider>
  );
};

export default {context, Provider}; 
/*
import { Analytics } from 'aws-amplify';

import { observable, computed, action } from "mobx";

export default class TodoListModel {
  todos = [];

  get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length;
  }

}
//*/