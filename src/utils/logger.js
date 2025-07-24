const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const log = (niveau, message, donnees = null) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        niveau,
        message,
        donnees,
    };

    const logString = JSON.stringify(logEntry) + '\n';

    console.log(`[${timestamp}] ${niveau.toUpperCase()}: ${message}`);

    if (process.env.NODE_ENV === 'production') {
        const fileName = `${niveau}-${new Date().toISOString().split('T')[0]}.log`;
        const filePath = path.join(logsDir, fileName);

        fs.appendFileSync(filePath, logString);
    }
};

const logger = {
    info: (message, donnees) => log('info', message, donnees),
    warn: (message, donnees) => log('warn', message, donnees),
    error: (message, donnees) => log('error', message, donnees),
    debug: (message, donnees) => log('debug', message, donnees),
};

module.exports = logger;
