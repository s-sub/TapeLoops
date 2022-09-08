import {useState,useEffect} from 'react';
import {useStateValue, setSrc, setCtx, restartContext, setLoopstart} from '../state'
import { styled, alpha} from '@mui/system';
import SliderUnstyled, { sliderUnstyledClasses } from '@mui/base/SliderUnstyled';

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
    background-color: currentColor;
    opacity: 0.4;
  }

  & .${sliderUnstyledClasses.track} {
    display: block;
    position: absolute;
    height: 12px;
    border-radius: 2px;
    background-color: currentColor;
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

export default function RangeSlider() {


  const [{Tape1},dispatch] = useStateValue();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [intervalID, setIntervalID] = useState(setInterval(()=>{}));
  const [cliplength, setCliplength] = useState<number>(0);
  const [loopstart,setLoopStart] = useState<number>(0);
  const [loopend,setLoopend] = useState<number>(100);
  const [values, setValues] = useState<number[]>([loopstart, loopstart, loopend]);
  const [initialThumbMoved, setInitialThumbMoved] = useState<number>(-1);


  useEffect(() => {
    if (Tape1.audioSrc.buffer) {
        const newloopStart = (Tape1.audioSrc.loopStart/Tape1.audioSrc.buffer.duration)*100;
        const newloopEnd = (Tape1.audioSrc.loopEnd/Tape1.audioSrc.buffer.duration)*100
        setCliplength(Tape1.audioSrc.buffer.duration)
        setLoopStart(newloopStart)
        setLoopend(newloopEnd)
    }
  },[Tape1.audioSrc])

  // useEffect(() => {
  //   setLoopend(Tape1.looplen)
  //   const currtime = values[1]
  //   setValues([loopstart,currtime,Tape1.looplen])
  // },[Tape1.looplen])

  // useEffect(() => {
  //   const currtime = values[1]
  //   setValues([loopstart,currtime,loopend])
  // },[loopstart,loopend])

  useEffect(() => {
    //Refactor so that time step is a constant sum and doesn't require the full calculation each time....
    const refreshtime = 10;
    const loopend = Tape1.looplen + Tape1.loopstart;
    const loopstart = Tape1.loopstart;
    const oldvals = values.slice();
    if (!Tape1.play) {
        // Tape1.audioCtx.suspend();
        clearInterval(intervalID)
        setValues([loopstart,oldvals[1],loopend])
    }
    else {
        clearInterval(intervalID)
        // const oldvals = values.slice();
        // const offset = oldvals[1];
        const interval = setInterval(() => {
        // const moduloTime = ((((Tape1.audioCtx.currentTime-lastSpeedChange)*speed)+lastSpeedChange)/cliplength)*100 % (loopend-loopstart)
        const moduloTime = (((((Tape1.audioCtx.currentTime)*Tape1.speed))/cliplength)*100) % (loopend-loopstart)
        setValues([loopstart,((moduloTime)+loopstart),loopend])
    }, refreshtime)
        setIntervalID(interval)
    }
  },[Tape1.play,Tape1.looplen,Tape1.loopstart, Tape1.audioCtx, Tape1.audioSrc])

  const handleChange = (event: Event, newValue: number | number[], activeThumb: number) => {
    const newValAsserted = newValue as number[];
    let newstartval = 0, newendval = 100, newcurrval = 0;
    if (activeThumb===1 && (newValAsserted[0]===0 || newValAsserted[2]===100)) {return}
    const originalPlayState = Tape1.play;
    if (originalPlayState) {
        Tape1.audioCtx.suspend()
        clearInterval(intervalID)
    }
    if (activeThumb !== 1 && initialThumbMoved === -1) {
      setInitialThumbMoved(activeThumb)
    }
    if (initialThumbMoved===0) {
      newstartval = Math.min(newValAsserted[activeThumb],100-Tape1.looplen)
      newendval = Math.min(100,newstartval+Tape1.looplen)
      newcurrval = Math.max(Math.min(newstartval,newendval), Math.min(Math.max(newstartval,newendval),newValAsserted[1]))
      setValues([newstartval,newcurrval,newendval])
    }
    if (initialThumbMoved===2) {
      newendval = Math.max(Tape1.looplen,newValAsserted[activeThumb])
      newstartval = Math.max(0,newendval-Tape1.looplen)
      newcurrval = Math.max(Math.min(newstartval,newendval), Math.min(Math.max(newstartval,newendval),newValAsserted[1]))
      setValues([newstartval,newcurrval,newendval])
    }
  };

  const handleRelease = (event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]) => {
    setInitialThumbMoved(-1)
    const newValAsserted = newValue as number[];
    const newLoopStart = (newValAsserted[0]/100)*cliplength;
    const newLoopEnd = (newValAsserted[2]/100)*cliplength;
    //Need to fix the interval for the below to work. For now, resets to  beginning of new interavl
    // const timeOffset = (newValAsserted[1]/100) * cliplength;

    const audioParams = {
      loopStart: newLoopStart,
      loopEnd: newLoopEnd,
      // timeOffset: timeOffset
    }
    const {newaudioCtx: newaudioCtx, newaudioSrc: newaudioSrc} = restartContext(Tape1, audioParams);
    dispatch(setLoopstart(newValAsserted[0]))
    dispatch(setCtx(newaudioCtx))
    dispatch(setSrc(newaudioSrc))
  };

  return (
    <StyledSlider
        // defaultValue={[loopstart, 30, loopend]}
        value={values}
        onChange={handleChange}
        onChangeCommitted={handleRelease}
        min={0}
        max={100}
    />
  );
}
