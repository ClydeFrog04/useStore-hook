import { useState, useEffect } from 'react';

let globalState = {};
let listeners = [];
let actions = {};

export const useStore = () => {
  const setState = useState(globalState)[1];

  const dispatch = (actionIdentifier, payload) => {
    // doing same thing as redux, get action identifier & payload and call that action with the old state (globalState) then return the new state
    const newState = actions[actionIdentifier](globalState, payload);
    // merge global state with the old state and the new state
    globalState = {
      ...globalState,
      ...newState,
    };
    // updates react state with the new globalState and rerender the component using the custom hook useStore
    for (const listener of listeners) {
      listener(globalState);
    }
  };
  useEffect(() => {
    // adding setState to listeners when component mounts
    listeners.push(setState);

    return () => {
      // removing (cleanup) setState from listeners when component unmounts
      listeners = listeners.filter(li => li !== setState);
    };
  }, [setState]);
  // doing the same thing as useReducer by returning global state and dispatch
  return [globalState, dispatch];
};

export const initStore = (userActions, initialState) => {
  if (initialState) {
    // if there is initial state, merge it into global state
    globalState = {
      ...globalState,
      ...initialState,
    };
    // merge user actions into the global actions
    actions = {
      ...actions,
      ...userActions,
    };
  }
};
