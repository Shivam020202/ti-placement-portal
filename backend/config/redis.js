const { createClient } = require("redis");
require("dotenv").config();

let redis;

async function connectRedis(host, pass, user) {
	const url = `redis://${user}:${pass}@${host}`;
	if (!redis) {
		// Check if the client has already been initialized
		redis = createClient({ url });
		redis.on("error", (err) => console.log("Redis Client Error", err));
		await redis.connect();
	}
	return redis;
}

async function getRedisClient() {
	if (!redis) {
		await connectRedis(process.env.REDIS_HOST, process.env.REDIS_PASS, process.env.REDIS_USER);
	}
	return redis;
}

module.exports = {
	connectRedis,
	getRedisClient,
};
