const logger        = require('../utils/logger');
const db            = require('../utils/db');

module.exports = async function(args) {
    logger.info("Meta query", args);

    return Promise.resolve({ meta: db.findById(args.id) });
};