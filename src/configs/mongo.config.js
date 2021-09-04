import mongoose from 'mongoose';
import get from './env.config.js';

Promise = global.Promise;
const mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ignoreUndefined: true,
};

const uri = get('mongo_uri');
export async function connectDB() {
    try {
        await mongoose.connect(uri, mongoConfig);
        return console.log(`Connected DB !`);
    } catch (error) {
        throw new Error(error);
    }
}
export async function disconnectDB() {
    try {
        await mongoose.connection.close();
        return console.log(`Disconnected DB !`);
    } catch (error) {
        throw new Error(error);
    }
}

export async function clearDB() {
    try {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    } catch (error) {
        throw new Error(error.message);
    }
}