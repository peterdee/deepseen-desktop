<template>
  <div id="app">
    <div v-if="contextMenu">
      <ContextMenu
        :playlist="playlist"
        :trackId="contextMenuTrackId"
        @close="closeContextMenu()"
        @delete-track="deleteTrack($event)"
      />
    </div>
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
        @show-context-menu="showContextMenu($event)"
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

import checkPath from './utilities/check-path';
import { deletePlaylist, getPlaylist, savePlaylist } from './utilities/playlist';
import generateId from './utilities/generate-id';
import getFileExtension from './utilities/get-file-extension';
import parseDir from './utilities/parse-dir';

import ContextMenu from './components/ContextMenu';
import PlaybackControls from './components/PlaybackControls';
import PlaybackError from './components/PlaybackError';
import Playlist from './components/Playlist';
import PlaylistControls from './components/PlaylistControls';

// allowed audio extensions
const allowedExtensions = ['aac', 'mp3', 'wav'];

// default application options
const defaultOptions = {
  loopPlaylist: true,
};

export default {
  name: 'App',
  components: {
    ContextMenu,
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
      contextMenu: false,
      contextMenuTrackId: '',
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
     * Handle drag & drop
     * @param {object} event - drop event
     * @returns {void}
     */
    handleFileDrop(event) {
      return Array.prototype.forEach.call(event.dataTransfer.files, async (file) => {
        // check path to determine if it's a directory or a file
        try {
          const { isDirectory = false } = await checkPath(file.path);
          if (isDirectory) {
            const tracks = await parseDir(file.path, allowedExtensions);

            for await (const item of tracks) {
              const buffer = await fs.readFile(item.path);
              let audio = new Audio();
              audio.src = URL.createObjectURL(new Blob([buffer], { type: item.type }));

              audio.oncanplay = () => {
                const track = {
                  ...item,
                  duration: audio.duration,
                };

                // prevent memory issues
                URL.revokeObjectURL(audio.src);
                audio = null;

                // check files if playlist is not empty: do not create duplicates
                if (this.playlist.length > 0) {
                  const [existingTrack = null] = this.playlist.filter(
                    ({ path = '' }) => path === track.path,
                  );
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
            }
          }
        } catch (error) {
          return this.playbackError = 'Error loading files!';
        }

        // leave only the allowed extensions
        if (!allowedExtensions.includes(getFileExtension(file.name))) {
          return false;
        }

        let audio = new Audio();
        audio.src = URL.createObjectURL(file);

        return audio.oncanplay = () => {
          const track = {
            duration: audio.duration,
            id: generateId(),
            name: file.name,
            path: file.path,
            size: file.size,
            type: file.type,
          };

          // prevent memory issues
          URL.revokeObjectURL(audio.src);
          audio = null;

          // check files if playlist is not empty: do not create duplicates
          if (this.playlist.length > 0) {
            const [existingTrack = null] = this.playlist.filter(
              ({ path = '' }) => path === track.path,
            );
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
        this.audioType = lookup(getFileExtension(path));
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

      const playlistIDs = this.playlist.map(({ id = '' }) => id);
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

      const playlistIDs = this.playlist.map(({ id = '' }) => id);
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
    /**
     * Close context menu for the track
     * @returns {void}
     */
    closeContextMenu() {
      this.contextMenu = false;
      return this.contextMenuTrackId = '';
    },
    /**
     * Open context menu for the track
     * @returns {void}
     */
    showContextMenu(trackId = '') {
      this.contextMenu = true;
      return this.contextMenuTrackId = trackId;
    },
    /**
     * Delete track from the playlist
     * @param {string} trackId - track ID
     * @returns {void}
     */
    deleteTrack(trackId = '') {
      // update the playlist
      this.playlist = this.playlist.filter(({ id = '' }) => id !== trackId);
      savePlaylist(this.playlist);

      // if deleted track is currently playing, play the next one or stop
      // TODO: check if playback is paused
      if (trackId === this.audioID) {
        this.playNext();
      } 

      // close context menu
      return this.closeContextMenu();
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
.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
