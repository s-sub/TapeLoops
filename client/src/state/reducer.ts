import { State } from "./state";
import { SongEntry } from "../types";

export type Action =
  | {
      type: "SET_SPEED_ANIM";
      payload: number;
    }
  | {
    type: "SET_SPEED_CHANGE_TIME";
    payload: number;
    }
  | {
      type: "PLAY_TOGGLE";
      payload: boolean;
    }
  | {
      type: "SET_SOURCE";
      payload: AudioBufferSourceNode;
    }
  | {
      type: "SET_CONTEXT";
      payload: AudioContext;
    }
  | {
    type: "SET_SONGLIST";
    payload: Array<SongEntry>;
  }
  | {
    type: "SET_LOOPSTART";
    payload: number;
  }
  | {
    type: "SET_LOOPLEN";
    payload: number;
  };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_SPEED_ANIM":
            return {
                ...state,
                Tape1: {
                    ...state.Tape1,
                    speed: action.payload
                    // audioSrc: {
                    //     ...state.Tape1.audioSrc,
                        // playbackRate: {
                        //     ...state.Tape1.audioSrc.playbackRate,
                        //     value: action.payload
                        // }
                    // }
                    
                },
            };
        case "SET_SPEED_CHANGE_TIME":
            return {
                ...state,
                Tape1: {
                    ...state.Tape1,
                    speedChangeTime: action.payload
                }
            };
        case "PLAY_TOGGLE":
            return {
                ...state,
                Tape1: {
                    ...state.Tape1,
                    play: action.payload
                },
            };
        case "SET_SOURCE":
            return {
                ...state,
                Tape1: {
                    ...state.Tape1,
                    audioSrc: action.payload
                },
            };
        case "SET_CONTEXT":
            return {
                ...state,
                Tape1: {
                    ...state.Tape1,
                    audioCtx: action.payload
                }
            };
        case "SET_SONGLIST":
            return {
                ...state,
                audiolist: action.payload
            };
        case "SET_LOOPSTART":
            return {
                ...state,
                Tape1: {
                    ...state.Tape1,
                    loopstart: action.payload
                }
            };
        case "SET_LOOPLEN":
            return {
                ...state,
                Tape1: {
                    ...state.Tape1,
                    looplen: action.payload
                }
            };
        default:
            return state;
    }
};

//NONE OF THE STATE UPDATES ARE WORKING VIA THE REDUCER - DEBUG
export const setSpeed_anim = (speed: number): Action => {
    const newduration = 3/(speed**4);
    document.documentElement.style.setProperty('--animation-duration', `${newduration}s`);
    console.log('speed',speed)
    return { type: "SET_SPEED_ANIM", payload: speed };
};

export const setSpeedChangeTime = (time: number): Action => {
    return {type: "SET_SPEED_CHANGE_TIME", payload: time};
};

export const setPlay = (play: boolean): Action => {
    document.documentElement.style.setProperty('--play', play ? "running" : "paused");
    console.log('setting play to:', play)
    return {type: "PLAY_TOGGLE", payload: play};
};

export const setSrc = (source: AudioBufferSourceNode): Action => {    
    return {type: "SET_SOURCE", payload: source};
};

export const setSongList = (songs: Array<SongEntry>): Action => {
    return {type: "SET_SONGLIST", payload: songs};
};

export const setCtx = (context: AudioContext): Action => {    
    return {type: "SET_CONTEXT", payload: context};
};

export const setLoopstart = (loopstart: number): Action => {    
    return {type: "SET_LOOPSTART", payload: loopstart};
};

export const setLooplen = (looplen: number): Action => {    
    return {type: "SET_LOOPLEN", payload: looplen};
};

// export const setSpeed_playback = (speed:number, audio: AudioBufferSourceNode, context: AudioContext): Action => {
//     audio.disconnect();
//     const newsource = context.createBufferSource()
//     newsource.buffer = audio.buffer;
//     newsource.connect(context.destination);
//     newsource.loop = true;
//     newsource.playbackRate.value = speed;
//     newsource.start()
//     return {type: "SET_SPEED_PLAYBACK", payload: newsource}
// }

