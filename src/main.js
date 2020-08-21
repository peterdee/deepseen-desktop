import { createApp } from 'vue';

import Player from './Player.vue';
import store from './store';

createApp(Player).use(store).mount('#app');
