import express from 'express';
import cors from "cors";
import songsRouter from './routes/songlist';
import uploadRouter from './routes/upload';
// import Audiofile from './models/audiofiles';
import fileUpload from 'express-fileupload';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();
const app = express();

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());

// const PORT = 3000;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/songs',songsRouter);
app.use('/api/upload',uploadRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});