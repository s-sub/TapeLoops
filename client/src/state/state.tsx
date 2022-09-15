import React, { createContext, useContext, useReducer } from "react";
import { SongEntry, Tape } from "../types";

import { Action } from "./reducer";

export type State = {
  Tape1: Tape;
  audiolist: Array<SongEntry>;
  existingUser: boolean;
  flushFlag: boolean;
};

const audioContextConstructor = new AudioContext()

const initialState: State = {
  Tape1: {speed: 1, speedChangeTime: 0, play: false, looplen: 100, loopstart: 0, audio: null, audioCtx: audioContextConstructor, audioSrc: audioContextConstructor.createBufferSource(), audioBuffer: audioContextConstructor.createBuffer(1, 22050, 22050)},
  audiolist: [],
  existingUser: false,
  flushFlag: false
  // Src1: audioContextConstructor.createBufferSource(),
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
