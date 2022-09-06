import * as React from 'react';
// import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useStateValue, setSrc, setSpeedChangeTime, setCtx,setPlay } from '../state';
import { SongEntry } from '../types';

import axios from "axios";
import {apiBaseUrl} from '../constants'

export default function SongMenu() {
    const [songID, setSongID] = React.useState('');
    const [{Tape1, audiolist}, dispatch] = useStateValue();

    const handleChange = async (event: SelectChangeEvent) => {
        setSongID(event.target.value as string);
        // const audioCtx = Tape1.audioCtx;
        try {
            const matchingEntry = audiolist.find((song) => song.id === event.target.value);
            let matchingEntryID = "-1"
            if (matchingEntry) {matchingEntryID = matchingEntry.id} else {throw new Error('ID mismatch')}
            const { data: songBuffer } = await axios.get<ArrayBuffer>(
                `${apiBaseUrl}/songs/${matchingEntryID}`,
                {responseType: 'arraybuffer'}
              );

            //Below can be refactored/condensed with track re-initialize mechanics of speed adjust
            const originalPlayState = Tape1.play;
            if (originalPlayState) {Tape1.audioCtx.suspend()}
            Tape1.audioCtx.close()
            const audioCtx = new AudioContext()
            await dispatch(setCtx(audioCtx))
            await dispatch(setPlay(false))
            const source = audioCtx.createBufferSource();

            const audioBuffer = await audioCtx.decodeAudioData(songBuffer);
            source.buffer = audioBuffer
            source.connect(audioCtx.destination);
            source.loop = true;
            const cliplength = audioBuffer.duration;
            source.loopStart = 0;
            source.loopEnd = cliplength;
            source.playbackRate.value = Tape1.speed;
            source.start();
            audioCtx.suspend();
            dispatch(setSrc(source));

            dispatch(setSpeedChangeTime(audioCtx.currentTime));        
            if (originalPlayState) {
                audioCtx.resume()
                dispatch(setPlay(true))
            }

        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
              console.error(e?.response?.data || "Unrecognized axios error");
            } else {
              console.error("Unknown error", e);
            }
          }
    };



    return(
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Audio</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={songID}
                label="Audio"
                onChange={handleChange}
            >
            {audiolist.map((song: SongEntry) =>
                <MenuItem key={song.id} value={song.id}>{song.song}</MenuItem>
            )};
            </Select>
        </FormControl>
    )
}