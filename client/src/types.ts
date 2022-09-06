export interface SongEntry {
    song: string;
    id: string;
    key: string;
}

export type Tape = {
    speed: number;
    speedChangeTime: number;
    play: boolean;
    looplen: number;
    loopstart: number;
    audio: string | null;
    audioCtx: AudioContext;
    audioSrc: AudioBufferSourceNode;
}