import { State} from "./state";
import { SongEntry , Tape} from "../types";

export type Action =
  | {
      type: "SET_SPEED_ANIM";
      tapename: string;
      payload: number;
    }
  | {
    type: "SET_SPEED_CHANGE_TIME";
    payload: number;
    }
  | {
      type: "PLAY_TOGGLE";
      tapename: string;
      payload: boolean;
    }
  | {
      type: "SET_SOURCE";
      tapename: string;
      payload: AudioBufferSourceNode;
    }
  | {
      type: "SET_CONTEXT";
      tapename: string;
      payload: AudioContext;
    }
  | {
    type: "SET_SONGLIST";
    payload: Array<SongEntry>;
  }
  | {
    type: "SET_LOOPSTART";
    tapename: string;
    payload: number;
  }
  | {
    type: "SET_LOOPLEN";
    tapename: string;
    payload: number;
  }
  | {
    type: "SET_EXISTING_USER_FLAG";
    payload: boolean;
  }
  | {
    type: "SET_FLUSH_FLAG";
    payload: boolean;
  };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_EXISTING_USER_FLAG":
            return {
                ...state,
                existingUser: action.payload
            };
        case "SET_FLUSH_FLAG": 
            return {
                ...state,
                flushFlag: action.payload
            };
        case "SET_SPEED_ANIM":
            return {
                ...state,
                [action.tapename]: {
                    ...(state[action.tapename as keyof State] as Tape),
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
                [action.tapename]: {
                    ...(state[action.tapename as keyof State] as Tape),
                    play: action.payload
                },
            };
        case "SET_SOURCE":
            return {
                ...state,
                [action.tapename]: {
                    ...(state[action.tapename as keyof State] as Tape),
                    audioSrc: action.payload
                },
            };
        case "SET_CONTEXT":
            return {
                ...state,
                [action.tapename]: {
                    ...(state[action.tapename as keyof State] as Tape),
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
                [action.tapename]: {
                    ...(state[action.tapename as keyof State] as Tape),
                    loopstart: action.payload
                }
            };
        case "SET_LOOPLEN":
            return {
                ...state,
                [action.tapename]: {
                    ...(state[action.tapename as keyof State] as Tape),
                    looplen: action.payload
                }
            };
        default:
            return state;
    }
};

//NONE OF THE STATE UPDATES ARE WORKING VIA THE REDUCER - DEBUG
export const setSpeed_anim = (speed: number, tapename: string): Action => {
    const newduration = 3/(speed**4);
    const CSSname = `--animation-duration-${tapename}`;
    document.documentElement.style.setProperty(CSSname, `${newduration}s`);
    console.log('speed',speed)
    return { type: "SET_SPEED_ANIM", tapename: tapename, payload: speed };
};

export const setSpeedChangeTime = (time: number): Action => {
    return {type: "SET_SPEED_CHANGE_TIME", payload: time};
};

export const setPlay = (play: boolean, tapename: string): Action => {
    /// To-Do: change CSS things...
    const CSSname = `--play-${tapename}`
    document.documentElement.style.setProperty(CSSname, play ? "running" : "paused");
    console.log('setting play to:', play)
    return {type: "PLAY_TOGGLE", tapename: tapename, payload: play};
};

export const setSrc = (source: AudioBufferSourceNode, tapename: string): Action => {    
    return {type: "SET_SOURCE", tapename: tapename, payload: source};
};

export const setSongList = (songs: Array<SongEntry>): Action => {
    return {type: "SET_SONGLIST", payload: songs};
};

export const setCtx = (context: AudioContext, tapename: string): Action => {    
    return {type: "SET_CONTEXT", tapename: tapename, payload: context};
};

export const setLoopstart = (loopstart: number, tapename: string): Action => {    
    return {type: "SET_LOOPSTART", tapename: tapename, payload: loopstart};
};

export const setLooplen = (looplen: number, tapename: string): Action => {    
    return {type: "SET_LOOPLEN", tapename: tapename, payload: looplen};
};

export const setExistingUser = (existingUser: boolean): Action => {    
    return {type: "SET_EXISTING_USER_FLAG", payload: existingUser};
};

export const setFlushFlag = (flushFlag: boolean): Action => {    
    return {type: "SET_FLUSH_FLAG", payload: flushFlag};
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

