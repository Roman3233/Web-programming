const fs = require('fs');
const path = require('path');
const { LOG_PATH } = require('../config/env');

const logDir = path.dirname(LOG_PATH);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function log(method, url, statusCode, durationMs) {
  const time = new Date().toISOString();
  const line = JSON.stringify({
    time,
    method,
    url,
    statusCode,
    durationMs,
  }) + '\n';

  fs.appendFile(LOG_PATH, line, (err) => {
    if (err) {
      console.error('Error writing log:', err);
    }
  });
}

module.exports = { log };
