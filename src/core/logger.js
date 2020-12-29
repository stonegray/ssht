// Scoped (zone-based) logging implementation using Winston logger

// By tagging each log message with a "zone", we can filter them at runtime
// and decide what to write into a user.log 

/* 
ssht logging levels are loosly based on syslog:
https://tools.ietf.org/html/rfc5424#section-6.2.1

  alert: 1, 
  error: 3, 
  warning: 4, 
  notice: 5,
  info: 6, 
  debug: 7
  trace: 8

ssht's levels differ from RFC5424 in that levels 0, 2, and 5 are unused, and an
additional level, trace: 8, is added.

the 'alert'/1 level is used to indicate a fatal error  



*/

import winston from 'winston';
import minimatch from 'minimatch';

import options from '../core/options.js'

const config = {
    loggingZone: options.loggingZone,
    logAllZones: options.logAllZones,
}


// Messy initial implementation:

const filterMetadata = winston.format((info, opts) => {

    let message = info.message;
    
    if (typeof info.data == 'object'){
        try {
            message += '\n' + JSON.stringify(info.data, null, 2)

        } catch (e){
            message += `\n[Failed to stringify data: ${e.message}]`
        }
    }

    return {
        level: info.level,
        message
    };
})

const filterZone = winston.format((info, opts) => {

   
    // If the zone isn't valid, skip:
    if (typeof info.zone !== 'string') return false;
    if (info.zone === '') return false;

    let logZones = [];

    if (config.logAllZones === true){
        logZones.push("*");
    }

    // TODO this is kinda messy, fix later:
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
            filename: './built/user.log.json',
            level: 'warn',
            format: winston.format.combine(
                filterZone(),
                winston.format.json()
            )
        }),
        new winston.transports.File({
            filename: './built/debug.log.json',
            level: 'debug',
            format: winston.format.json()
        }),
        new winston.transports.File({
            filename: './built/debug.log',
            level: 'debug',
            format: winston.format.combine(
                //winston.format.colorize(),
                filterMetadata(),
                winston.format.timestamp(),
                winston.format.align(),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
              )
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
        message: 'Empty message',
        data: null
    }

    const obj = {...defaults, ...logObj};

    winstonLogger.log(obj)

}
