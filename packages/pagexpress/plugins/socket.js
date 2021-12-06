import { io } from 'socket.io-client';

export default ({ $config }, inject) => {
  const socket = io($config.websocketServerUrl, {
    reconnectionDelayMax: 10000,
    transports: ['websocket'],
  });
  inject('socket', socket);
};
