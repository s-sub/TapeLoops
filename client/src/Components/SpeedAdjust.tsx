import * as React from 'react';
// import Slider from '@mui/material/Slider';
import { Tape } from '../types';
import { useStateValue, setSpeed_anim, setSrc, setCtx, restartContext} from '../state';
// import { styled} from '@mui/system';
import { SpeedSlider } from '../Styles/CustomStyles'

export default function VerticalSlider(props: {tape: Tape}) {
    const tape = props.tape;
    const [, dispatch] = useStateValue();

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
          label: '1x',
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

    // On slider release, restart context with new speed value
    const handleChangeCommit = async () => {
        const audioParams = {speed: value/100}
        dispatch(setSpeed_anim((value/100), tape.name));
        const {newaudioCtx: newaudioCtx, newaudioSrc: newaudioSrc} = restartContext(tape, audioParams);
        dispatch(setCtx(newaudioCtx, tape.name))
        dispatch(setSrc(newaudioSrc, tape.name))
    };

    const valuetext = (value: number) => {
        const returnval = value/100;
        return `${returnval}x`;
    }

    return (
        <SpeedSlider
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
    );
}