import {useEffect} from 'react';
import UploadButton from './Components/UploadButton';
import SingleDeck from './Components/SingleDeck';
import GitHubIcon from '@mui/icons-material/GitHub';

import './Styles/App.css';
import './Styles/Deck.css'
import axios from "axios";
import {Grid} from '@mui/material'
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {apiBaseUrl} from './constants'
import { useStateValue, setSongList, setExistingUser, setFlushFlag } from './state';
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


// Secure handler to open links in a new tab
export const openInNewTab = (url: string): void => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}


function App() {
  const [{Tape1, Tape2}, dispatch] = useStateValue();

  axios.defaults.withCredentials = true;

  /** 
   * Check whether user exists, 
   * retrieve default audiofiles and user's uploaded files, 
   * and check whether server is at max capacity of users and requires eviction of an old user if this user uploads files */
  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchSongList = async () => {
      try {
        const { data: {files: songListFromApi, existingUser: existingUser, flushFlag: flushFlag } } = await axios.get<{files: SongEntry[], existingUser: boolean, flushFlag: boolean}>(
          `${apiBaseUrl}/songs`
        );
        
        // If user exists, log current time as most recent login
        if (existingUser) {
            axios.put<void>(`${apiBaseUrl}/users/touch`)
        }
        // Update state
        dispatch(setExistingUser(existingUser))
        dispatch(setFlushFlag(flushFlag))
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
          <div className="typewriter"><h2>Welcome to the virtual tape loop generator. Select an audio clip to get started!</h2></div>
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
          <Box sx={{padding: 2}}> 
            <GitHubIcon sx={{color: "white", fontSize: 40}} onClick={() =>  openInNewTab('https://github.com/s-sub/TapeLoops')}></GitHubIcon>
            <Box sx={{fontSize: 14, fontFamily: "Courier", fontStyle: "italic", color: "white"}}>Credit to /u/kaleidoscopy on reddit for illustrations</Box>
          </Box>
        </div>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
