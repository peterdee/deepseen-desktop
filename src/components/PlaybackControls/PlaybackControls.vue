<template>
  <div class="controls">
    <button
      class="control-button"
      :disabled="trackIds.length === 0"
      type="button"
      @click="playPrevious()"
    >
      ◄
    </button>
    <button
      class="control-button"
      :disabled="trackIds.length === 0"
      type="button"
      @click="playNext()"
    >
      ►
    </button>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'PlaybackControls',
  computed: {
    ...mapGetters({ trackIds: 'playlist/getTrackIds' }),
    ...mapState({
      loop: ({ settings }) => settings.loopPlaylist,
      track: ({ track }) => track.track,
    }),
  },
  methods: {
    /**
     * Play the next track
     * @returns {*}
     */
    playNext() {
      if (this.trackIds.length === 0) {
        return false;
      }

      const nextTrackID = this.trackIds[this.trackIds.indexOf(this.track.id) + 1];
      if (nextTrackID) {
        return this.$emit('handle-track-selection', nextTrackID);
      }

      // play the first track if playlist loop is enabled
      if (this.loop) {
        return this.$emit('handle-track-selection', this.trackIds[0]);
      }
    },
    /**
     * Play the previous track
     * @returns {*}
     */
    playPrevious() {
      if (this.trackIds.length === 0) {
        return false;
      }

      const previousTrackID = this.trackIds[this.trackIds.indexOf(this.track.id) - 1];
      if (previousTrackID) {
        return this.$emit('handle-track-selection', previousTrackID);
      }

      // play the last track if playlist loop is enabled
      if (this.loop) {
        return this.$emit('handle-track-selection', this.trackIds[this.trackIds.length - 1]);
      }
    },
  },
};
</script>

<style src="./PlaybackControls.css" />
