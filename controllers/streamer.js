const fs = require('fs');

module.exports = (req, res) => {

    const filepath = 'vid-output/' + req.params.videoID + '/output.mp4';

    try {
        const stat = fs.statSync(filepath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {

            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize-1;

            const chunksize = (end-start)+1;
            const file = fs.createReadStream(filepath, {start, end});
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);

        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(200, head);
            fs.createReadStream(filepath).pipe(res);
        }
    }
    catch (e) {
        return res.status(404).send();
    }


};