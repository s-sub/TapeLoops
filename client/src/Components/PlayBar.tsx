import {useState,useEffect} from 'react';
import {useStateValue, setSrc, setCtx, restartContext, setLoopstart} from '../state'
import { Tape } from '../types';
import { PlayBarSlider } from '../Styles/CustomStyles'
import Box from '@mui/material/Box';

export default function RangeSlider(props: {tape: Tape}) {
  const tape = props.tape;

  const [,dispatch] = useStateValue();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [intervalID, setIntervalID] = useState(setInterval(()=>{}));
  const [cliplength, setCliplength] = useState<number>(1);
  const [loopstart,setLoopStart] = useState<number>(0);
  const [loopend,setLoopend] = useState<number>(100);
  const [values, setValues] = useState<number[]>([loopstart, loopstart, loopend]);
  const [initialThumbMoved, setInitialThumbMoved] = useState<number>(-1);

  
  // Updates sate variables for use in the the "handleChange" and "handleRelease" loop handlers when context changes
  useEffect(() => {
    if (tape.audioSrc.buffer) {
        const newloopStart = (tape.audioSrc.loopStart/tape.audioSrc.buffer.duration)*100;
        const newloopEnd = (tape.audioSrc.loopEnd/tape.audioSrc.buffer.duration)*100
        setCliplength(tape.audioSrc.buffer.duration)
        setLoopStart(newloopStart)
        setLoopend(newloopEnd)
    }
  },[tape.audioSrc, tape.audioCtx])


  /**  Adjust position of the play bar's current time indicator to accurately reflect 
   *   the speed, loop interval, and current position of the audio configuration
   *   at any point at which the variables affecting that configuration change.
  */
  useEffect(() => {
    // Initialize variables
    let cliplength = 1;
    if (tape.audioSrc.buffer) {cliplength = tape.audioSrc.buffer.duration}
    const refreshtime = 5;
    const loopend = tape.looplen + tape.loopstart;
    const loopstart = tape.loopstart;
    const oldvals = values.slice();

    // If audio is paused, stop the slider from moving and log current position and loop intervals.
    if (!tape.play) {
        clearInterval(intervalID)
        setValues([loopstart,oldvals[1],loopend])
    }
    /**  If audio is playing, restart an interval that updates the position 
     *   of the slider at regular intervals to visually reflect the passage of time according to the audio configuration.
    */
    else {
        clearInterval(intervalID)
        const interval = setInterval(() => {
        const moduloTime = (((((tape.audioCtx.currentTime)*tape.speed))/cliplength)*100) % (loopend-loopstart)
        setValues([loopstart,((moduloTime)+loopstart),loopend])
    }, refreshtime)
        setIntervalID(interval)
    }
  },[tape.play,tape.looplen,tape.loopstart, tape.audioCtx, tape.audioSrc, tape.speed])


  // Pause audio when loop interval is adjusted and store the new start/end times
  const handleChange = (event: Event, newValue: number | number[], activeThumb: number) => {
    const newValAsserted = newValue as number[];
    let newstartval = 0, newendval = 100, newcurrval = 0;
    // If middle node (reflecting current time) is dragged and loop start/end intervals are at minimum/max already, do nothing
    if (activeThumb===1 && (newValAsserted[0]===0 || newValAsserted[2]===100)) {return}

    // If not already paused, pause audio while loop interval is being adjusted 
    const originalPlayState = tape.play;
    if (originalPlayState) {
        tape.audioCtx.suspend()
        clearInterval(intervalID)
    }
    // Store which of the 3 slider nodes were originally moved
    if (activeThumb !== 1 && initialThumbMoved === -1) {
      setInitialThumbMoved(activeThumb)
    }

    /** Shift start and end values according to the initial node moved,
     *  and show current node as either being kept in same position or dragged along with start/end nodes.
    */
    if (initialThumbMoved===0) {
      newstartval = Math.min(newValAsserted[activeThumb],100-tape.looplen)
      newendval = Math.min(100,newstartval+tape.looplen)
      newcurrval = Math.max(Math.min(newstartval,newendval), Math.min(Math.max(newstartval,newendval),newValAsserted[1]))
      setValues([newstartval,newcurrval,newendval])
    }
    if (initialThumbMoved===2) {
      newendval = Math.max(tape.looplen,newValAsserted[activeThumb])
      newstartval = Math.max(0,newendval-tape.looplen)
      newcurrval = Math.max(Math.min(newstartval,newendval), Math.min(Math.max(newstartval,newendval),newValAsserted[1]))
      setValues([newstartval,newcurrval,newendval])
    }
  };

  // When slider released, dispatch new loop start/end values and restart the audio context accordingly
  const handleRelease = (event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]) => {
    setInitialThumbMoved(-1)
    const newValAsserted = newValue as number[];
    const newLoopStart = (newValAsserted[0]/100)*cliplength;
    const newLoopEnd = (newValAsserted[2]/100)*cliplength;

    const audioParams = {
      loopStart: newLoopStart,
      loopEnd: newLoopEnd,
    }
    const {newaudioCtx: newaudioCtx, newaudioSrc: newaudioSrc} = restartContext(tape, audioParams);
    dispatch(setLoopstart(newValAsserted[0], tape.name))
    dispatch(setCtx(newaudioCtx, tape.name))
    dispatch(setSrc(newaudioSrc, tape.name))
  };

  return (
    <Box>
      <Box sx={{fontSize: 10, fontFamily: "Courier", fontStyle: "italic"}}>Slide the highlighted region to customize your loop!</Box>
      <PlayBarSlider
          value={values}
          onChange={handleChange}
          onChangeCommitted={handleRelease}
          min={0}
          max={100}
      />
    </Box>
  );
}
