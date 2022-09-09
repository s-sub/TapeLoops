import mongoose from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config();

const url = process.env.MONGODB_URI as string;

console.log('connecting to', url);

mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB');
})
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
});

const audiofileSchema = new mongoose.Schema({
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

export default mongoose.model('Audiofile', audiofileSchema);