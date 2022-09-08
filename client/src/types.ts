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
    audioBuffer: AudioBuffer;
}

export type AudioParams = {
    audioBuffer?: AudioBuffer;
    loopStart?: number;
    loopEnd?: number;
    speed?: number;
    timeOffset?: number;
}