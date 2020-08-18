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
      :playlist="playlist"
      @play-next="playNext()"
      @play-previous="playPrevious()"
    />
    <PlaylistControls
      :playlist="playlist"
      @clear-playlist="clearPlaylist()"
      @open-playlist="openPlaylistFromFS()"
      @save-playlist="savePlaylistToFS()"
    />
    <div v-if="playbackError">
      <PlaybackError
        :message="playbackError"
      />
    </div>
  </div>
</template>

<script>
import { remote as electron } from 'electron';
import { nextTick } from 'vue';
import { promises as fs } from 'fs';
import { lookup } from 'mime-types';

import { deletePlaylist, getPlaylist, savePlaylist } from './utilities/playlist';

import PlaybackControls from './components/PlaybackControls';
import PlaybackError from './components/PlaybackError';
import Playlist from './components/Playlist';
import PlaylistControls from './components/PlaylistControls';

// default application options
const defaultOptions = {
  loopPlaylist: true,
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
      temp: [],
    };
  },
  computed: {
    currentlyPlaying() {
      return this.audioPath.split('/').slice(-1)[0] || 'Nothing is playing';
    },
  },
  async mounted() {
    // load application options
    this.options = JSON.parse(localStorage.getItem('options')) || defaultOptions;

    // load stored playlist
    this.playlist = getPlaylist() || [];

    // load last played track
    const lastPlayedID = localStorage.getItem('last') || null;
    if (lastPlayedID) {
      try {
        const [track = {}] = this.playlist.filter(
          (item) => Number(item.id) === Number(lastPlayedID),
        );
        if (track && track.path) {
          const { path = '' } = track;
          const buffer = await fs.readFile(path);

          this.audioID = lastPlayedID;
          this.audioPath = path;
          this.audioType = lookup(path.split('.').slice(-1)[0]);
          this.audioURL = URL.createObjectURL(new Blob([buffer], { type: this.audioType }));
        }
      } catch (error) {
        if (error.code && error.code === 'ENOENT') {
          return this.playbackError = 'File not found!';
        }
        return this.playbackError = 'Error!';
      }
    }
  },
  methods: {
    /**
     * Handle files drag & drop
     * @param {object} event - drop event
     * @returns {void}
     */
    handleFileDrop(event) {
      return Array.prototype.forEach.call(event.dataTransfer.files, (file) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);

        return audio.oncanplay = () => {
          const track = {
            duration: audio.duration,
            id: Date.now(),
            path: file.path,
            size: file.size,
            type: file.type,
          };

          // check files if playlist is not empty: do not create duplicates
          if (this.playlist.length > 0) {
            const [existingTrack = null] = this.playlist.filter(({ path = '' }) => path === track.path);
            if (existingTrack) {
              return false;
            }

            // add file to the playlist  
            this.playlist = [...this.playlist, track];
            return savePlaylist(this.playlist);
          }

          // add file to the playlist  
          this.playlist = [...this.playlist, track];
          return savePlaylist(this.playlist);
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

        localStorage.setItem('last', id);

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
      localStorage.removeItem('last');
      deletePlaylist();
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
    async openPlaylistFromFS() {
      try {
        const {
          canceled = false,
          filePaths = [],
        } = await electron.dialog.showOpenDialog(null, ['openFile']);
        if (canceled) {
          return false;
        }

        // open the file and convert it
        const buffer = await fs.readFile(filePaths[0]);
        const string = await buffer.toString('utf8');

        // update the playlist
        this.playlist = JSON.parse(string);
        savePlaylist(this.playlist);

        // play the first file if playlist is not empty
        if (this.playlist.length > 0) {
          return this.handleTrackSelection(this.playlist[0].id);
        }
      } catch (error) {
        if (error.code && error.code === 'ENOENT') {
          return this.playbackError = 'File not found!';
        }
        return this.playbackError = 'Error!';
      }
    },
    /**
     * Play the next track
     * @returns {*}
     */
    playNext() {
      if (this.playlist.length === 0) {
        return false;
      }

      const playlistIDs = this.playlist.map(({ id = null }) => id);
      const nextTrackID = playlistIDs[playlistIDs.indexOf(this.audioID) + 1];
      if (nextTrackID) {
        return this.handleTrackSelection(nextTrackID);
      }

      // play the first track if playlist loop is enabled
      if (this.options.loopPlaylist) {
        return this.handleTrackSelection(this.playlist[0].id);
      }
    },
    /**
     * Play the previous track
     * @returns {*}
     */
    playPrevious() {
      if (this.playlist.length === 0) {
        return false;
      }

      const playlistIDs = this.playlist.map(({ id = null }) => id);
      const previousTrackID = playlistIDs[playlistIDs.indexOf(this.audioID) - 1];
      if (previousTrackID) {
        return this.handleTrackSelection(previousTrackID);
      }

      // play the last track if playlist loop is enabled
      if (this.options.loopPlaylist) {
        return this.handleTrackSelection(this.playlist[this.playlist.length - 1].id);
      }
    },
    /**
     * Save current playlist
     * @returns {Promise<*>}
     */
    async savePlaylistToFS() {
      try {
        const { canceled = false, filePath = '' } = await electron.dialog.showSaveDialog(
          null,
          {
            title: 'Save playlist',
            buttonLabel: 'Save',
            message: 'Please provide the playlist name',
          },
        );
        if (canceled) {
          return false;
        }
        
        return fs.writeFile(`${filePath}.spl`, JSON.stringify(this.playlist));
      } catch (error) {
        return this.playbackError = 'Error saving playlist!';
      }
    },
  },
};
</script>

<style>
body, html {
  background-color: black;
  margin: 0;
  padding: 0;
}
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
