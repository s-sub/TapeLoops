import * as React from 'react';
// import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useStateValue, setSrc } from '../state';
import { SongEntry } from '../types';

import axios from "axios";
import {apiBaseUrl} from '../constants'

export default function SongMenu() {
    const [songID, setSongID] = React.useState('');
    const [{Tape1, audiolist}, dispatch] = useStateValue();

    const handleChange = async (event: SelectChangeEvent) => {
        setSongID(event.target.value as string);
        const audioCtx = Tape1.audioCtx;
        try {
            const matchingEntry = audiolist.find((song) => song.id === event.target.value);
            let matchingEntryID = "-1"
            if (matchingEntry) {matchingEntryID = matchingEntry.id} else {throw new Error('ID mismatch')}
            const { data: songBuffer } = await axios.get<ArrayBuffer>(
                `${apiBaseUrl}/songs/${matchingEntryID}`,
                {responseType: 'arraybuffer'}
              );
            const source = audioCtx.createBufferSource();
            //Verify that the below actually results in the old source being deleted from memoery
            Tape1.audioSrc.disconnect();
            const audioBuffer = await audioCtx.decodeAudioData(songBuffer);
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.loop = true;
            const cliplength = audioBuffer.duration;
            source.loopStart = 0;
            source.loopEnd = cliplength;
            console.log('loopend',source.loopEnd,'cliplength',cliplength)
            source.playbackRate.value = Tape1.speed;
            source.start();
            dispatch(setSrc(source));
            audioCtx.suspend();

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