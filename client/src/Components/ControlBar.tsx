// import {useState,useEffect} from 'react';
import { useStateValue, setPlay, setLooplen, setLoopstart, setCtx, setSrc,restartContext, setSpeedChangeTime} from '../state';
import {useState} from 'react';
import { Tape } from '../types';
import '../Styles/Deck.css'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';


export default function ControlBar(props: {tape: Tape}) {
    const tape = props.tape;
    const [, dispatch] = useStateValue();
    const [loopstate, setLoopstate] = useState([1,0,0,0]);

    const togglePlay = async () => {
        if (tape.audioSrc.buffer) {
            const play = !tape.play
            dispatch(setPlay(play, tape.name))
            play ? tape.audioCtx.resume() : tape.audioCtx.suspend();
            const temp = play ? "running" : "paused"
            document.documentElement.style.setProperty('--play', temp);
        }
    }

    const setLoop = (loopPortion: number) => {
        //To add comments
        const setter = async () => {
            if (!tape.audioSrc.buffer) {return}

            const newLoop = 1/loopPortion;
            const cliplength = tape.audioSrc.buffer.duration;
            const currTime = (((tape.audioCtx.currentTime*tape.speed / cliplength) * 100 ) % (tape.looplen)) + tape.loopstart;
            const transformTime = currTime/100 * cliplength;

            await dispatch(setLooplen(100*newLoop, tape.name))

            const newLoopStart = Math.min(transformTime,cliplength*(1 - (newLoop)))
            await dispatch(setLoopstart(100*newLoopStart/cliplength, tape.name))

            const audioParams = {
                loopStart: newLoopStart,
                loopEnd: newLoopStart + cliplength*newLoop,
                // timeOffset: transformTime
            }
            const {newaudioCtx: newaudioCtx, newaudioSrc: newaudioSrc} = restartContext(tape, audioParams);
            dispatch(setCtx(newaudioCtx, tape.name))
            dispatch(setSrc(newaudioSrc, tape.name))
            //To-do - kill SpeedChangeTime everywhere
            dispatch(setSpeedChangeTime(currTime))

            switch(loopPortion) {
                case 1:
                    setLoopstate([1,0,0,0])
                    break;
                case 2:
                    setLoopstate([0,1,0,0])
                    break;
                case 4:
                    setLoopstate([0,0,1,0])
                    break;
                case 8:
                    setLoopstate([0,0,0,1])
                    break;
                default:
                    setLoopstate([1,0,0,0])
            }

        }
        return setter
    }


    return (
        <Box sx={{ ml: -2 }}>
        <Grid
            container
            spacing={3}
            columns={16}
            justifyContent="center"
        >
            <Grid item xs ={3}>
                <Button className={tape.play ? "ControlButtons-clicked" : "ControlButtons"} onClick={togglePlay}> 
                    {tape.play ? <PauseIcon className="Icon-clicked"/> : <PlayArrowIcon className="Icon"/>}
                </Button>
            </Grid>
            <Grid item xs ={3}>
                <Button className={loopstate[0] ? "ControlButtons-clicked" : "ControlButtons"} onClick={setLoop(1)}> 
                    1
                </Button>
            </Grid>
            <Grid item xs ={3}>
                <Button className={loopstate[1] ? "ControlButtons-clicked" : "ControlButtons"} onClick={setLoop(2)}> 1/2 </Button>
            </Grid>
            <Grid item xs ={3}>
                <Button className={loopstate[2] ? "ControlButtons-clicked" : "ControlButtons"} onClick={setLoop(4)}> 1/4 </Button>
            </Grid>
            <Grid item xs ={3}>
                <Button className={loopstate[3] ? "ControlButtons-clicked" : "ControlButtons"} onClick={setLoop(8)}> 1/8 </Button>
            </Grid>
        </Grid>
        </Box>
    )

}