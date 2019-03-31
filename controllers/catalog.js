const logger        = require('../utils/logger');
const db            = require('../utils/db');

module.exports = async function(args) {

    logger.info("Catalog query", args);

    return Promise.resolve({ metas: db.find() })
};