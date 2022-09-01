import {useState, useEffect} from 'react';
import CassetteLoops from './Components/CassetteLoops'
import SpeedAdjust from './Components/SpeedAdjust'
import './App.css';
import {Grid} from '@mui/material'
import {audioBaseUrl} from './constants'
import { useStateValue, setPlay, setSrc } from './state';

function App() {
  const [play, setPlay2] = useState(false)
  const [{Tape1}, dispatch] = useStateValue();
  const audioCtx = Tape1.audioCtx;

  useEffect(()=>{
    const source = audioCtx.createBufferSource();
    const request = new XMLHttpRequest();
    request.open("GET", audioBaseUrl, true);
    request.responseType = "arraybuffer"; 

    request.onload = () => {
      const audioData = request.response;

      audioCtx.decodeAudioData(audioData, (buffer: AudioBuffer) => {
          source.buffer = buffer;
          source.connect(audioCtx.destination);
          source.loop = true;
          source.playbackRate.value = Tape1.speed;
        },);
    }
    request.send()
    // handleNewSource(source)
    source.start()
    dispatch(setSrc(source))
    // console.log('dispatched:', Src1)
  }, [])

  // useEffect(() => {
  //   console.log('stateval Tape1', Tape1)
  // })


  //All the below/above should be replaced when you set up the backend API endpoints for Audio retrieval 
  const togglePlay = async () => {
    await setPlay2(!play)
    dispatch(setPlay(play))
    play ? audioCtx.resume() : audioCtx.suspend();
    const temp = play ? "running" : "paused"
    document.documentElement.style.setProperty('--play', temp);
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <div className="App">
        <Grid sx={{ flexGrow: 1 }} container spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={11}><CassetteLoops/></Grid>
            <Grid item xs={1}><SpeedAdjust/></Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid>
          
        </Grid> */}
        <button onClick={togglePlay}> Play </button>
      </div>
    </Grid>
  );
}

export default App;