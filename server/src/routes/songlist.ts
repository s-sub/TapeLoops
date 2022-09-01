/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
import songsService from '../services/songlistService';
import { SongEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

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


router.get('/', (_req, res) => {
  res.send(songsService.getEntries());
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/:id', async (req,res) => {
  try {
    const foundsong: SongEntry | undefined = songsService.getSong(req.params.id);
    let foundkey;
    if (foundsong) {
      foundkey = foundsong.key;
    } else {throw "Song does not exist";}

    const command = new GetObjectCommand({
      Bucket: bucketname,
      Key: foundkey
    });

    console.log('command', command);

    const item = await client.send(command);
    item.Body.pipe(res);

  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }

});

export default router;