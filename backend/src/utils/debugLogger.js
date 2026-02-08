import fs from 'fs';
import path from 'path';

const logFile = path.resolve('PDF_DEBUG.log');

export const debugLog = (message, data = null) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message} ${data ? JSON.stringify(data, null, 2) : ''}\n`;

    // Console log
    console.log(message, data || '');

    // File log
    try {
        fs.appendFileSync(logFile, logMessage);
    } catch (err) {
        console.error("Failed to write to log file:", err);
    }
};
