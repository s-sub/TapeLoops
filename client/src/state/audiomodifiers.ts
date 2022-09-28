import { AudioParams, Tape } from "../types";

/** Restart the Web Audio API audio context for a given tape with specified parameters.
 *  Params include loop start/end times, speed, and underlying audio buffer. 
 *  Closing and opening new audio contexts are cheap and quick operations in the Web Audio API 
 *  and should result in reasonable performance even when performed several times.
 *  Direct state changes to an audio context seem unsupported via deep copies of the state in the dispatcher, so this method is preferred.
 */
export const restartContext = (tape: Tape, params: AudioParams): {newaudioCtx: AudioContext, newaudioSrc: AudioBufferSourceNode} => {
    const originalPlayState = tape.play;

    // Suspend and close existing audio context and create a new one.
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

    // Assign audio buffer, loop start/end times, and speed as provided via the params prop.
    if (params.audioBuffer!==undefined) {source.buffer = params.audioBuffer;} else if (tape.audioSrc) {source.buffer = tape.audioSrc.buffer}
    if (source.buffer!==null) {cliplength = source.buffer.duration;}
    if (params.loopStart!==undefined) {source.loopStart = params.loopStart;} else {source.loopStart = (tape.loopstart/100)*cliplength}
    if (params.loopEnd!==undefined) {source.loopEnd = params.loopEnd;} else {source.loopEnd = ((tape.loopstart + tape.looplen) / 100)*cliplength}
    if (params.speed!==undefined) {source.playbackRate.value = params.speed;} else {source.playbackRate.value = tape.speed;}

    let timeOffset = source.loopStart;
    if (params.timeOffset) {timeOffset = params.timeOffset;}

    source.start(0, timeOffset);
    audioCtx.suspend();

    // Connect context and play audio if play button engaged.
    source.connect(audioCtx.destination);
    if (originalPlayState) {
        audioCtx.resume()
    }

    // Return new audio context and source to be dispatched as state variables
    return {
        newaudioCtx: audioCtx,
        newaudioSrc: source
    }
};