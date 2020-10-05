const messages = require('../config/messages.json');

const getMessages = (path) => {
    return messages[path] || null;
};

module.exports = { getMessages };