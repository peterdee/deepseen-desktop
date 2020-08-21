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
        @contextmenu.prevent="$emit('show-context-menu', track.id)"
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
import { mapState } from 'vuex';

import formatTime from '../utilities/format-time';

export default {
  name: 'Playlist',
  computed: {
    ...mapState({
      current: ({ track }) => track.track,
      tracks: ({ playlist }) => playlist.tracks,
    }),
  },
  methods: {
    /**
     * Format track duration
     * @param {number} value - duration value
     * @returns {string}
     */
    formatTrackDuration(value = 0) {
      return formatTime(value);
    },
  },
};
</script>

<style scoped>
.playlist {
  background-color: black;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  justify-content: flex-start;
  overflow: scroll;
}
.track, .track:hover, .active, .active:hover {
  transition: background-color 125ms ease-in-out;
}
.track {
  background-color: transparent;
  border: none;
  border-radius: 5px;
  color: white;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  outline: none;
  padding: 8px 16px;
  text-align: left;
  width: 100%;
}
.track:hover {
  background-color: #555555;
}
.track-left {
  display: flex;
}
.track-number {
  margin-right: 8px;
  max-width: 64px;
  min-width: 32px;
  text-align: right;
  width: 32px;
}
.active {
  background-color: turquoise;
  color: black;
}
.active:hover {
  background-color: rgb(173, 255, 247);
}
</style>
