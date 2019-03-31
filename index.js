require('dotenv').config();

const { addonBuilder, serveHTTP }   = require('stremio-addon-sdk');
const express                       = require('express');
const logger                        = require('./utils/logger');
const cors                          = require('cors');
const config                        = require('./config');
const catalogController             = require('./controllers/catalog');
const metaController                = require('./controllers/meta');
const streamController              = require('./controllers/stream');
const streams                       = require('./streams');
const cron                          = require('node-cron');

const videoStream = require('./controllers/streamer');

const app = express();
app.use(cors());
app.use(express.static('_'));
app.use(require('morgan')("combined", { "stream": logger.stream }));

app.get('/video/:videoID', videoStream);

const addon = new addonBuilder(config);

addon.defineCatalogHandler(catalogController);
addon.defineMetaHandler(metaController);
addon.defineStreamHandler(streamController);

app.listen(process.env.HTTP_SERVER_PORT, async function () {

    logger.info("HTTP server running");
    logger.info("Generating streams video sources");

    streams.ruNews.render();
    streams.usNews.render();
    streams.deNews.render();

    cron.schedule('*/20 * * * *', () => {
        logger.info("Refreshing news feed");
        streams.ruNews.render();
        streams.usNews.render();
        streams.deNews.render();
    });

    serveHTTP(addon.getInterface(), { port: process.env.STREMIO_PORT });

});