const logger        = require('../utils/logger');
const db            = require('../utils/db');

module.exports = async function(args) {
    logger.info("Stream query", args);

    return Promise.resolve({ streams: [db.findById(args.id)] });
};