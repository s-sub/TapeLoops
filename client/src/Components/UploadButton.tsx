import Button from '@mui/material/Button';
import { SetStateAction, useState } from 'react';

import axios from "axios";
import {apiBaseUrl} from '../constants'
import FormData from 'form-data';

export default function UploadButton() {
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null);
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [newName, setnewName] = useState("");

    const handleUpload = async () => {
        try {
            console.log('test', isFilePicked, selectedFile)
            if (isFilePicked && selectedFile) {
                
                // const blob = new Blob([selectedFile]);
                // eslint-disable-next-line prefer-const
                let formData = new FormData();
                // const file = new File([blob],newName)
                if (selectedFile) {formData.append('file',selectedFile,newName)}
                console.log('formdata',formData, typeof(formData))

                // const contentLength = selectedFile.byteLength;
                // console.log('POST',selectedFile, contentLength)
                const { data: songBuffer } = await axios.post<FormData>(
                    `${apiBaseUrl}/upload/${newName}`,
                    formData,
                    // {
                    //     headers: {
                    //     //   'Content-Type': 'multipart/form-data',
                    //     //   'Content-Length': contentLength
                    //     },
                    // //     // responseType: 'arraybuffer'
                    // }
                  ); 
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
        if (event.target && event.target.files) {
            const newfile = event.target.files[0];
            try {
                if (newfile.type && newfile.type.slice(0,5)!=='audio') {
                    throw new Error('Wrong Type')
                }
                if (newfile.size > 10000000) {
                    throw new Error('File too large')
                }
                const blob = new Blob([newfile],{type: 'audio/mpeg'})
                setIsFilePicked(true);
                setSelectedFile(blob)
                setnewName(newfile.name.replace(/ /g,"_"));
            } catch (e: unknown) {
                console.error(e);
            }
        }
	};


    return (
        <div>
        <Button variant="contained" onClick={handleUpload}><i>Upload your own!</i></Button>
        <div>
			<input type="file" name="file" onChange={changeHandler} />
			<div>
				<button onClick={handleUpload}>Submit</button>
			</div>
		</div>
        </div>
    )

}