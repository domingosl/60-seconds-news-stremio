const renderPage    = require('../utils/render-page');
const db            = require('../utils/db');
const logger        = require('../utils/logger');

let rendering = false;

module.exports.render = () => {

    if(rendering)
        return logger.info("Cannot render US news, already rendering.");

    rendering = true;

    new renderPage(
        process.env.SERVER_NAME + ':' + process.env.HTTP_SERVER_PORT + '/news.html#?country=us',
        process.env.FRAMERATE,
        process.env.VIDEODURATION)

        .then((videoID)=>{

            db.insertOrUpdate({
                id: videoID,
                name: "US news",
                description: "Live news from US",
                type: "tv",
                url: process.env.SERVER_NAME + ":" + process.env.HTTP_SERVER_PORT + "/video/" + videoID,
                background: 'https://i.imgur.com/Vhnep7Z.png',
                poster: 'https://i.imgur.com/kPgcp43.png'
            });

            rendering = false;

        }).catch(e => {

            logger.error("Error while lunching FFMPEG %o", e);
    
        });
};