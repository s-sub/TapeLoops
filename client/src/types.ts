export interface SongEntry {
    song: string;
    id: string;
    key: string;
    cookieID?: string;
}

export type Tape = {
    name: string;
    speed: number;
    play: boolean;
    looplen: number;
    loopstart: number;
    audio: string | null;
    audioCtx: AudioContext;
    audioSrc: AudioBufferSourceNode;
    audioBuffer: AudioBuffer | null;
}

export type AudioParams = {
    audioBuffer?: AudioBuffer;
    loopStart?: number;
    loopEnd?: number;
    speed?: number;
    timeOffset?: number;
}