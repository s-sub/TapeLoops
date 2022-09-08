// import {useState,useEffect} from 'react';
import { useStateValue, setPlay, setLooplen, setLoopstart, setCtx, setSrc,restartContext, setSpeedChangeTime} from '../state';

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
        //To add comments - and to debug case where loop-start is set behind current time
        const setter = async () => {
            if (!Tape1.audioSrc.buffer) {return}

            const newLoop = 1/loopPortion;
            const cliplength = Tape1.audioSrc.buffer.duration;
            const currTime = (((Tape1.audioCtx.currentTime*Tape1.speed / cliplength) * 100 ) % (Tape1.looplen)) + Tape1.loopstart;
            const transformTime = currTime/100 * cliplength;

            console.log(Tape1.looplen, Tape1.loopstart)

            await dispatch(setLooplen(100*newLoop))

            const newLoopStart = Math.min(transformTime,cliplength*(1 - (newLoop)))
            await dispatch(setLoopstart(100*newLoopStart/cliplength))

            const audioParams = {
                loopStart: newLoopStart,
                loopEnd: newLoopStart + cliplength*newLoop,
                // timeOffset: transformTime
            }
            const {newaudioCtx: newaudioCtx, newaudioSrc: newaudioSrc} = restartContext(Tape1, audioParams);
            dispatch(setCtx(newaudioCtx))
            dispatch(setSrc(newaudioSrc))
            dispatch(setSpeedChangeTime(currTime))


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