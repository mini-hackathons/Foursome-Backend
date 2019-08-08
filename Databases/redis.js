const redis = require('redis');

module.exports = {
    init: () => {
        this.client = redis.createClient();

        this.client.on('connect', () => console.log('Redis connected!') );

        this.client.on('error', (err) => console.log(`Redis error: ${err}`) );
    },

    getClient: () => this.client
}
