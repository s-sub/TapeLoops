import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import songsRouter from './routes/songlist';
import uploadRouter from './routes/upload';
import deleteRouter from './routes/delete';
import usersRouter from './routes/users';
import fileUpload from 'express-fileupload';
import cookieParser from "cookie-parser";
import cookieget from "./routes/cookie";

dotenv.config();
const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cookieParser());
app.use(cookieget);

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.status(200).send('pong');
});

app.use('/api/users',usersRouter);
app.use('/api/songs',songsRouter);
app.use('/api/upload',uploadRouter);
app.use('/api/delete', deleteRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});