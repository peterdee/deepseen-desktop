<template>
  <div
    v-cloak
    class="playlist"
    @drop.prevent="$emit('add-file', $event)"
    @dragover.prevent
  >
    <div
      v-for="(track, index) in tracks"
      :key="track.id"
    >
      <button
        :class="['track noselect', track.id === current.id ? 'active' : '']"
        type="button"
        @click="$emit('select-track', track.id)"
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
        <div>
          {{ formatTrackDuration(track.duration || 0) }}
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import formatTime from '../../utilities/format-time';

export default {
  name: 'Playlist',
  computed: {
    ...mapState({
      current: ({ track }) => track.track,
      tracks: ({ playlist }) => playlist.tracks,
    }),
  },
  methods: {
    ...mapActions({
      setContextMenuTrackId: 'contextMenu/setTrackId',
      setContextMenuVisibility: 'contextMenu/setVisibility',
    }),
    /**
     * Format track duration
     * @param {number} value - duration value
     * @returns {string}
     */
    formatTrackDuration(value = 0) {
      return formatTime(value);
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
