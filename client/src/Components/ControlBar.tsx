// import {useState,useEffect} from 'react';
import { useStateValue, setPlay, setLooplen, setLoopstart, setCtx, setSrc,restartContext, setSpeedChangeTime} from '../state';
import {useState} from 'react';
import '../Styles/Deck.css'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';


export default function ControlBar() {

    const [{Tape1}, dispatch] = useStateValue();
    const [loopstate, setLoopstate] = useState([1,0,0,0]);

    const togglePlay = async () => {
        // await setPlay2(!play)
        if (Tape1.audioSrc.buffer) {
            const play = !Tape1.play
            dispatch(setPlay(play))
            play ? Tape1.audioCtx.resume() : Tape1.audioCtx.suspend();
            const temp = play ? "running" : "paused"
            document.documentElement.style.setProperty('--play', temp);
        }
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
            // sx={{ flexGrow: 1 }}
            // rowSpacing={2}
            // columnSpacing={1}
            columns={16}
            justifyContent="center"
        >
            <Grid item xs ={3}>
                <Button className={Tape1.play ? "ControlButtons-clicked" : "ControlButtons"} onClick={togglePlay}> 
                    {Tape1.play ? <PauseIcon className="Icon-clicked"/> : <PlayArrowIcon className="Icon"/>}
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