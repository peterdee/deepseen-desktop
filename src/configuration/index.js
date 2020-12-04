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

// Application client type
export const { CLIENT_TYPE = 'desktop' } = process.env;

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
