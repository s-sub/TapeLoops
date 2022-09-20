import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Input from '@mui/material/Input';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { styled, createTheme} from '@mui/system';
import { green } from '@mui/material/colors';
import { useState, useEffect } from 'react';
import { useStateValue, setSongList, setExistingUser, setFlushFlag } from '../state';
import { SongEntry } from '../types';
import {maxFilesPerUser, maxFileSize} from '../constants';

import axios from "axios";
import {apiBaseUrl} from '../constants'
import FormData from 'form-data';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex', 
    alignItems: 'center'
};

// const customTheme = createTheme({
//     typography: {
//       fontFamily: 'Courier'}
// });
  
const CustomButton = styled(Button)(() => ({
    backgroundColor: "#FF926B",
    color: "#000000",
    fontSize: 18,
    fontFamily: 'Courier',
    "&:disabled": {
        backgroundColor: '#C2C2C2'
    }
}));

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

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setSuccess(false);
        setOpen(false);
    };

    const handleUpload = async () => {
        try {
            console.log('test', isFilePicked, selectedFile)
            if (isFilePicked && selectedFile) {
                setLoading(true);
                // eslint-disable-next-line prefer-const
                let formData = new FormData();
                if (selectedFile) {formData.append('file',selectedFile,newName)}
                formData.append('name',newName)
                console.log('formdata',formData, typeof(formData))

                if (!existingUser) {
                    const { data: newID } = await axios.post(
                        `${apiBaseUrl}/users/`,
                        {flushFlag: flushFlag}
                      );
                    dispatch(setFlushFlag(false));
                    dispatch(setExistingUser(true));
                }

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
                // if (document && document.getElementById('upload')) {(document.getElementById('upload') as HTMLInputElement).value = '';}
                // setSelectedFile(null);
                setLoading(false);
                setSuccess(true);

                // const { data: songListFromApi } = await axios.get<SongEntry[]>(
                //     `${apiBaseUrl}/songs`
                // );
                // dispatch(setSongList(audiolist));
            }
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
              console.error(e?.response?.data || "Unrecognized axios error");
            } else {
              console.error("Unknown error", e);
            }
          }
    }

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSuccess(false)
        if (event.target && event.target.files) {
            const newfile = event.target.files[0];
            try {
                if (newfile.type && newfile.type.slice(0,5)!=='audio') {
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

    useEffect(() => {
        const newSongListLen = (audiolist.length)>maxFilesPerUser;
        setUploadsAtCapacity(newSongListLen)
    },[audiolist])

    return (
        <div>
        <CustomButton variant="contained" 
            // sx={{backgroundColor: "#FF926B", color: "#000000", fontSize: 18}} 
            disabled={uploadsAtCapacity} onClick={handleOpen}>
            {uploadsAtCapacity ? <span><i>Uploads at Capacity</i></span> : <span>Upload your own!</span>}
        </CustomButton>
        <Modal
            open={open && !uploadsAtCapacity}
            onClose={handleClose}
        >
            <Box sx={style}>
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
                {invalidFiletype && <Box sx={{fontSize: 12, fontFamily: "Courier", fontStyle: "italic", color: "red"}}>File must be an audio file</Box>}
                {invalidFilesize && <Box sx={{fontSize: 12, fontFamily: "Courier", fontStyle: "italic", color: "red"}}>File must be smaller than 4MB</Box>}
            </Box>
        </Modal>
        </div>
    )

}