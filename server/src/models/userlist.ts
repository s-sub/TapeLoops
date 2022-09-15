import mongoose from 'mongoose';
import {UserDoc} from '../types';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();

const url = process.env.MONGODB_URI_USERS as string;

console.log('connecting to', url);

// mongoose.connect(url)
//     .then(() => {
//         console.log('Connected to MongoDB - Users');
// })
// .catch((error) => {
//     console.log('error connecting to MongoDB - Users:', error.message);
// });

const conn2 = mongoose.createConnection(url);
if (conn2) {
    console.log('Connected to MongoDB - Users');
} else {
    console.log('error connecting to MongoDB - Users:');
}

const userSchema = new mongoose.Schema<UserDoc>({
    cookieID: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        required: true
    }
});

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
});

conn2.model<UserDoc>('Userfile', userSchema);

export function UserfileGen(mongooseConnection: mongoose.Connection) { return mongooseConnection.model<UserDoc>('Userfile', userSchema); }

// export default mongoose.model('Userfile', userSchema);
export default conn2;