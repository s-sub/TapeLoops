import express from 'express';
import cors from "cors";
import songsRouter from './routes/songlist';
import uploadRouter from './routes/upload';
import deleteRouter from './routes/delete';
import usersRouter from './routes/users';
// import Audiofile from './models/audiofiles';
import fileUpload from 'express-fileupload';
import cookieParser from "cookie-parser";
import cookieget from "./routes/cookie";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();
const app = express();

app.use(cors({
  origin: true,
  // preflightContinue: true,
  credentials: true,
}));
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cookieParser());
app.use(cookieget);

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
// eslint-disable-next-line @typescript-eslint/no-unsafe-call


// const PORT = 3000;

// app.use('/', cookieRouter);

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/users',usersRouter);
app.use('/api/songs',songsRouter);
app.use('/api/upload',uploadRouter);
app.use('/api/delete', deleteRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});