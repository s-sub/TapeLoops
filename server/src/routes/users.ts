import express from 'express';

import {UserfileGen} from '../models/userlist';
import UserConnection from '../models/userlist';
const Userfile = UserfileGen(UserConnection);
import {AudiofileGen} from '../models/audiofiles';
import FileConnection from '../models/audiofiles';
const Audiofile = AudiofileGen(FileConnection);


// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();


const accesskey: string = process.env.S3_ACCESS_KEY_ID as string;
const secret: string = process.env.SECRET_ACCESS_KEY as string;
const bucketname: string = process.env.BUCKET_NAME as string;


// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: accesskey,
      secretAccessKey: secret
    }
});

const router = express.Router();

// Update most recently logged in time for current user
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/touch', async (req, res) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const cookie = req.cookies.cookieName as string;
        const currTime = new Date();
        const doc = await Userfile.findOneAndUpdate({cookieID: cookie},{lastLogin: currTime});
        if (!doc) {throw new Error('User Cookie was Not found');}
        res.send('Visit Logged');
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
          errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

// Create new user, evicting the least recently logged in user if server is at max user capacity
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', async (req, res) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const cookie = req.cookies.cookieName as string;
        const currTime = new Date();
          //testing
        await Userfile.create({
          cookieID: cookie,
          lastLogin: currTime
        });

        if (req.body.flushFlag) {
            //Delete least recently logged in user
            const LRU = await Userfile.findOne().sort({lastLogin: 1});
            if (!LRU) {throw new Error();}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            await Userfile.deleteOne({_id: LRU._id});
            console.log(LRU, 'least recently loggedin');

            //Delete all audiofiles associated with LRU's cookie ID
            const arrayFound = await Audiofile.find({cookieID: (+LRU.cookieID)}, "key");
            await Audiofile.deleteMany({cookieID: (+LRU.cookieID)});
            arrayFound.map(async (doc) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                await client.send(new DeleteObjectCommand({
                    Bucket: bucketname,
                    Key: doc.key
                }));
            });

        }
        res.send('User Entry Created');
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
          errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

export default router;