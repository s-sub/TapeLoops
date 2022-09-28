import CircularProgress from '@mui/material/CircularProgress';
import Input from '@mui/material/Input';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { green } from '@mui/material/colors';
import { useState, useEffect } from 'react';
import { useStateValue, setSongList, setExistingUser, setFlushFlag } from '../state';
import { SongEntry } from '../types';
import {maxFilesPerUser, maxFileSize} from '../constants';
import { CustomButton, ModalBoxStyle } from '../Styles/CustomStyles'

import axios from "axios";
import {apiBaseUrl} from '../constants'
import FormData from 'form-data';


export default function UploadButton() {
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null);
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [newName, setnewName] = useState("");
    const [{audiolist, existingUser, flushFlag}, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const currUploadState = (audiolist.length)>maxFilesPerUser;
    const [uploadsAtCapacity, setUploadsAtCapacity] = useState(currUploadState);
    const [open, setOpen] = useState(false);
    const [invalidFiletype, setInvalidFiletype] = useState(false);
    const [invalidFilesize, setInvalidFilesize] = useState(false);

    const buttonSx = {
        ...(success && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
    };

    // Whenever the audio list changes, check whether file uploads are at capacity 
    useEffect(() => {
        const newSongListLen = (audiolist.length)>maxFilesPerUser;
        setUploadsAtCapacity(newSongListLen)
    },[audiolist])


    // Define modal open/close methods
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setSuccess(false);
        setIsFilePicked(false);
        setOpen(false);
    };

    // When files are selected, check file validity and store file as blob if valid
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSuccess(false)
        if (event.target && event.target.files) {
            const newfile = event.target.files[0];
            try {
                if (newfile.type && (newfile.type === 'audio/midi' || newfile.type.slice(0,5)!=='audio')) {
                    setInvalidFiletype(true);
                }
                else if (newfile.size > maxFileSize) {
                    setInvalidFiletype(false);
                    setInvalidFilesize(true);
                }
                else {
                    setInvalidFilesize(false);
                    setInvalidFiletype(false);
                    const blob = new Blob([newfile],{type: 'audio/mpeg'})
                    setIsFilePicked(true);
                    setSelectedFile(blob)
                    setnewName(newfile.name);
                }
            } catch (e: unknown) {
                console.error(e);
            }
        }
	};

    // When valid file selected, send to backend for file upload
    const handleUpload = async () => {
        try {
            if (isFilePicked && selectedFile) {
                setLoading(true);

                // Store blob of selected file in formData for file upload
                // eslint-disable-next-line prefer-const
                let formData = new FormData();
                if (selectedFile) {formData.append('file',selectedFile,newName)}
                formData.append('name',newName)
                console.log('formdata',formData, typeof(formData))

                /** If user is new, log user in backend 
                 * and send flag indicating whether old user needs to be evicted 
                 * to ensure user storage does not exceed capacity */ 
                if (!existingUser) {
                    const { data: newID } = await axios.post(
                        `${apiBaseUrl}/users/`,
                        {flushFlag: flushFlag}
                      );
                    dispatch(setFlushFlag(false));
                    dispatch(setExistingUser(true));
                }
                
                // Send file to backend for upload to S3
                const { data: newID } = await axios.post<FormData>(
                    `${apiBaseUrl}/upload/`,
                    formData
                  );
                

                const newAudio : SongEntry = {
                    song: newName,
                    id: newID.toString(),
                    key: newName
                }

                const newAudioList = audiolist.concat([newAudio]);
                dispatch(setSongList(newAudioList))

                setLoading(false);
                setSuccess(true);
                setTimeout(handleClose, 1000)

            }
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
              console.error(e?.response?.data || "Unrecognized axios error");
            } else {
              console.error("Unknown error", e);
            }
          }
    }

    return (
        <div>
        <CustomButton variant="contained" 
            disabled={uploadsAtCapacity} onClick={handleOpen}>
            {uploadsAtCapacity ? <span><i>Uploads at Capacity</i></span> : <span>Upload your own!</span>}
        </CustomButton>
        <Modal
            open={open && !uploadsAtCapacity}
            onClose={handleClose}
        >
            <Box sx={ModalBoxStyle}>
                <Input type="file" name="file" id="upload" onChange={changeHandler} />
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Fab
                        onClick={handleUpload}
                        color="primary"
                        sx={buttonSx}
                        disabled={!isFilePicked || invalidFiletype || invalidFilesize}
                        >
                        {success ? <CheckIcon /> : <SaveIcon />}
                    </Fab>
                    {loading && <CircularProgress size={68} sx={{
                        color: 'green',
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        zIndex: 1,
                        }}
                    />}
                </Box>
                {invalidFiletype && <Box sx={{fontSize: 12, fontFamily: "Courier", fontStyle: "italic", color: "red"}}>File must be a valid audio file</Box>}
                {invalidFilesize && <Box sx={{fontSize: 12, fontFamily: "Courier", fontStyle: "italic", color: "red"}}>File must be smaller than 4MB</Box>}
            </Box>
        </Modal>
        </div>
    )

}