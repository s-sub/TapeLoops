import {useState,useEffect} from 'react';
import {useStateValue} from '../state'
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
// let interval = setInterval(()=>{})

export default function RangeSlider() {


  const [{Tape1}, dispatch] = useStateValue();
  let loopstart = 0;
  let loopend = 100;
  let cliplength = 1;
  if (Tape1.audioSrc.buffer) {
        cliplength = Tape1.audioSrc.buffer.duration;
        loopstart = (Tape1.audioSrc.loopStart/cliplength)*100;
        loopend = (Tape1.audioSrc.loopEnd/cliplength)*100;
    }

  const [values, setValues] = useState<number[]>([loopstart, loopstart, loopend]);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [intervalID, setIntervalID] = useState(setInterval(()=>{}));
  let speed = Tape1.speed;
  let lastSpeedChange = Tape1.speedChangeTime;

  useEffect(() => {
    // speed = Tape1.speed;
    // lastSpeedChange = Tape1.speedChangeTime;
    if (!Tape1.play) {
        // console.log('CLEARED')
        clearInterval(intervalID)
    }
    else {
        clearInterval(intervalID)
        console.log('timegap',Tape1.audioCtx.currentTime-lastSpeedChange)
        const interval = setInterval(() => {
        const moduloTime = ((((Tape1.audioCtx.currentTime-lastSpeedChange)*speed)+lastSpeedChange)/cliplength)*100 % (loopend-loopstart)
        setValues([loopstart,((moduloTime)+loopstart),loopend])
    }, 20)
        setIntervalID(interval)
    }
  },[Tape1.play])

  useEffect(() => {
    speed = Tape1.speed;
    //Drop off point - to make sure things are synced during/after timechange (won't be perfect)
    // lastSpeedChange = Tape1.speedChangeTime;
    lastSpeedChange = Tape1.audioCtx.currentTime;
    if (Tape1.play) {
        clearInterval(intervalID)
        const interval = setInterval(() => {
        const moduloTime = ((((Tape1.audioCtx.currentTime-lastSpeedChange)*speed)+lastSpeedChange)/cliplength)*100 % (loopend-loopstart)
        setValues([loopstart,((moduloTime)+loopstart),loopend])
    }, 20)
        setIntervalID(interval)
    }
  },[Tape1.speed])

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValues(newValue as number[]);
  };

//   const handleRelease = (event: Event, newValue: number | number[]) => {
//     setValues(newValue as number[]);
//   };

  return (
    <StyledSlider
        // defaultValue={[loopstart, 30, loopend]}
        value={values}
        onChange={handleChange}
        // onChangeCommitted={handleRelease}
        min={0}
        max={100}
    />
  );
}
