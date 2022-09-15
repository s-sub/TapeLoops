/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import express from 'express';
// import songsService from '../services/songlistService';
// import { SongEntry } from '../types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { PassThrough, pipeline } = require('stream');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { Readable } = require('stream');
// import { Blob } from "buffer";
// import Audiofile from '../models/audiofiles';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
// import { Upload } from "@aws-sdk/lib-storage";
import { UploadedFile } from 'express-fileupload';
import { PutObjectCommand } from '@aws-sdk/client-s3';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { S3Client} = require("@aws-sdk/client-s3");
// import Audiofile from '../models/audiofiles';
import FileConnection from '../models/audiofiles';
const Audiofile = FileConnection.model('Audiofile');

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
router.post('/', async (req, res) => {

    try {
      if (!req.files || !req.files.file) {
        throw new Error('No files were uploaded.');
      }
      else {
        const filebuffer = req.files.file as UploadedFile;
        // console.log(req.files.file);
        
        // const file = await Audiofile.find({$and: [{ key: req.body.name }, { cookieID: req.cookies.cookieName }]});
        // if (!file) {
        const {_id: newID} = await Audiofile.create({
            cookieID: req.cookies.cookieName,
            song: req.body.name,
            key: req.body.name
          });
        // }

        // console.log('mongooseret', returnval);

        await client.send(new PutObjectCommand({
          Bucket: bucketname,
          Key: req.body.name,
          Body: filebuffer.data,
          ContentType: 'audio/mp3'
        }));

      console.log(
      "Successfully uploaded object: " +
        bucketname +
        "/" +
        req.body.name
      );
      res.send(newID.toString());
      }
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      res.status(400).send(errorMessage);
    }



  });

export default router;