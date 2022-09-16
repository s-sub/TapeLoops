import {useState, useEffect} from 'react';
import CassetteLoops from './Components/CassetteLoops'
import SpeedAdjust from './Components/SpeedAdjust'
import SongMenu from './Components/SongSelector';
import RangeSlider from './Components/PlayBar';
import ControlBar from './Components/ControlBar';
import UploadButton from './Components/UploadButton';

import './App.css';
import './Styles/Deck.css'
import axios from "axios";
import {Grid} from '@mui/material'
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {apiBaseUrl} from './constants'
import { useStateValue, setPlay, setSongList, setExistingUser, setFlushFlag } from './state';
import {SongEntry} from './types'


const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'courier',
      textTransform: 'none',
      fontSize: 14,
    },
  },
});


//To-do: 1) Fix smooth restart when song selection changes. 2) Add loop-adjustment capabilities
function App() {
  // const [play, setPlay2] = useState(false)
  const [{Tape1}, dispatch] = useStateValue();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchSongList = async () => {
      try {
        const { data: {files: songListFromApi, existingUser: existingUser, flushFlag: flushFlag } } = await axios.get<{files: SongEntry[], existingUser: boolean, flushFlag: boolean}>(
          `${apiBaseUrl}/songs`
        );
        // console.log('songlistfromapi',songListFromApi);
        // console.log(existingUser, flushFlag)
        
        if (existingUser) {
            axios.put<void>(`${apiBaseUrl}/users/touch`)
        }
        dispatch(setExistingUser(existingUser))
        dispatch(setFlushFlag(flushFlag))
        console.log('existinguser', existingUser, 'flushflag', flushFlag)
        dispatch(setSongList(songListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchSongList();
  }, [dispatch])

  return (
    <ThemeProvider theme = {theme}> 


      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <div className="App">
          <Grid sx={{ flexGrow: 1 }} container direction="column" justifyContent="center" spacing={2}>
            <Box className="Case" padding={3}>
            <Grid container justifyContent="center" direction="row">
              {/* <Grid container direction="column">   */}
                    <Grid item xs={10}>
                        <RangeSlider/>
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item xs={10}><CassetteLoops looplen={Tape1.looplen}/></Grid>
              <Grid item xs={2} padding={1.5}><SpeedAdjust/></Grid>
            </Grid>
            <Grid container direction="row" padding={0.8}>
              <Grid item xs={10}>
                <ControlBar/>
              </Grid>
              <Grid item xs={2}>
                </Grid>
            </Grid>
            <Grid container direction="row" padding={1.5}>
                <SongMenu/>
            </Grid>
            </Box>
            
            <UploadButton/>
          </Grid>

        </div>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
