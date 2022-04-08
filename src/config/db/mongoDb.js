import mongoose from 'mongoose';
import { MONGO_DB_URL } from '../utils/secrets.js';

export function connectDb(){
    mongoose.connect(MONGO_DB_URL, {
        useNewUrlParser: true,
        serverSelectionTimeoutMS: 180000
    });
    mongoose.connection.on('connected', function () {
        console.info("Sales-api connected to mongoDb successfully");
    });
    mongoose.connection.on('Error', function () {
        console.error("Error connecting to mongoDb");
    });
}