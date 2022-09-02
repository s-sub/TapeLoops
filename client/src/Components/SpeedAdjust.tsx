import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useStateValue, setSpeed_anim, setPlay, setSpeedChangeTime} from '../state';

export default function VerticalSlider() {
    
    const [{Tape1}, dispatch] = useStateValue();

    const [value, setValue] = React.useState<number>(100);


    const marks = [
        {
          value: 84,
          label: '-16%',
        },
        {
          value: 92,
          label: '-8%',
        },
        {
          value: 100,
          label: '0x',
        },
        {
          value: 108,
          label: '+8%',
        },
        {
          value: 116,
          label: '+16%',
        },
      ];
      

    const preventHorizontalKeyboardNavigation = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        }
    }

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    }

    //Forced to mutate state directly since modifying shallow state copy doesn't seem to work in reducer...
    const handleChangeCommit = async () => {
        const originalPlayState = Tape1.play;
        await dispatch(setPlay(false))
        await dispatch(setSpeed_anim((value/100)));
        if (originalPlayState) {Tape1.audioCtx.suspend()}
        Tape1.audioSrc.playbackRate.value = value/100
        dispatch(setSpeedChangeTime(Tape1.audioCtx.currentTime));        
        if (originalPlayState) {
          Tape1.audioCtx.resume()
          dispatch(setPlay(true))
        }
    };

    const valuetext = (value: number) => {
        const returnval = value/100;
        return `${returnval}x`;
    }

    return (
        <Box sx={{ height: 1 }}>
        <Slider
            sx={{
            '& input[type="range"]': {
                WebkitAppearance: 'slider-vertical',
            },
            }}
            orientation="vertical"
            value = {value}
            aria-label="Speed"
            getAriaValueText={valuetext}
            // valueLabelDisplay="auto"
            min={84}
            max={116}
            marks={marks}
            onKeyDown={preventHorizontalKeyboardNavigation}
            onChange={handleChange}
            onChangeCommitted={handleChangeCommit}
        />
        </Box>
    );
}