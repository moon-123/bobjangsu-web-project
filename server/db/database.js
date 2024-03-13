import { config } from '../config.js';
import mongoose from 'mongoose';

let db;

export async function connectDB() {
    try {
        await mongoose.connect(config.db.host, { dbName: 'bob' });
        console.log('Connected to the database');
        db = mongoose.connection; 
        // console.log('db');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw error;
    }
} 
