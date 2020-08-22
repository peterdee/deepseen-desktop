<template>
  <div id="app">
    <ContextMenu v-if="contextMenu" />
    <div class="player">
      <div>
        {{ currentlyPlaying }}
      </div>
      <div>
        <audio
          v-if="current.url"
          preload="auto"
          ref="player"
          :src="current.url"
          :type="current.type"
          controls
        />
      </div>
      <Playlist
        @add-file="handleFileDrop($event)"
        @select-track="handleTrackSelection($event)"
      />
    </div>
    <TotalPlaybackTime /> 
    <PlaybackControls
      @handle-track-selection="handleTrackSelection($event)"
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
import { mapActions, mapState } from 'vuex';
import { promises as fs } from 'fs';

import checkPath from './utilities/check-path';
import { savePlaylist } from './utilities/playlist';
import generateId from './utilities/generate-id';
import getFileExtension from './utilities/get-file-extension';
import parseDir from './utilities/parse-dir';

import ContextMenu from './modals/ContextMenu/ContextMenu';
import PlaybackControls from './components/PlaybackControls/PlaybackControls';
import PlaybackError from './components/PlaybackError';
import Playlist from './components/Playlist/Playlist';
import PlaylistControls from './components/PlaylistControls';
import TotalPlaybackTime from './components/TotalPlaybackTime/TotalPlaybackTime';

// allowed audio extensions
const allowedExtensions = ['aac', 'mp3', 'wav'];

export default {
  name: 'Player',
  components: {
    ContextMenu,
    PlaybackControls,
    PlaybackError,
    Playlist,
    PlaylistControls,
    TotalPlaybackTime,
  },
  data() {
    return {
      appName: 'Audio Player',
      audioID: null,
      audioPath: '',
      audioType: '',
      audioURL: '',
      playbackError: '',
      playlist: [],
    };
  },
  computed: {
    ...mapState({
      contextMenu: ({ contextMenu }) => contextMenu.visibility,
      current: ({ track }) => track.track,
      tracks: ({ playlist }) => playlist.tracks,
    }),
    /**
     * Currently playing track name
     */
    currentlyPlaying() {
      return this.current.name || this.appName;
    },
  },
  async mounted() {
    console.log('current', this.current)
  },
  methods: {
    ...mapActions({
      addTrack: 'playlist/addTrack',
      clearTrack: 'track/clearTrack',
      emptyPlaylist: 'playlist/clearPlaylist',
      setTrack: 'track/setTrack',
    }),
    /**
     * Handle drag & drop TODO: move this to the Playlist
     * @param {object} event - drop event
     * @returns {Promise<void>}
     */
    handleFileDrop(event) {
      return Array.prototype.forEach.call(event.dataTransfer.files, async (file) => {
        // check path to determine if it's a directory or a file
        try {
          const { isDirectory = false } = await checkPath(file.path);

          // if this is a directory
          if (isDirectory) {
            const tracks = await parseDir(file.path, allowedExtensions);

            // process files concurrently
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

                // check if playlist is empty
                if (this.tracks.length === 0) {
                  return this.addTrack(track);
                }

                // make sure that there are no duplicates (compare paths)
                const [existingTrack = null] = this.tracks.filter(
                  ({ path = '' }) => path === track.path,
                );
                if (existingTrack) {
                  return false;
                }
                
                return this.addTrack(track);
              };
            }
          }
        } catch (error) {
          // TODO: show an error as a modal (?), use Vuex
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

          // check if playlist is empty
          if (this.tracks.length === 0) {
            return this.addTrack(track);
          }

          // make sure that there are no duplicates (compare paths)
          const [existingTrack = null] = this.tracks.filter(
            ({ path = '' }) => path === track.path,
          );
          if (existingTrack) {
            return false;
          }
          
          return this.addTrack(track);
        };
      });
    },
    /**
     * Handle track selection
     * @param {string} id - track ID
     * @returns {Promise<*>}
     */
    async handleTrackSelection(id = '') {
      try {
        // TODO: error should not be displayed at this point
        this.playbackError = '';

        // open a file
        const [track = {}] = this.tracks.filter((item) => item.id === id);
        const buffer = await fs.readFile(track.path);
        const url = URL.createObjectURL(new Blob([buffer], { type: track.type }));
        console.log(url);
        await this.setTrack({
          ...track,
          url,
        });

        const { player } = this.$refs;
        player.oncanplay = () => {
          // play the next track when current one ends
          player.onended = () => this.playNext();

          // play the current track
          return player.play();
        };
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
    async clearPlaylist() {
      // TODO: clear last played in Vuex
      localStorage.removeItem('last');
      
      // TODO: this should be done with Vuex
      this.playbackError = '';

      await this.clearTrack();
      return this.emptyPlaylist();
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

<style src="./Player.css" />
