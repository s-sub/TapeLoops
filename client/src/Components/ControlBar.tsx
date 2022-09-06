// import {useState,useEffect} from 'react';
import { useStateValue, setPlay, setLooplen, setLoopstart, setCtx, setSrc, setSpeedChangeTime} from '../state';

export default function ControlBar() {

    const [{Tape1}, dispatch] = useStateValue();

    const togglePlay = async () => {
        // await setPlay2(!play)
        const play = !Tape1.play
        dispatch(setPlay(play))
        play ? Tape1.audioCtx.resume() : Tape1.audioCtx.suspend();
        const temp = play ? "running" : "paused"
        document.documentElement.style.setProperty('--play', temp);
    }

    const setLoop = (loopPortion: number) => {
        const setter = async () => {
            if (!Tape1.audioSrc.buffer) {return}





            const newLoop = 1/loopPortion;
            const cliplength = Tape1.audioSrc.buffer.duration;
            const currTime = (((Tape1.audioCtx.currentTime*Tape1.speed / cliplength) * 100 ) % (Tape1.looplen)) + Tape1.loopstart;
            const transformTime = currTime/100 * cliplength;
            // console.log(currTime,transformTime,'times')
            await dispatch(setLooplen(100*newLoop))

            // const cliplength = Tape1.audioSrc.buffer.duration;
            const newLoopStart = Math.min(transformTime,cliplength*(1 - (newLoop)))
            await dispatch(setLoopstart(100*newLoopStart/cliplength))
            // console.log(100*newLoopStart/cliplength,100*newLoop)
            // Tape1.audioSrc.loopStart = newLoopStart
            // Tape1.audioSrc.loopEnd = newLoopStart + cliplength*newLoop;

            //pasted in - to refactor as shared function
            const originalPlayState = Tape1.play;
            if (originalPlayState) {Tape1.audioCtx.suspend()}
            Tape1.audioCtx.close()
            const audioCtx = new AudioContext()
            await dispatch(setCtx(audioCtx))
            await dispatch(setPlay(false))
            const source = audioCtx.createBufferSource();

            const audioBuffer = Tape1.audioSrc.buffer;
            source.buffer = audioBuffer
            source.connect(audioCtx.destination);
            source.loop = true;
            // const cliplength = audioBuffer.duration;
            source.loopStart = newLoopStart;
            source.loopEnd = newLoopStart + cliplength*newLoop;
            source.playbackRate.value = Tape1.speed;
            source.start(0,transformTime);
            audioCtx.suspend();
            dispatch(setSrc(source));
            // dispatch(setSpeedChangeTime(transformTime));
            if (originalPlayState) {
                audioCtx.resume()
                dispatch(setPlay(true))
            }

        }
        return setter
    }


    return (
        <>
        <button onClick={togglePlay}> Play </button>
        <button onClick={setLoop(1)}> 1 </button>
        <button onClick={setLoop(2)}> 1/2 </button>
        <button onClick={setLoop(4)}> 1/4 </button>
        <button onClick={setLoop(8)}> 1/8 </button>
        </>
    )

}