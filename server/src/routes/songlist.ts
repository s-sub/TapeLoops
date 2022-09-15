/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
// import songsService from '../services/songlistService';
import { SongEntry } from '../types';
// import type {Readable} from 'stream';
// import Audiofile from '../models/audiofiles';
import UserConnection from '../models/userlist';
import FileConnection from '../models/audiofiles';
const Audiofile = FileConnection.model('Audiofile');
// console.log(UserConnection);
const Userfile = UserConnection.model('Userfile');

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();


const accesskey: string = process.env.S3_ACCESS_KEY_ID as string;
const secret: string = process.env.SECRET_ACCESS_KEY as string;
const bucketname: string = process.env.BUCKET_NAME as string;
const maxUsers : string = process.env.MAX_USERS as string;


const client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: accesskey,
    secretAccessKey: secret
  }
});


const router = express.Router();


// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', async (req, res) => {
  let userExists = false;
  const numUsers = await Userfile.countDocuments();
  const userID = await Userfile.exists({ cookieID: req.cookies.cookieName });
  // if (userID) {userIDStr = userID._id.toHexString();}
  if (userID) {userExists = true;} else {userExists = false;}

  const userFlushNeededOnUpload = (!userExists && numUsers>=(+maxUsers));

  void Audiofile.find({$or: [{ cookieID: -1 }, { cookieID: req.cookies.cookieName }]}).then(file => {
      res.json({files: file, existingUser: userExists, flushFlag: userFlushNeededOnUpload});
    });

});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/:id', async (req,res) => {
  try {
    const foundsong: SongEntry | undefined | null = await Audiofile.findById(req.params.id);
    let foundkey;
    if (foundsong) {
      foundkey = foundsong.key;
    } else {throw "Song does not exist";}

    const command = new GetObjectCommand({
      Bucket: bucketname,
      Key: foundkey
    });

    const item = await client.send(command);
    item.Body.pipe(res);
    // const stream = item.Body as Readable;
    // console.log(stream);


  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }

});

export default router;