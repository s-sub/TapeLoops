import {useState, useEffect} from 'react';
import CassetteLoops from './Components/CassetteLoops'
import SpeedAdjust from './Components/SpeedAdjust'
import SongMenu from './Components/SongSelector';
import RangeSlider from './Components/PlayBar';
import ControlBar from './Components/ControlBar';
import UploadButton from './Components/UploadButton';
import SingleDeck from './Components/SingleDeck';

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



function App() {
  const [{Tape1, Tape2}, dispatch] = useStateValue();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchSongList = async () => {
      try {
        const { data: {files: songListFromApi, existingUser: existingUser, flushFlag: flushFlag } } = await axios.get<{files: SongEntry[], existingUser: boolean, flushFlag: boolean}>(
          `${apiBaseUrl}/songs`
        );
        
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
          <Grid sx={{ flexGrow: 1 }} container direction="row" justifyContent="center" spacing={2}>
            <Grid item xs={6}>
              <SingleDeck tape={Tape1}/>    
            </Grid>    
            <Grid item xs={6}>
              <SingleDeck tape={Tape2}/>    
            </Grid> 
          </Grid>  
          <Box sx={{padding: 2}}>
          <UploadButton/>
          </Box>
        </div>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
