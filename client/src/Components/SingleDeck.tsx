import {Grid} from '@mui/material'
import Box from '@mui/material/Box';
import {Tape} from '../types';

import CassetteLoops from './CassetteLoops'
import SpeedAdjust from './SpeedAdjust'
import SongMenu from './SongSelector';
import RangeSlider from './PlayBar';
import ControlBar from './ControlBar';

const SingleDeck = (props: {tape: Tape}) => {
    const tape = props.tape;
    return (
        <Box className="Case" padding={3}>
            <Grid container justifyContent="center" direction="row">
                    <Grid item xs={10}>
                        <RangeSlider tape={tape}/>
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item xs={10}><CassetteLoops tape={tape}/></Grid>
              <Grid item xs={2} padding={1.5}><SpeedAdjust tape={tape}/></Grid>
            </Grid>
            <Grid container direction="row" padding={0.8}>
              <Grid item xs={10}>
                <ControlBar tape={tape}/>
              </Grid>
              <Grid item xs={2}>
                </Grid>
            </Grid>
            <Grid container direction="row" padding={1.5}>
                <SongMenu tape={tape}/>
            </Grid>
        </Box>   
    )
}

export default SingleDeck