import {useState,useEffect} from 'react';
import {useStateValue, setSrc, setCtx, restartContext, setLoopstart} from '../state'
import { styled, alpha} from '@mui/system';
import { Tape } from '../types';
import SliderUnstyled, { sliderUnstyledClasses } from '@mui/base/SliderUnstyled';
import Box from '@mui/material/Box';

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  300: '#66B2FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

const StyledSlider = styled(SliderUnstyled)(
  ({ theme }) => `
  color: ${theme.palette.mode === 'light' ? '#000000' : blue[300]};
  height: 6px;
  width: 100%;
  padding: 16px 0;
  display: inline-block;
  position: relative;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    opacity: 1;
  }

  &.${sliderUnstyledClasses.disabled} { 
    pointer-events: none;
    cursor: default;
    color: ${theme.palette.mode === 'light' ? grey[300] : grey[600]};
    opacity: 0.5;
  }

  & .${sliderUnstyledClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 12px;
    border-radius: 2px;
    background-color: #ada4a1;
    opacity: 0.4;
  }

  & .${sliderUnstyledClasses.track} {
    display: block;
    position: absolute;
    height: 12px;
    border-radius: 2px;
    background-color: #FF926B;
  }

  & .${sliderUnstyledClasses.thumb} {
    position: absolute;
    width: 16px;
    height: 16px;
    margin-left: -6px;
    margin-top: -2px;
    box-sizing: border-box;
    border-radius: 50%;
    outline: 0;
    border: 3px solid currentColor;
    background-color: #fff;

    :hover,
    &.${sliderUnstyledClasses.focusVisible} {
      box-shadow: 0 0 0 0.25rem ${alpha(
        theme.palette.mode === 'light' ? blue[400] : blue[300],
        0.15,
      )};
    }

    &.${sliderUnstyledClasses.active} {
      box-shadow: 0 0 0 0.25rem ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[300],
        0.3,
      )};
    }
  }

  & .${sliderUnstyledClasses.mark} {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 2px;
    background-color: currentColor;
    top: 50%;
    opacity: 0.7;
    transform: translateX(-50%);
  }

  & .${sliderUnstyledClasses.markActive} {
    background-color: #fff;
  }

  & .${sliderUnstyledClasses.valueLabel} {
    font-family: IBM Plex Sans;
    font-size: 14px;
    display: block;
    position: relative;
    top: -1.6em;
    text-align: center;
    transform: translateX(-50%);
  }
`,
);

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

  
  // Updates sate variables for the "handleChange" and "handleRelease" loop handlers
  useEffect(() => {
    if (tape.audioSrc.buffer) {
        const newloopStart = (tape.audioSrc.loopStart/tape.audioSrc.buffer.duration)*100;
        const newloopEnd = (tape.audioSrc.loopEnd/tape.audioSrc.buffer.duration)*100
        setCliplength(tape.audioSrc.buffer.duration)
        setLoopStart(newloopStart)
        setLoopend(newloopEnd)
    }
  },[tape.audioSrc, tape.audioCtx])

  // useEffect(() => {
  //   setLoopend(tape.looplen)
  //   const currtime = values[1]
  //   setValues([loopstart,currtime,tape.looplen])
  // },[tape.looplen])

  // useEffect(() => {
  //   const currtime = values[1]
  //   setValues([loopstart,currtime,loopend])
  // },[loopstart,loopend])


  //refactor -> try // catch
  useEffect(() => {
    //Refactor so that time step is a constant sum and doesn't require the full calculation each time....
    let cliplength = 1;
    if (tape.audioSrc.buffer) {cliplength = tape.audioSrc.buffer.duration}
    const refreshtime = 5;
    const loopend = tape.looplen + tape.loopstart;
    const loopstart = tape.loopstart;
    const oldvals = values.slice();
    if (!tape.play) {
        // tape.audioCtx.suspend();
        clearInterval(intervalID)
        setValues([loopstart,oldvals[1],loopend])
    }
    else {
        clearInterval(intervalID)
        // let moduloTime = cliplength * oldvals[1]/100;
        // const oldvals = values.slice();
        // const offset = oldvals[1];
        const interval = setInterval(() => {
        // const moduloTime = ((((tape.audioCtx.currentTime-lastSpeedChange)*speed)+lastSpeedChange)/cliplength)*100 % (loopend-loopstart)
        // const moduloFactor = 100 * 0.001*tape.speed/cliplength;
        // moduloTime = (moduloTime + refreshtime*moduloFactor) % (loopend-loopstart);
        const moduloTime = (((((tape.audioCtx.currentTime)*tape.speed))/cliplength)*100) % (loopend-loopstart)
        // console.log(tape.audioCtx.currentTime)
        setValues([loopstart,((moduloTime)+loopstart),loopend])
    }, refreshtime)
        setIntervalID(interval)
    }
  },[tape.play,tape.looplen,tape.loopstart, tape.audioCtx, tape.audioSrc, tape.speed])

  const handleChange = (event: Event, newValue: number | number[], activeThumb: number) => {
    const newValAsserted = newValue as number[];
    let newstartval = 0, newendval = 100, newcurrval = 0;
    if (activeThumb===1 && (newValAsserted[0]===0 || newValAsserted[2]===100)) {return}
    const originalPlayState = tape.play;
    if (originalPlayState) {
        tape.audioCtx.suspend()
        clearInterval(intervalID)
    }
    if (activeThumb !== 1 && initialThumbMoved === -1) {
      setInitialThumbMoved(activeThumb)
    }
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
      <StyledSlider
          value={values}
          onChange={handleChange}
          onChangeCommitted={handleRelease}
          min={0}
          max={100}
      />
    </Box>
  );
}
