// Scoped (zone-based) logging implementation using Winston logger

// By tagging each log message with a "zone", we can filter them at runtime
// and decide what to write into a user.log 

import winston from 'winston';
import minimatch from 'minimatch';

import options from '../core/options.js'

const config = {
    loggingZone: options.loggingZone,
    logAllZones: options.logAllZones,
}


// Messy initial implementation:

const filterZone = winston.format((info, opts) => {

   
    // If the zone isn't valid, skip:
    if (typeof info.zone !== 'string') return false;
    if (info.zone === '') return false;

    let logZones = [];

    if (config.logAllZones === true){
        logZones.push("*");
    }

    if (Array.isArray(config.loggingZone)){
        logZones = [...logZones, ...config.loggingZone];
    }

    for (const z of logZones){
        if (minimatch(info.zone, z)) return info;
        if (minimatch(info.zone, z+".*")) return info;
    }


    //return info;
});

const winstonLogger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: './built/user.log',
            level: 'warn',
            format: winston.format.combine(
                filterZone(),
                winston.format.json()
            )
        }),
        new winston.transports.File({
            filename: './built/debug.log',
            level: 'debug',
            format: winston.format.json()
        }),
    ]

})

/*
const ignorePrivate = format((info, opts) => {
    if (info.private) { return false; }
    return info;
});*/

export default function log(logObj){

    if (typeof logObj.message !== 'string') return;

    const defaults = {
        private: false,
        zone: 'nowhere',
        level: 'info',
        message: 'undefined',
        data: null
    }

    const obj = {...defaults, ...logObj};

    winstonLogger.log(obj)

}


log({
    level: 'error',
    zone: 'logger',
    message: 'Test',
    private: false,
    data: null
})