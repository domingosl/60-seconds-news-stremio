const appRoot                               = require('app-root-path').path;
const { createLogger, format, transports }  = require('winston');
const { combine, timestamp, printf }        = format;
const process                               = require('process');
const chalk                                 = require('chalk');

const extractRelevant = (info) => {

    let obj = {};

    for (let key in info) {
        if (info.hasOwnProperty(key)) {
            if(key !== 'level' && key !== 'message' && key !== 'timestamp' && key !== 'tagLabel')
                obj[key] = info[key];
        }
    }

    if(Object.keys(obj).length === 0)
        return "";

    return JSON.stringify(obj);
};

const cFormat = printf(info => {

    let level = (info.level === 'debug') ?
            chalk.yellow((info.level).toUpperCase()) :
        info.level === 'info' ?
            chalk.green((info.level).toUpperCase()) :
        info.level === 'error' ?
            chalk.red((info.level).toUpperCase()) :
            chalk.magenta((info.level).toUpperCase());

    if(info.tagLabel)
        level += " - " + info.tagLabel;

    return info.timestamp + " " + chalk.blue(process.title) + `(${process.pid}) [` + level + `] : ${info.message}` + " " + extractRelevant(info);
});

const fFormat = printf(info => {

    const space = info.level.length > 4 ? " " : "";

    if(info.tagLabel)
        info.level += ": " + info.tagLabel;
    
    return process.title + `(${process.pid}) [` + info.level + `] ${space}${info.timestamp}: ${info.message}` + " " + extractRelevant(info);
});

const options = {

    fileInfo: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: combine( timestamp(), format.splat(), format.simple(), fFormat )
    },

    fileHttp: {
        level: 'info',
        filename: `${appRoot}/logs/http.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    },

    fileError: {
        level: 'error',
        filename: `${appRoot}/logs/error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: combine( timestamp(), format.splat(), format.simple(), fFormat )
    },

    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        format: combine( timestamp(), format.splat(), format.simple(), cFormat )
    }
};

let logger = createLogger({
    transports: [
        new transports.File(options.fileInfo),
        new transports.File(options.fileError),
        new transports.Console(options.console)
    ],
    exitOnError: false
});

let expresLogger = createLogger({
    transports: [
        new transports.File(options.fileHttp)
    ]
});

logger.stream = {
    write: function(message, encoding) {
        expresLogger.info(message);
    },
};

module.exports = logger;