import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

import contextMenu from './modules/context-menu';
import playlist from './modules/playlist';
import playlistActions from './modules/playlist-actions';
import settings from './modules/settings';
import track from './modules/track';

const storage = new VuexPersistence({ storage: window.localStorage });

export default createStore({
  modules: {
    contextMenu,
    playlist,
    playlistActions,
    settings,
    track,
  },
  plugins: [storage.plugin],
});
