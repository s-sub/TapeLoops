// import { connect } from 'http2';
import mongoose from 'mongoose';
import {SongDoc} from '../types';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();

const url = process.env.MONGODB_URI_FILES as string;

console.log('connecting to', url);

// mongoose.connect(url)
//     .then(() => {
//         console.log('Connected to MongoDB - Files');
// })
// .catch((error) => {
//     console.log('error connecting to MongoDB - Files:', error.message);
// });


const conn = mongoose.createConnection(url);
if (conn) {
    console.log('Connected to MongoDB - Files');
} else {
    console.log('error connecting to MongoDB - Files:');
}

const audiofileSchema = new mongoose.Schema<SongDoc>({
    cookieID: {
        type: String,
        required: true
    },
    song: {
        type: String,
        minLength: 3,
        required: true
    },
    key: {
        type: String,
        minLength: 3,
        required: true
    }
});

audiofileSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
});

conn.model<SongDoc>('Audiofile', audiofileSchema);

export function AudiofileGen(mongooseConnection: mongoose.Connection) { return mongooseConnection.model<SongDoc>('Audiofile', audiofileSchema); }
// export default mongoose.model('Audiofile', audiofileSchema);
export default conn;