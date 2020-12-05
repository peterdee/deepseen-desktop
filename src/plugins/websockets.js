import io from 'socket.io-client';

import { WS_ORIGIN } from '../configuration';

// create connection
export const connection = io(WS_ORIGIN, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10000,
  withCredentials: true,
});

export default {
  install: (app, connection) => {
    app.config.globalProperties.$io = () => connection;
    app.provide('io', connection);
  },
};
