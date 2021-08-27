const fs = require('fs');
const joi = require('joi');
const { parse } = require('dotenv');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(__dirname, '../', '.env');
dotenv.config();

function checkEnv(envConfig) {
	const envSchema = joi
		.object({
			NODE_ENV: joi.string().valid('dev', 'prod').default('dev'),
			PORT: joi.number().default(8080),
			HOST: joi
				.string()
				.uri({ scheme: [/http?/] })
				.default('http://localhost'),
			MONGO_URI: joi
				.string()
				.regex(/^mongodb/)
				.default('mongodb://localhost:27017/Project1'),
		})
		.unknown(true);

	const { error, value } = envSchema.validate(envConfig);
	if (error) throw new Error(`ENV validation error: ${error.message}`);
	return value;
}

function get(key) {
	let config = parse(fs.readFileSync(envPath));
	config = checkEnv(config);
	return config[key.toUpperCase()];
}

module.exports = { get };
