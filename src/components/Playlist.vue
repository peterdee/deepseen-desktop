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
        :class="['track', track.id === current ? 'active' : '']"
        type="button"
        @click="$emit('select-track', track.id)"
      >
        <div class="track-left">
          <div class="track-number">
            {{ index + 1 }}
          </div>
          <div class="track-name">
            {{ formatTrackName(track.path) }}
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
export default {
  name: 'Playlist',
  props: {
    current: {
      default() {
        return null;
      },
      required: false,
      type: [Number, String],
    },
    tracks: {
      required: true,
      type: Array,
    },
  },
  methods: {
    /**
     * Format track duration
     * @param {number} value - duration value
     * @returns {string}
     */
    formatTrackDuration(value = 0) {
      const seconds = Math.round(value);
      const fullMinutes = Math.floor(seconds / 60);
      const leftOverSeconds = seconds - (fullMinutes * 60);
      const formattedMinutes = fullMinutes > 9 ? fullMinutes : `0${fullMinutes}`;
      const formattedSeconds = leftOverSeconds > 9 ? leftOverSeconds : `0${leftOverSeconds}`;
      return `${formattedMinutes}:${formattedSeconds}`;
    },
    /**
     * Format track name
     * @param {string} path - track file path
     * @returns {string}
     */
    formatTrackName(path = '') {
      const [fileName = ''] = path.split('/').slice(-1);
      const partials = fileName.split('.');
      return partials.splice(0, partials.length - 1).join('.');
    },
  },
};
</script>

<style>
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
