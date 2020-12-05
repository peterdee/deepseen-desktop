import { createApp } from 'vue';

import ioPlugin, { connection } from './plugins/websockets';
import Player from './Player.vue';
import store from './store';

createApp(Player)
  .use(store)
  .use(ioPlugin, connection)
  .mount('#app');
