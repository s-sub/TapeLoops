import React, { createContext, useContext, useReducer } from "react";
import { SongEntry } from "../types";

import { Action } from "./reducer";

type Tape = {
    speed: number;
    speedChangeTime: number;
    play: boolean;
    audio: string | null;
    audioCtx: AudioContext;
    audioSrc: AudioBufferSourceNode;
}

export type State = {
  Tape1: Tape;
  audiolist: Array<SongEntry>;
};

const audioContextConstructor = new AudioContext()

const initialState: State = {
  Tape1: {speed: 1, speedChangeTime: 0, play: false, audio: null, audioCtx: audioContextConstructor, audioSrc: audioContextConstructor.createBufferSource()},
  audiolist: [],
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
