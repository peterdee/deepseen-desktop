import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

import about from './modules/about';
import account from './modules/account';
import contextMenu from './modules/context-menu';
import playbackError from './modules/playback-error';
import playbackQueue from './modules/playback-queue';
import playlist from './modules/playlist';
import playlistActions from './modules/playlist-actions';
import settings from './modules/settings';
import track from './modules/track';

const storage = new VuexPersistence({ storage: window.localStorage });

export default createStore({
  modules: {
    about,
    account,
    contextMenu,
    playbackError,
    playbackQueue,
    playlist,
    playlistActions,
    settings,
    track,
  },
  plugins: [storage.plugin],
});
