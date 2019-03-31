const phantom   = require('phantom');
const path      = require('path');
const crypto    = require('crypto');
const rimraf    = require('rimraf');
const fs        = require('fs');
const {exec}    = require('child_process');
const logger    = require('./logger');

class RenderPage {

    constructor(url, frameRate = 15, videoLength = 3000) {

        this.tagLabel = url;
        const _self = this;

        return new Promise(async (resolve, reject) => {

            const folderName = crypto.createHash('sha1').update(url + frameRate + videoLength).digest('hex');

            const dest = path.resolve('./vid-output', folderName);
            if (fs.existsSync(dest)) {
                rimraf.sync(dest);
            }

            const [instance, page] = await _self.loadPage(url, frameRate);

            const response = await _self.genVideo(page, instance, frameRate, videoLength, folderName);

            logger.info('New video generated', {id: response, tagLabel: _self.tagLabel});

            resolve(response);

        });
    }

    async genVideo(page, instance, frameRate, videoLength, folderName) {

        const _self = this;

        return new Promise(async (resolve, reject) => {


            const maxFrames = Math.round(frameRate * videoLength / 1000);

            let frame = 0;

            let nextNotificationAt = 5;

            async function processDelay() {


                const frameDone = await _self.renderFrame(frame, page, folderName);

                if (frameDone >= maxFrames - 1) {
                    logger.info('All frames stored', {tagLabel: _self.tagLabel});
                    instance.exit();

                    const bashCommand = process.env.FFMPEG_LOCATION + ' -i news-music.mp3 -framerate ' + frameRate + ' -i vid-output/' + folderName + '/frame%05d.png -pix_fmt yuv420p -shortest -y vid-output/' + folderName + '/output.mp4';

                    logger.info(bashCommand, {tagLabel: _self.tagLabel});

                    exec(bashCommand, (err, stdout, stderr) => {
                        if (err) {
                            logger.error("Error running ffmpeg", {error: err, tagLabel: _self.tagLabel});
                            reject();
                        }

                        exec('rm vid-output/' + folderName + '/*.png', () => {
                            resolve(folderName);
                        });

                    });


                }


                const progress = Math.round(100*frameDone/maxFrames);
                if(progress >= nextNotificationAt) {
                    logger.info(progress + "%", { tagLabel: _self.tagLabel });
                    nextNotificationAt += nextNotificationAt;
                }

                frame++;

                if (frame < maxFrames)
                    processDelay();


            }

            processDelay();


        });


    };

    async renderFrame(frame, page, folderName) {

        return new Promise(async (resolve, reject) => {

            await page.render("./vid-output/" + folderName + "/frame" + String(frame).padStart(5, '0') + ".png", {format: "png"});
            await page.evaluateJavaScript("function() { window.timelines.animate(); }");
            return resolve(frame);
        });


    };

    async loadPage(url, frameRate) {

        const _self = this;

        return new Promise(async (resolve, reject) => {

            const instance = await phantom.create();
            const page = await instance.createPage();
            await page.property('viewportSize', {width: 1024, height: 576});

            page.on('onConsoleMessage', function (msg) {
                logger.info("Page console: " + msg, {tagLabel: _self.tagLabel});
            });

            page.on('onCallback', async function (data) {
                if (data === 'ok') {
                    logger.info('Page ready for recording', {tagLabel: _self.tagLabel});
                    await page.evaluateJavaScript("function() { window.timelines.setFramerate(" + frameRate + "); }");
                    resolve([instance, page]);
                }
            });

            const status = await page.open(url);
            logger.info('Page opened', {tagLabel: _self.tagLabel});


            if (status !== 'success') {
                logger.error('Cannot load page', {tagLabel: _self.tagLabel});
                return reject('Cant load page');
            }


        });


    };

}


module.exports = RenderPage;