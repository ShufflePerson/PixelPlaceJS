import winston from 'winston'



function registerTransports() {
    winston.add(new winston.transports.Console({ 
        debugStdout: true,
    }))
}

export default registerTransports;