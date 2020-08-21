import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

import playlist from './modules/playlist';
import settings from './modules/settings';
import track from './modules/track';

const storage = new VuexPersistence({ storage: window.localStorage });

export default createStore({
  modules: {
    playlist,
    settings,
    track,
  },
  plugins: [storage.plugin],
});
