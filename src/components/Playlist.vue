<template>
  <div class="playlist">
    <div
      v-for="track in tracks"
      :key="track.id"
    >
      <button
        class="track"
        type="button"
        @click="$emit('select-track', track.id)"
      >
        <div class="track-name">
          {{ formatTrackName(track.path) }}
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
.track {
  background-color: transparent;
  border: none;
  color: white;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  margin: 4px 0;
  outline: none;
  padding: 4px 16px;
  text-align: left;
  transition: background-color 125ms ease-in-out;
  width: 100%;
}
.track:hover {
  background-color: #555555;
  border-radius: 3px;
  transition: background-color 125ms ease-in-out;
}
.track-name {
  max-width: 80%;
}
</style>
