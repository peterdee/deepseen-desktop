<template>
  <div id="app">
    <input
      name="file"
      type="file"
      @change="handleFileOpening($event)"
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
          preload="auto"
          ref="player"
          :src="audioURL"
          :type="audioType"
          controls
        />
      </div>
      <Playlist
        :tracks="playlist"
        @select-track="handleTrackSelection($event)"
      />
    </div>
    <PlaybackControls
      @play-next="playNext()"
      @play-previous="playPrevious()"
    />
    <div v-if="playbackError">
      <PlaybackError :message="playbackError" />
    </div>
  </div>
</template>

<script>
import { promises as fs } from 'fs';
import { lookup } from 'mime-types';
import { nextTick } from 'vue';

import PlaybackControls from './components/PlaybackControls';
import PlaybackError from './components/PlaybackError';
import Playlist from './components/Playlist';

export default {
  name: 'App',
  components: {
    PlaybackControls,
    PlaybackError,
    Playlist,
  },
  data() {
    return {
      audioID: null,
      audioPath: '',
      audioType: '',
      audioURL: '',
      playbackError: '',
      playlist: [],
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
     * @returns {void}
     */
    handleFileOpening(event) {
      event.preventDefault();
      this.playbackError = '';

      // add file to the playlist
      const id = Date.now();

      this.audioID = id;
      this.audioPath = event.target.files[0].path;
      this.audioType = event.target.files[0].type;
      this.audioURL = URL.createObjectURL(event.target.files[0]);
      return nextTick(() => {
        const { player } = this.$refs;
        return player.onloadedmetadata = () => {
          this.playlist.push({
            duration: player.duration,
            id,
            path: event.target.files[0].path,
            type: event.target.files[0].type,
          });
          localStorage.setItem('playlist', JSON.stringify(this.playlist));
          return player.play();
        };
      });
    },
    /**
     * Handle track selection
     * @param {number|string} id - track ID
     * @returns {Promise<*>}
     */
    async handleTrackSelection(id = '') {
      try {
        this.playbackError = '';
        this.audioPath = '';

        // open a file
        const [{ path = '' }] = this.playlist.filter((item) => item.id === id);
        const buffer = await fs.readFile(path);

        // prepare the file and load it
        this.audioID = id;
        this.audioPath = path;
        this.audioType = lookup(path.split('.').slice(-1)[0]);
        this.audioURL = URL.createObjectURL(new Blob([buffer], { type: this.audioType }));

        // auto-play on the next refresh tick
        return nextTick(() => this.$refs.player.play());
      } catch (error) {
        if (error.code && error.code === 'ENOENT') {
          return this.playbackError = 'File not found!';
        }
        return this.playbackError = 'Error!';
      }
    },
    /**
     * Clear playlist
     * @returns {void}
     */
    clearPlaylist() {
      localStorage.removeItem('playlist');
      this.audioPath = '';
      this.audioType = '';
      this.audioURL = '';
      this.playbackError = '';
      return this.playlist = [];
    },
    /**
     * Play the next track
     * @returns {*}
     */
    playNext() {
      const playlistIDs = this.playlist.map(({ id = null }) => id);
      const nextTrackID = playlistIDs[playlistIDs.indexOf(this.audioID) + 1];
      if (nextTrackID) {
        return this.handleTrackSelection(nextTrackID);
      }
    },
    /**
     * Play the previous track
     * @returns {Promise<*>}
     */
    async playPrevious() {
      const playlistIDs = this.playlist.map(({ id = null }) => id);
      const previousTrackID = playlistIDs[playlistIDs.indexOf(this.audioID) - 1];
      if (previousTrackID) {
        return this.handleTrackSelection(previousTrackID);
      }
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
  background-color: black;
  color: white;
  font-size: 24px;
  padding: 32px;
}
</style>
