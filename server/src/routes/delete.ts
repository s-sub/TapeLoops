/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
import { SongEntry } from '../types';
import FileConnection from '../models/audiofiles';
const Audiofile = FileConnection.model('Audiofile');

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();


const accesskey: string = process.env.S3_ACCESS_KEY_ID as string;
const secret: string = process.env.SECRET_ACCESS_KEY as string;
const bucketname: string = process.env.BUCKET_NAME as string;


const client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: accesskey,
    secretAccessKey: secret
  }
});

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/:id', async (req, res) => {

    try {
        
        const foundsong: SongEntry | undefined | null = await Audiofile.findById(req.params.id);
        let foundkey;
        let foundCookie;
        
        if (foundsong) {
            foundkey = foundsong.key;
            foundCookie = foundsong.cookieID;
          } else {throw new Error("Song does not exist");}

        console.log('reqcookie', typeof(req.cookies.cookieName));
        console.log('foundcookie', typeof(foundCookie));
        if (req.cookies.cookieName!==foundCookie) {throw new Error("Cookie mismatch error");}

        console.log('key', foundkey);
        await client.send(new DeleteObjectCommand({
            Bucket: bucketname,
            Key: foundkey
          }));
        
        await Audiofile.deleteOne({_id: req.params.id});
        
        console.log(`${foundsong.song} successfully deleted from S3 and DB`);
        res.send('Successful Deletion');

    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
          errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }

});

export default router;