import { Document } from 'mongoose';

export interface SongEntry {
    song: string;
    id: string;
    key: string;
    cookieID: string;
}

export interface s3Params {
    bucket: string;
    key: string;
}


export interface User {
    cookieID: string,
    lastLogin: Date
}

export interface UserDoc extends Document {
    cookieID: {
        type: string,
        required: true
    },
    lastLogin: {
        type: Date,
        required: true
    }
}

export interface SongDoc extends Document {
    song: {
        type: string,
        required: true
    },
    id: {
        type: string,
        required: true
    },
    key: {
        type: string,
        required: true
    }
    cookieID: {
        type: string,
        required: true
    }
}