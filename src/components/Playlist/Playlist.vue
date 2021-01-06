<template>
  <div
    v-cloak
    class="flex direction-column justify-content-start playlist noselect"
    @drop.prevent="handleFileDrop($event)"
    @dragover.prevent
  >
    <div
      v-for="(track, index) in tracks"
      :key="track.id"
    >
      <button
        :class="[
          'flex justify-content-space-between fs-16 track text-left',
          checkQueue(track.id) && track.id !== current.id ? 'queued' : '',
          track.id === current.id ? 'active' : '',
          !track.available ? 'unavailable' : '',
        ]"
        type="button"
        @click="$emit('handle-track-selection', track.id)"
        @contextmenu.prevent="showContextMenu(track.id)"
      >
        <div class="flex">
          <div class="track-number text-left">
            {{ index + 1 }}
          </div>
          <div class="track-name">
            {{ formatName(track.name) }}
          </div>
        </div>
        <div class="flex">
          <div class="m-r">
            {{ checkQueue(track.id) ? `[${playbackQueue.indexOf(track.id) + 1}]` : '' }}
          </div>
          <div>
            {{ formatTrackDuration(track.duration || 0) }}
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { remote as electron, ipcRenderer } from 'electron';
import { promises as fs } from 'fs';
import { mapActions, mapState } from 'vuex';

import { ALLOWED_EXTENSIONS as allowedExtensions } from '../../configuration';

import checkPath from '../../utilities/check-path';
import formatTime from '../../utilities/format-time';
import formatTrackName from '../../utilities/format-track-name';
import generateId from '../../utilities/generate-id';
import getFileExtension from '../../utilities/get-file-extension';
import parseDir from '../../utilities/parse-dir';
import parseFile from '../../utilities/parse-file';

export default {
  name: 'Playlist',
  computed: {
    ...mapState({
      current: ({ track }) => track.track,
      playbackQueue: ({ playbackQueue }) => playbackQueue.queue,
      tracks: ({ playlist }) => playlist.tracks,
    }),
  },
  mounted() {
    const options = {
      buttonLabel: 'Add',
      filters: [{
        extensions: allowedExtensions,
        name: 'Audio',
      }],
      properties: [
        'multiSelections',
        'openFile',
        'openDirectory',
      ],
      title: 'Add files and directories',
    };

    // handle app menu: add files and directories for Mac
    ipcRenderer.on('add-tracks-mac', async () => {
      try {
        const {
          canceled = false,
          filePaths = [],
        } = await electron.dialog.showOpenDialog(null, options);
        if (canceled) {
          return false;
        }

        // pass file paths to the handler
        return this.handleOpenDialog(filePaths);
      } catch (error) {
        return this.setPlaybackError('Could not add the file!');
      }
    });
    
    // handle app menu: add directories for Windows
    ipcRenderer.on('add-directories-windows', async () => {
      try {
        const dirOptions = { ...options };
        dirOptions.properties = [
          'multiSelections',
          'openDirectory',
        ];
        dirOptions.title = 'Add directories';

        const {
          canceled = false,
          filePaths = [],
        } = await electron.dialog.showOpenDialog(null, dirOptions);
        if (canceled) {
          return false;
        }

        // pass file paths to the handler
        return this.handleOpenDialog(filePaths);
      } catch (error) {
        return this.setPlaybackError('Could not add the file!');
      }
    });

    // handle app menu: add files for Windows
    ipcRenderer.on('add-tracks-windows', async () => {
      try {
        const fileOptions = { ...options };
        fileOptions.properties = [
          'multiSelections',
          'openFile',
        ];
        fileOptions.title = 'Add files';

        const {
          canceled = false,
          filePaths = [],
        } = await electron.dialog.showOpenDialog(null, fileOptions);
        if (canceled) {
          return false;
        }

        // pass file paths to the handler
        return this.handleOpenDialog(filePaths);
      } catch (error) {
        return this.setPlaybackError('Could not add the file!');
      }
    });
  },
  methods: {
    ...mapActions({
      addTrack: 'playlist/addTrack',
      setContextMenuTrackId: 'contextMenu/setTrackId',
      setContextMenuVisibility: 'contextMenu/setVisibility',
      setPlaybackError: 'playbackError/setError',
    }),
    /**
     * Check if playback queue includes the track
     * @param {string} trackId - track ID
     * @returns {boolean}
     */
    checkQueue(trackId = '') {
      return this.playbackQueue.includes(trackId);
    },
    /**
     * Format track duration
     * @param {number} value - duration value
     * @returns {string}
     */
    formatTrackDuration(value = 0) {
      return formatTime(value);
    },
    /**
     * Format track name
     * @param {string} name - track name
     * @returns {string}
     */
    formatName(name = '') {
      return formatTrackName(name, false);
    },
    /**
     * Add track to the playlist when 'oncanplay' event fires
     * @param {*} file - file to add
     * @param {*} audio - Audio element
     * @returns {Promise<void>}
     */
    addTrackOnCanPlay(file, audio) {
      const track = {
        ...file,
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
    },
    /**
     * Handle adding files from a directory
     * @param {string} path - full path to a directory
     * @returns {Promise<void>}
     */
    async handleDirectory(path = '') {
      const tracks = await parseDir(path, allowedExtensions);

      // process files concurrently
      for await (const item of tracks) {
        const buffer = await fs.readFile(item.path);
        let audio = new Audio();
        audio.src = URL.createObjectURL(new Blob([buffer], { type: item.type }));

        audio.oncanplay = () => this.addTrackOnCanPlay(item, audio);
      }
    },
    /**
     * Handle drag & drop
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
            return this.handleDirectory(file.path);
          }
        } catch {
          return this.setPlaybackError('Could not add the file!');
        }

        // leave only the allowed extensions
        if (!allowedExtensions.includes(getFileExtension(file.name))) {
          return false;
        }

        let audio = new Audio();
        audio.src = URL.createObjectURL(file);

        audio.oncanplay = () => this.addTrackOnCanPlay(
          {
            added: Date.now(),
            available: true,
            id: generateId(),
            name: file.name,
            path: file.path,
            size: file.size,
            type: file.type,
          },
          audio,
        );
      });
    },
    /**
     * Handle adding files and directories with 'openDialog'
     * @param {string[]} paths - paths to files and directories
     * @returns {Promise<*>}
     */
    async handleOpenDialog(paths = []) {
      // check array
      if (!(Array.isArray(paths) && paths.length > 0)) {
        return false;
      }

      // process files
      return paths.forEach(async (path = '') => {
        try {
          // check if this is a directory
          const { isDirectory = false, size = null } = await checkPath(path);

          // if path points to a directory
          if (isDirectory) {
            return this.handleDirectory(path);
          }

          // if path points to a file
          const file = parseFile(path, size, allowedExtensions);
          if (!file) {
            return false;
          }

          const buffer = await fs.readFile(file.path);
          let audio = new Audio();
          audio.src = URL.createObjectURL(new Blob([buffer], { type: file.type }));

          audio.oncanplay = () => this.addTrackOnCanPlay(file, audio);
        } catch {
          return this.setPlaybackError('Could not add the file!');
        }
      });
    },
    /**
     * Show context menu
     * @param {string} trackId - track ID
     * @returns {Promise<void>}
     */
    async showContextMenu(trackId = '') {
      await this.setContextMenuTrackId(trackId);
      return this.setContextMenuVisibility(true);
    },
  },
};
</script>

<style src="./Playlist.css" scoped />
