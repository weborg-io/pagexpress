import { io } from 'socket.io-client';

export default ({ $config }, inject) => {
  const socket = io($config.serverAppUrl, {
    reconnectionDelayMax: 10000,
  });
  inject('socket', socket);
};
