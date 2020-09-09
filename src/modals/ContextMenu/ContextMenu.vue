<template>
  <div>
    <div
      class="background"
      @click="setContextMenuVisibility(false)"
    />
    <div class="content">
      <div class="title">
        {{ formatName(track.name) }}
      </div>
      <div class="data-group">
        <div class="data-line">
          <div class="data-name">
            Added
          </div>
          <div class="data-value">
            {{ formatDate(track.added) }}
          </div>
        </div>
        <div class="data-line">
          <div class="data-name">
            Full path
          </div>
          <div class="data-value">
            <input
              class="data-input"
              name="path"
              readonly="true"
              type="text"
              :value="track.path"
            />
          </div>
        </div>
        <div class="data-line">
          <div class="data-name">
            File size
          </div>
          <div class="data-value">
            {{ formatSize(track.size) }}
          </div>
        </div>
      </div>
      <div v-if="current.id === contextTrackId">
        File is playing
      </div>
      <div
        v-else-if="!track.available"
        class="error"
      >
        Track is not available!
      </div>
      <div v-else>
        <button
          class="action-button menu-button"
          @click="handlePlay"
          type="button"
        >
          Play
        </button>
      </div>
      <button
        v-if="!inQueue"
        class="action-button menu-button"
        @click="handleAddToQueue"
        :disabled="!track.available"
        type="button"
      >
        Add to queue
      </button>
      <button
        v-else
        class="action-button menu-button"
        @click="handleRemoveFromQueue"
        type="button"
      >
        Remove from queue
      </button>
      <button
        class="action-button menu-button"
        @click="handleDelete"
        type="button"
      >
        Delete
      </button>
      <button
        class="action-button menu-button"
        @click="setContextMenuVisibility(false)"
        type="button"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

import formatTrackName from '../../utilities/format-track-name';
import getNextTrackId from '../../utilities/get-next-track';
import months from '../../utilities/months';

export default {
  name: 'ContextMenu',
  computed: {
    ...mapGetters({
      trackIds: 'playlist/getTrackIds',
    }),
    ...mapState({
      contextTrackId: ({ contextMenu }) => contextMenu.trackId,
      current: ({ track }) => track.track,
      loop: ({ settings }) => settings.loop,
      playbackQueue: ({ playbackQueue }) => playbackQueue.queue,
      tracks: ({ playlist }) => playlist.tracks,
    }),
    inQueue() {
      return this.playbackQueue.includes(this.contextTrackId);
    },
    /**
     * Get track data
     */
    track() {
      const [track = {}] = this.tracks.filter((item) => item.id === this.contextTrackId);
      return track;
    },
  },
  methods: {
    ...mapActions({
      addToQueue: 'playbackQueue/addTrack',
      clearTrack: 'track/clearTrack',
      deleteTrackFromPlaylist: 'playlist/deleteTrack',
      removeFromQueue: 'playbackQueue/deleteTrack',
      setContextMenuTrackId: 'contextMenu/setTrackId',
      setContextMenuVisibility: 'contextMenu/setVisibility',
    }),
    /**
     * Format track name
     * @param {string} name - track name
     * @returns {string}
     */
    formatName(name = '') {
      return formatTrackName(name);
    },
    /**
     * Handle adding track to the playback queue
     * @returns {Promise<void>}
     */
    async handleAddToQueue() {
      await this.addToQueue(this.contextTrackId);
      await this.setContextMenuTrackId('');
      return this.setContextMenuVisibility(false);
    },
    /**
     * Handle the 'Delete' button
     * @returns {Promise<void>}
     */
    async handleDelete() {
      // check if track is playing / selected
      if (this.contextTrackId === this.current.id) {
        const nextId = getNextTrackId(this.trackIds, this.current.id, this.loop);
        await this.clearTrack();
        this.$emit('handle-track-selection', nextId);
      }

      await this.deleteTrackFromPlaylist(this.contextTrackId);
      await this.removeFromQueue(this.contextTrackId);
      await this.setContextMenuTrackId('');
      return this.setContextMenuVisibility(false);
    },
    /**
     * Handle the 'Play' button
     * @returns {Promise<void>}
     */
    async handlePlay() {
      await this.clearTrack();
      this.$emit('handle-track-selection', this.contextTrackId);
      await this.setContextMenuTrackId('');
      return this.setContextMenuVisibility(false);
    },
    /**
     * Handle removing track from the playback queue
     * @returns {Promise<void>}
     */
    async handleRemoveFromQueue() {
      await this.removeFromQueue(this.contextTrackId);
      await this.setContextMenuTrackId('');
      return this.setContextMenuVisibility(false);
    },
    /**
     * Format date
     * @param {number} stamp - timestamp
     * @returns {string}
     */
    formatDate(stamp = 0) {
      const date = new Date(stamp);
      const year = date.getFullYear();
      const month = months[date.getMonth() + 1];
      const day = date.getDate() > 9
        ? date.getDate()
        : `0${date.getDate()}`;
      const hours = date.getHours() > 9
        ? date.getHours()
        : `0${date.getHours()}`;
      const minutes = date.getMinutes() > 9 
        ? date.getMinutes()
        : `0${date.getMinutes()}`;
      return `${month} ${day}, ${year}, at ${hours}:${minutes}`;
    },
    /**
     * Format file size
     * @param {number} size - file size in bytes
     * @returns {string}
     */
    formatSize(size = 0) {
      // bytes  
      if (size < 1024) {
        return `${size}B`;
      }

      // kilobytes
      if (size < (1024 * 1024)) {
        return `${(size / 1024).toFixed(1)}KB`
      }

      // megabytes
      return `${(size / 1024 / 1024).toFixed(1)}MB`
    },
  },
};
</script>

<style src="./ContextMenu.css" scoped />
