import * as React from 'react';
// import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useStateValue, setSrc, setCtx, restartContext } from '../state';
import { SongEntry } from '../types';

import axios from "axios";
import {apiBaseUrl} from '../constants'

export default function SongMenu() {
    const [songID, setSongID] = React.useState('');
    const [{Tape1, audiolist}, dispatch] = useStateValue();

    const handleChange = async (event: SelectChangeEvent) => {
        setSongID(event.target.value as string);
        try {
            const matchingEntry = audiolist.find((song) => song.id === event.target.value);
            let matchingEntryID = "-1"
            if (matchingEntry) {matchingEntryID = matchingEntry.id} else {throw new Error('ID mismatch')}
            const { data: songBuffer } = await axios.get<ArrayBuffer>(
                `${apiBaseUrl}/songs/${matchingEntryID}`,
                {responseType: 'arraybuffer'}
              );

            const audioBuffer = await Tape1.audioCtx.decodeAudioData(songBuffer);
            const audioParams = {audioBuffer: audioBuffer}
            const {newaudioCtx: newaudioCtx, newaudioSrc: newaudioSrc} = restartContext(Tape1, audioParams);
            dispatch(setCtx(newaudioCtx))
            dispatch(setSrc(newaudioSrc))

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