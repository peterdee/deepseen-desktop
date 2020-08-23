<template>
  <div id="app">
    <ContextMenu
      v-if="contextMenu"
      @handle-track-selection="handleTrackSelection($event)"
    />
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
import { mapActions, mapGetters, mapState } from 'vuex';
import { promises as fs } from 'fs';

import checkPath from './utilities/check-path';
import generateId from './utilities/generate-id';
import getFileExtension from './utilities/get-file-extension';
import getNextTrackId from './utilities/get-next-track';
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
      playbackError: '',
    };
  },
  computed: {
    ...mapGetters({
      trackIds: 'playlist/getTrackIds',
    }),
    ...mapState({
      contextMenu: ({ contextMenu }) => contextMenu.visibility,
      current: ({ track }) => track.track,
      loop: ({ settings }) => settings.loopPlaylist,
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
    // load the file but do not play it
    if (this.current.id) {
      this.handleTrackSelection(this.current.id, false);
    }
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
     * @param {string} id - selected track ID
     * @param {boolean} play - start playing the selected track
     * @returns {Promise<*>}
     */
    async handleTrackSelection(id = '', play = true) {
      try {
        // stop the playback if there's no ID
        if (!id) {
          return this.clearTrack();
        }

        // open a file
        const [track = {}] = this.tracks.filter((item) => item.id === id);
        const buffer = await fs.readFile(track.path);
        const url = URL.createObjectURL(new Blob([buffer], { type: track.type }));
        await this.setTrack({
          ...track,
          url,
        });

        const { player } = this.$refs;
        player.oncanplay = () => {
          // play the next track when current one ends
          player.onended = () => this.handleTrackSelection(
            getNextTrackId(this.trackIds, this.current.id, this.loop),
          );

          // play the current track
          return play && player.play();
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
     * @returns {Promise<void>}
     */
    async clearPlaylist() {
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
        // this.playlist = JSON.parse(string);
        // savePlaylist(this.playlist);

        // play the first file if playlist is not empty
        // if (this.playlist.length > 0) {
        //   return this.handleTrackSelection(this.playlist[0].id);
        // }
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
        
        // return fs.writeFile(`${filePath}.spl`, JSON.stringify(this.playlist));
      } catch (error) {
        return this.playbackError = 'Error saving playlist!';
      }
    },
  },
};
</script>

<style src="./Player.css" />
