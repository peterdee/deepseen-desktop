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

// Playlist file extension
export const PLAYLIST_EXTENSION = 'dpsn';

// Websockets server origin
export const { WS_ORIGIN = 'ws://localhost:9500' } = process.env;
