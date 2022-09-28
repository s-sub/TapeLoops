import SliderUnstyled, { sliderUnstyledClasses } from '@mui/base/SliderUnstyled';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { styled, alpha} from '@mui/system';

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
  
export const PlayBarSlider = styled(SliderUnstyled)(
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

export const SpeedSlider = styled(Slider)(() => ({
    color: "#DDD6CE",
    fontFamily: "Courier",
    "& .MuiSlider-thumb": {
      backgroundColor: "#FF926B",
      radius: 30
    },
    "& .MuiSlider-rail": {
      color: '#cfc5c2'
    },
    "& .MuiSlider-track": {
      color: '#cfc5c2'
    },
    "& .MuiSlider-markLabel": {
      color: "black"
    }
}));

export const CustomButton = styled(Button)(() => ({
  backgroundColor: "#FF926B",
  color: "#000000",
  fontSize: 18,
  fontFamily: 'Courier',
  "&:disabled": {
      backgroundColor: '#C2C2C2'
  }
}));

export const ModalBoxStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex', 
  alignItems: 'center'
};