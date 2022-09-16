import * as React from 'react';
// import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { useStateValue, setSrc, setCtx, restartContext, setSongList } from '../state';
import { SongEntry } from '../types';

import axios from "axios";
import {apiBaseUrl} from '../constants'
import Grid from '@mui/material/Grid';

export default function SongMenu() {
    const [songID, setSongID] = React.useState('');
    const [{Tape1, audiolist}, dispatch] = useStateValue();

    const handleChange = async (event: SelectChangeEvent) => {
        setSongID(event.target.value as string);
        if (event.target.value==="") {return}
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

    const handleDelete = async (id: string) => {
        try {
            await axios.delete<string>(
                `${apiBaseUrl}/delete/${id}`
            );
            setSongID("")
            const newAudioList = audiolist.filter((song: SongEntry) => song.id !== id);
            console.log('newaud', newAudioList)
            dispatch(setSongList(newAudioList))

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
                {if (song.cookieID!==-1 && song.id) {
                    return(
                        <MenuItem key={song.id} value={song.id}>{song.song} 
                            <ListItemSecondaryAction>
                                {/* <Button >Delete</Button> */}
                                <IconButton onClick={()=>handleDelete(song.id)} edge="end">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>      
                        </MenuItem>
                    )
                    } else {
                        return(
                            <MenuItem key={song.id} value={song.id}>{song.song}</MenuItem>
                        )
                    }
                }
            )};
            </Select>
        </FormControl>
    )
}