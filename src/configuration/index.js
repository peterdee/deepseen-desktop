// Allowed audio extensions
export const ALLOWED_EXTENSIONS = [
  'aac',
  'flac',
  'mp3',
  'ogg',
  'wav',
];

// Backend origin
export const { BACKEND_ORIGIN = 'http://localhost:1337' } = process.env;

// All client types
export const CLIENTS = {
  desktop: 'desktop',
  mobile: 'mobile',
  web: 'web',
};

// Application client type
export const { CLIENT_TYPE = CLIENTS.desktop } = process.env;

// Websockets events
export const EVENTS = {
  CLIENT_DISCONNECTED: 'CLIENT_DISCONNECTED',
  NEW_CLIENT_CONNECTED: 'NEW_CLIENT_CONNECTED',
  PLAY_NEXT: 'PLAY_NEXT',
  PLAY_PAUSE: 'PLAY_PAUSE',
  PLAY_PREVIOUS: 'PLAY_PREVIOUS',
  ROOM_STATUS: 'ROOM_STATUS',
  STOP_PLAYBACK: 'STOP_PLAYBACK',
  UPDATE_CURRENT_TRACK: 'UPDATE_CURRENT_TRACK',
  UPDATE_MUTE: 'UPDATE_MUTE',
  UPDATE_PLAYBACK_STATE: 'UPDATE_PLAYBACK_STATE',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
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
export const { WS_ORIGIN = 'ws://localhost:9500' } = process.env;
