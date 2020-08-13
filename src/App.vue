<template>
  <div id="app">
    <input
      name="file"
      type="file"
      @change="handleSelect($event)"
    />
    <div
      v-if="currentlyPlaying"
      class="player"
    >
      <div>
        {{ currentlyPlaying }}
      </div>
      <div>
        <audio
          v-if="audioURL"
          controls
        >
          <source
            :src="audioURL"
            :type="audioType"
          />
        </audio>
      </div>
      <div
        v-for="item in playlist"
        :key="item.path"
      >
        <button
          type="button"
          @click="handleTrackSelection(item.path)"
        >
          {{ item.path }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as fs from 'fs';

const fsPromises = fs.promises;

export default {
  name: 'App',
  data() {
    return {
      playlist: [],
      audioPath: '',
      audioType: '',
      audioURL: '',
    };
  },
  computed: {
    currentlyPlaying() {
      return this.audioPath.split('/').slice(-1)[0] || 'Nothing is playing';
    },
  },
  mounted() {
    this.playlist = JSON.parse(localStorage.getItem('playlist')) || [];
  },
  methods: {
    /**
     * Handle file selection
     * @param {event} event - input event
     * @returns {Promise<*>}
     */
    async handleSelect(event) {
      event.preventDefault();
      console.log(event);

      // add file to the playlist
      this.playlist.push({
        path: event.target.files[0].path,
        type: event.target.files[0].type,
      });

      this.audioPath = event.target.files[0].path;
      this.audioType = event.target.files[0].type;
      this.audioURL = URL.createObjectURL(event.target.files[0]);
      return localStorage.setItem('playlist', JSON.stringify(this.playlist));
    },
    async handleTrackSelection(path = '') {
      console.log('path:', path);
      console.log(fsPromises);
      const file = await fsPromises.readFile(path);
      console.log('file', file);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.player {
  padding: 32px;
  color: white;
  background-color: black;
}
</style>
