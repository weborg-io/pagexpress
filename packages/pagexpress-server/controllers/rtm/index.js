const rtmPageDetailsController = require('./rtm-page-details-controller');

/**
 * @param {WebSocket} socket
 */
module.exports = socket => {
  rtmPageDetailsController(socket);
};
