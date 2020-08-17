<template>
  <div id="app">
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
        :current="audioID"
        :tracks="playlist"
        @add-file="handleFileDrop($event)"
        @select-track="handleTrackSelection($event)"
      />
    </div>
    <PlaybackControls
      @play-next="playNext()"
      @play-previous="playPrevious()"
    />
    <PlaylistControls
      @clear-playlist="clearPlaylist()"
      @open-playlist="openPlaylist()"
      @save-playlist="savePlaylist()"
    />
    <div v-if="playbackError">
      <PlaybackError
        :message="playbackError"
      />
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue';
import { promises as fs } from 'fs';
import { lookup } from 'mime-types';

import PlaybackControls from './components/PlaybackControls';
import PlaybackError from './components/PlaybackError';
import Playlist from './components/Playlist';
import PlaylistControls from './components/PlaylistControls';

// default application options
const defaultOptions = {
  loopPlaylist: false,
};

export default {
  name: 'App',
  components: {
    PlaybackControls,
    PlaybackError,
    Playlist,
    PlaylistControls,
  },
  data() {
    return {
      audioID: null,
      audioPath: '',
      audioType: '',
      audioURL: '',
      options: null,
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
    // load application options
    this.options = JSON.parse(localStorage.getItem('options')) || defaultOptions;

    // load stored playlist
    this.playlist = JSON.parse(localStorage.getItem('playlist')) || [];
  },
  methods: {
    /**
     * Handle file selection
     * @param {event} event - input event
     * @returns {void}
     */
    handleFileDrop(event) {
      this.playbackError = '';

      const file = event.dataTransfer.files[0];
      const id = Date.now();

      return nextTick(() => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);

        // update the playlist
        audio.oncanplay = () => {
          this.playlist.push({
            duration: audio.duration,
            id,
            path: file.path,
            type: file.type,
          });
          return localStorage.setItem('playlist', JSON.stringify(this.playlist));
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

        // open a file
        const [{ path = '' }] = this.playlist.filter((item) => item.id === id);
        const buffer = await fs.readFile(path);

        // prepare the file and load it
        this.audioID = id;
        this.audioPath = path;
        this.audioType = lookup(path.split('.').slice(-1)[0]);
        this.audioURL = URL.createObjectURL(new Blob([buffer], { type: this.audioType }));

        // play the track
        return nextTick(() => {
          const { player } = this.$refs;
          player.oncanplay = () => {
            // play the next track when current one ends
            player.onended = () => this.playNext();

            // play the current track  
            return player.play();
          };
        });
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
      this.audioID = '';
      this.audioPath = '';
      this.audioType = '';
      this.audioURL = '';
      this.playbackError = '';
      return this.playlist = [];
    },
    /**
     * Open an existing playlist
     * @returns {Promise<*>}
     */
    openPlaylist() {
      return console.log('open playlist');
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
     * @returns {*}
     */
    playPrevious() {
      const playlistIDs = this.playlist.map(({ id = null }) => id);
      const previousTrackID = playlistIDs[playlistIDs.indexOf(this.audioID) - 1];
      if (previousTrackID) {
        return this.handleTrackSelection(previousTrackID);
      }
    },
    /**
     * Save current playlist
     * @returns {Promise<*>}
     */
    savePlaylist() {
      return console.log('save playlist', this.playlist);
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
}
.player {
  background-color: black;
  color: white;
  font-size: 24px;
  padding: 32px;
}
</style>
