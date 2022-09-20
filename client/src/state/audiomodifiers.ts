import { AudioParams, Tape } from "../types";

export const restartContext = (tape: Tape, params: AudioParams): {newaudioCtx: AudioContext, newaudioSrc: AudioBufferSourceNode} => {
    const originalPlayState = tape.play;
    if (tape.audioCtx.state !== "closed") {
        if (originalPlayState) {
            tape.audioCtx.suspend()
        }
        tape.audioCtx.close()
    }
    const audioCtx = new AudioContext()
    
    const source = audioCtx.createBufferSource();
    source.loop = true;
    let cliplength = 0;

    if (params.audioBuffer!==undefined) {source.buffer = params.audioBuffer;} else if (tape.audioSrc) {source.buffer = tape.audioSrc.buffer}
    if (source.buffer!==null) {cliplength = source.buffer.duration;}
    if (params.loopStart!==undefined) {source.loopStart = params.loopStart;} else {source.loopStart = (tape.loopstart/100)*cliplength}
    if (params.loopEnd!==undefined) {source.loopEnd = params.loopEnd;} else {source.loopEnd = ((tape.loopstart + tape.looplen) / 100)*cliplength}
    if (params.speed!==undefined) {source.playbackRate.value = params.speed;} else {source.playbackRate.value = tape.speed;}

    let timeOffset = source.loopStart;
    if (params.timeOffset) {timeOffset = params.timeOffset;}

    source.start(0, timeOffset);
    audioCtx.suspend();

    source.connect(audioCtx.destination);
    if (originalPlayState) {
        audioCtx.resume()
    }
    return {
        newaudioCtx: audioCtx,
        newaudioSrc: source
    }
};