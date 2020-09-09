<template>
  <div
    v-cloak
    class="playlist"
    @drop.prevent="handleFileDrop($event)"
    @dragover.prevent
  >
    <div
      v-for="(track, index) in tracks"
      :key="track.id"
    >
      <button
        :class="[
          'track noselect',
          checkQueue(track.id) && track.id !== current.id ? 'queued' : '',
          track.id === current.id ? 'active' : '',
        ]"
        type="button"
        @click="$emit('handle-track-selection', track.id)"
        @contextmenu.prevent="showContextMenu(track.id)"
      >
        <div class="track-left">
          <div class="track-number">
            {{ index + 1 }}
          </div>
          <div class="track-name">
            {{ track.name }}
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
import { promises as fs } from 'fs';
import { mapActions, mapState } from 'vuex';

import checkPath from '../../utilities/check-path';
import formatTime from '../../utilities/format-time';
import generateId from '../../utilities/generate-id';
import getFileExtension from '../../utilities/get-file-extension';
import parseDir from '../../utilities/parse-dir';

// allowed audio extensions
const allowedExtensions = [
  'aac',
  'flac',
  'mp3',
  'ogg',
  'wav',
];

export default {
  name: 'Playlist',
  computed: {
    ...mapState({
      current: ({ track }) => track.track,
      playbackQueue: ({ playbackQueue }) => playbackQueue.queue,
      tracks: ({ playlist }) => playlist.tracks,
    }),
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
          return this.setPlaybackError('Could not add the file!');
        }

        // leave only the allowed extensions
        if (!allowedExtensions.includes(getFileExtension(file.name))) {
          return false;
        }

        let audio = new Audio();
        audio.src = URL.createObjectURL(file);

        return audio.oncanplay = () => {
          const track = {
            added: Date.now(),
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
