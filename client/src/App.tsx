import {useState, useEffect} from 'react';
import CassetteLoops from './Components/CassetteLoops'
import SpeedAdjust from './Components/SpeedAdjust'
import SongMenu from './Components/SongSelector';
import RangeSlider from './Components/PlayBar';
import ControlBar from './Components/ControlBar';
import UploadButton from './Components/UploadButton';
import './App.css';
import axios from "axios";
import {Grid} from '@mui/material'
import {apiBaseUrl} from './constants'
import { useStateValue, setPlay, setSongList } from './state';
import {SongEntry} from './types'



//To-do: 1) Fix smooth restart when song selection changes. 2) Add loop-adjustment capabilities
function App() {
  // const [play, setPlay2] = useState(false)
  const [{Tape1}, dispatch] = useStateValue();
  // const audioCtx = Tape1.audioCtx;

  // useEffect(()=>{
  //   const source = audioCtx.createBufferSource();
  //   const request = new XMLHttpRequest();
  //   request.open("GET", audioBaseUrl, true);
  //   request.responseType = "arraybuffer"; 

  //   request.onload = () => {
  //     const audioData = request.response;

  //     audioCtx.decodeAudioData(audioData, (buffer: AudioBuffer) => {
  //         source.buffer = buffer;
  //         source.connect(audioCtx.destination);
  //         source.loop = true;
  //         source.playbackRate.value = Tape1.speed;
  //       },);
  //   }
  //   request.send()
  //   // handleNewSource(source)
  //   source.start()
  //   dispatch(setSrc(source))
  //   // console.log('dispatched:', Src1)
  // }, [])

  axios.defaults.withCredentials = true;

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchSongList = async () => {
      try {
        const { data: songListFromApi } = await axios.get<SongEntry[]>(
          `${apiBaseUrl}/songs`
        );
        // console.log('songlistfromapi',songListFromApi);
        dispatch(setSongList(songListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchSongList();
  }, [dispatch])

  // useEffect(() => {
  //   console.log(Tape1.audioSrc.)
  // })

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
          <RangeSlider/>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={11}><CassetteLoops looplen={Tape1.looplen}/></Grid>
            <Grid item xs={1}><SpeedAdjust/></Grid>
            </Grid>
          </Grid>
        </Grid>
        <ControlBar/>
        <SongMenu/>
        <UploadButton/>
      </div>
    </Grid>
  );
}

export default App;
