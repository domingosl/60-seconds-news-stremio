const streams = require('../config').streams;
const logger = require('../utils/logger');
const renderPage = require('../utils/render-page');
const db = require('../utils/db');

class StreamCollection {

    constructor(streams) {

        this.streams = streams;

        streams.forEach((stream, i) => {
            stream.status = {
                rendering: false,
                lastDataSha1: null
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

module.exports.renderAll = () => {

    streamCollection.find().forEach((stream, i) => {

        if(!stream.active)
            return;

        logger.info("Processing stream", {name: stream.name});

        if (stream.status.rendering)
            return logger.info("Cannot render " + stream.name + ", already rendering.");

        stream.status.rendering = true;

        new renderPage(
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


