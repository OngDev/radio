const mongoose = require('mongoose');
const { get } = require('./env.config');

mongoose.Promise = global.Promise;
const mongoConfig = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	ignoreUndefined: true,
};

const uri = get('mongo_uri');
async function connectDB() {
	try {
		await mongoose.connect(uri, mongoConfig);
		return console.log(`Connected DB !`);
	} catch (error) {
		throw new Error(error);
	}
}
async function disconnectDB() {
	try {
		await mongoose.connection.close();
		return console.log(`Disconnected DB !`);
	} catch (error) {
		throw new Error(error);
	}
}

async function clearDB() {
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

module.exports = { mongoConfig, connectDB, disconnectDB, clearDB };
