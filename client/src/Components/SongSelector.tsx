import * as React from 'react';
// import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { useStateValue, setSrc, setCtx, restartContext, setSongList, setDeleteID, setPlay } from '../state';
import {useState,useEffect} from 'react';
import { SongEntry, Tape } from '../types';

import axios from "axios";
import {apiBaseUrl} from '../constants'

export default function SongMenu(props: {tape: Tape}) {
    const tape = props.tape;
    const [songID, setSongID] = useState('');
    const [loading, setLoading] = useState(true);
    const [{audiolist, deleteID}, dispatch] = useStateValue();

    // If a file that is currently playing on either deck is deleted, reset the audio context to a blank buffer
    useEffect(() => {
        if (songID===deleteID) {
            const audioParams = {audioBuffer: tape.audioCtx.createBuffer(1, 22050, 22050)}
            const {newaudioCtx: newaudioCtx, newaudioSrc: newaudioSrc} = restartContext(tape, audioParams);
            dispatch(setPlay(false, tape.name))
            dispatch(setCtx(newaudioCtx, tape.name))
            dispatch(setSrc(newaudioSrc, tape.name))
            setSongID("");
        }
    },[deleteID])

    // If audiolist has yet to be retrieved, mark server state as loading
    useEffect(() => {
        if (audiolist.length===0) {
            setLoading(true)
        }
        else {
            setLoading(false)
        }
    },[audiolist])

    // When audio file is selected from dropdown, load it into the tape
    const handleChange = async (event: SelectChangeEvent) => {
        setSongID(event.target.value as string);
        if (event.target.value==="") {return}
        try {
            // Find the file's ID and dispatch it to the backend
            const matchingEntry = audiolist.find((song) => song.id === event.target.value);
            let matchingEntryID = "-1"
            if (matchingEntry) {matchingEntryID = matchingEntry.id} else {throw new Error('ID mismatch')}
            const { data: songBuffer } = await axios.get<ArrayBuffer>(
                `${apiBaseUrl}/songs/${matchingEntryID}`,
                {responseType: 'arraybuffer'}
              );

            // Construct a buffer within the tape's audio context using the server response and restart the tape with a new context
            const audioBuffer = await tape.audioCtx.decodeAudioData(songBuffer);
            const audioParams = {audioBuffer: audioBuffer}
            const {newaudioCtx: newaudioCtx, newaudioSrc: newaudioSrc} = restartContext(tape, audioParams);
            dispatch(setCtx(newaudioCtx, tape.name))
            dispatch(setSrc(newaudioSrc, tape.name))
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
              console.error(e?.response?.data || "Unrecognized axios error");
            } else {
              console.error("Unknown error", e);
            }
          }
    };

    // Send delete request to server
    const handleDelete = async (id: string) => {
        try {
            await dispatch(setDeleteID(id))
            await axios.delete<string>(
                `${apiBaseUrl}/delete/${id}`
            );
            // Remove file from frontend audio list
            const newAudioList = audiolist.filter((song: SongEntry) => song.id !== id);
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
            <InputLabel id="demo-simple-select-label" sx={{align: "center"}}>
                {loading ? <div>{"Loading - Server starting up . . .     "}
                    <CircularProgress size={18} thickness={9} sx={{
                        color: '#FF926B',
                        }}
                    />
                </div> : "Select Audio Clip"}
            </InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={songID}
                label={"Select Audio Clip"}
                onChange={handleChange}
                sx={loading ? {background: "#C2C2C2", align: "center"} : {align: "center"}}
                disabled={loading}
            >
            {loading ? <DeleteIcon/> : audiolist.map((song: SongEntry) =>
                {if (song.cookieID!=="-1" && song.id) {
                    return(
                        <MenuItem key={song.id} value={song.id}>{song.song} 
                            <ListItemSecondaryAction>
                                <IconButton onClick={()=>handleDelete(song.id)} sx={{}}>
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