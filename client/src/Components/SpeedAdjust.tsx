import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useStateValue, setSpeed_anim, setPlay, setSpeedChangeTime, setSrc, setCtx, restartContext} from '../state';
import { styled, alpha, createTheme} from '@mui/system';


// const green500 = "#228b22";
// const green900 = "#7FFF00";
const customTheme = createTheme({
  typography: {
    fontFamily: 'Courier'}
});

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: "#DDD6CE",
  "& .MuiSlider-thumb": {
    backgroundColor: "#FF926B", //color of thumbs
    radius: 30
  },
  "& .MuiSlider-rail": {
    color: '#cfc5c2' ////color of the slider outside  teh area between thumbs
  },
  "& .MuiSlider-track": {
    color: '#cfc5c2' ////color of the slider outside  teh area between thumbs
  },
  "& .MuiSlider-markLabel": {
    color: "black" ////color of the slider outside  teh area between thumbs
  }
  
}));

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

    const handleChangeCommit = async () => {
      
        const audioParams = {speed: value/100}
        dispatch(setSpeed_anim((value/100)));
        const {newaudioCtx: newaudioCtx, newaudioSrc: newaudioSrc} = restartContext(Tape1, audioParams);
        dispatch(setCtx(newaudioCtx))
        dispatch(setSrc(newaudioSrc))

    };

    const valuetext = (value: number) => {
        const returnval = value/100;
        return `${returnval}x`;
    }

    return (
        // <Box sx={{ height: 0.8, justifyContent: "center"}}>
        <CustomSlider theme={customTheme}
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
        // </Box>
    );
}