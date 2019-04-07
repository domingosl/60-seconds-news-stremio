const renderPage    = require('../utils/render-page');
const db            = require('../utils/db');
const logger        = require('../utils/logger');

let rendering = false;

module.exports.render = () => {

    if(rendering)
        return logger.info("Cannot render Ressia news, already rendering.");

    rendering = true;

    new renderPage( process.env.SERVER_NAME + ':' + process.env.HTTP_SERVER_PORT + '/news.html#?country=ru', process.env.FRAMERATE, process.env.VIDEODURATION).then((videoID)=>{

        db.insertOrUpdate({
            id: videoID,
            name: "RUSSIA news",
            description: "Live news from Russia",
            type: "tv",
            url: process.env.SERVER_NAME + ":" + process.env.HTTP_SERVER_PORT + "/video/" + videoID,
            background: 'https://i.imgur.com/Taxs6MZ.png',
            poster: 'https://i.imgur.com/mO14ud9.png'
        });

        rendering = false;

    }).catch(e => {

        logger.error("Error while lunching FFMPEG", e);

    });

};