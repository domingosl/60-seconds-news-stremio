const streams = require('../config').streams;
const logger = require('../utils/logger');
const renderPage = require('../utils/render-page');
const db = require('../utils/db');
const events = require('../utils/events');

class StreamCollection {

    constructor(streams) {

        this.streams = streams;

        streams.forEach((stream, i) => {
            stream.status = {
                rendering: false,
                lastDataSha1: null,
                renderingProgress: 0
            };
        })

    }

    render(i) {

    }

    find() {
        return this.streams;
    }


}

const streamCollection = new StreamCollection(streams);

//events.on('renderProgress', (data) => { console.log(data) });

module.exports.renderAll = () => {

    streamCollection.find().forEach((stream, i) => {

        if(!stream.active)
            return;

        logger.info("Processing stream", {name: stream.name});

        if (stream.status.rendering)
            return logger.info("Cannot render " + stream.name + ", already rendering.");

        stream.status.rendering = true;
        stream.status.renderingProgress = 0;

        new renderPage(
            stream.countryCode,
            'http://127.0.0.1:' + process.env.HTTP_SERVER_PORT + '/news.html#?country=' + stream.countryCode,
            process.env.FRAMERATE,
            process.env.VIDEODURATION,
            stream.status.lastDataHash)

            .then((r) => {

                db.insertOrUpdate({
                    id: r.videoId,
                    name: stream.name,
                    description: stream.description,
                    type: "tv",
                    url: process.env.SERVER_NAME + ":" + process.env.HTTP_SERVER_PORT + "/video/" + r.videoId,
                    background: stream.background,
                    poster: stream.poster
                });

                stream.status.rendering = false;
                stream.status.lastDataHash = r.dataHash;

            }).catch(e => {
            stream.status.rendering = false;
                logger.error(e, {tagLabel: stream.name});
            });

    })

};


