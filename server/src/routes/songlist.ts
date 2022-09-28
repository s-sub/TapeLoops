/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
import { SongEntry } from '../types';
import UserConnection from '../models/userlist';
import FileConnection from '../models/audiofiles';
const Audiofile = FileConnection.model('Audiofile');
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


/** Retrieve the list of default and previously uploaded files from the MongoDB database 
 *  and check whether the server is at capacity for users and will require eviction if new files are uploaded */ 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', async (req, res) => {
  let userExists = false;
  const numUsers = await Userfile.countDocuments();
  const userID = await Userfile.exists({ cookieID: req.cookies.cookieName });
  if (userID) {userExists = true;} else {userExists = false;}

  // Flush needed if user is a new user and server is already at maxcapacity for users
  const userFlushNeededOnUpload = (!userExists && numUsers>=(+maxUsers));

  // Retreive default (ID: -1) files AND files tagged with the user's cookie
  void Audiofile.find({$or: [{ cookieID: "-1" }, { cookieID: req.cookies.cookieName }]}).then(file => {
      res.json({files: file, existingUser: userExists, flushFlag: userFlushNeededOnUpload});
    });

});

// When a specific song is requested, find its ID in the database, request it from S3, and send response to client
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
    

  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }

});

export default router;