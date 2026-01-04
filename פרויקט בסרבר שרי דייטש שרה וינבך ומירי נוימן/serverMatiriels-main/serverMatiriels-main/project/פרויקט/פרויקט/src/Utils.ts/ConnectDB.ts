import mongoose from 'mongoose';

export class myDB {
    private static instance: myDB;
    private readonly DB_NAME = 'Sarah_Miri_Sari_Assignments_System'; 
    private readonly URI = `mongodb://127.0.0.1:27017/${this.DB_NAME}`;

    private constructor() {} 

    static getInstance(): myDB {
        if (!myDB.instance) {
            myDB.instance = new myDB();
        }
        return myDB.instance;
    }

    async connectToDb(): Promise<void> {
        try {
            await mongoose.connect(this.URI);
            console.log(`Connected to MongoDB: ${this.DB_NAME}`);
        } catch (err) {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        }
    }
}