// Allowed audio extensions
export const ALLOWED_EXTENSIONS = [
  'aac',
  'flac',
  'mp3',
  'ogg',
  'wav',
];

// Backend origin
export const {
  VUE_APP_BACKEND_ORIGIN: BACKEND_ORIGIN = 'http://localhost:1337',
} = process.env;

// All client types
export const CLIENTS = {
  desktop: 'desktop',
  mobile: 'mobile',
  web: 'web',
};

// Application client type
export const {
  VUE_APP_CLIENT_TYPE: CLIENT_TYPE = CLIENTS.desktop,
} = process.env;

// Websockets events
export const EVENTS = {
  CLEAR_QUEUE: 'CLEAR_QUEUE',
  CLIENT_DISCONNECTED: 'CLIENT_DISCONNECTED',
  CLIENT_TYPE_IS_ALREADY_ONLINE: 'CLIENT_TYPE_IS_ALREADY_ONLINE',
  CONNECT_ERROR: 'connect_error',
  DESKTOP_INIT: 'DESKTOP_INIT',
  DISCONNECT: 'DISCONNECT',
  NEW_CLIENT_CONNECTED: 'NEW_CLIENT_CONNECTED',
  PLAY_NEXT: 'PLAY_NEXT',
  PLAY_PAUSE: 'PLAY_PAUSE',
  PLAY_PREVIOUS: 'PLAY_PREVIOUS',
  ROOM_STATUS: 'ROOM_STATUS',
  STOP_PLAYBACK: 'STOP_PLAYBACK',
  UPDATE_CURRENT_TRACK: 'UPDATE_CURRENT_TRACK',
  UPDATE_LOOP: 'UPDATE_LOOP',
  UPDATE_MUTE: 'UPDATE_MUTE',
  UPDATE_PLAYBACK_STATE: 'UPDATE_PLAYBACK_STATE',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  UPDATE_QUEUE: 'UPDATE_QUEUE',
  UPDATE_SHUFFLE: 'UPDATE_SHUFFLE',
  UPDATE_VOLUME: 'UPDATE_VOLUME',
};

// Playlist file extension
export const PLAYLIST_EXTENSION = 'dpsn';

// Response messages
export const RESPONSE_MESSAGES = {
  accessDenied: 'ACCESS_DENIED',
  internalServerError: 'INTERNAL_SERVER_ERROR',
};

// Status codes
export const STATUS_CODES = {
  badRequest: 400,
  created: 201,
  internalServerError: 500,
  ok: 200,
  unauthorized: 401,
};

// Websockets server origin
export const {
  VUE_APP_WS_ORIGIN: WS_ORIGIN = 'ws://localhost:9500',
} = process.env;
