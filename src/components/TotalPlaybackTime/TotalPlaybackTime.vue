<template>
  <div class="wrap">
    Total playlist length: {{ totalTime }}
  </div>
</template>

<script>
import { mapState } from 'vuex';

import formatTime from '../../utilities/format-time';

export default {
  name: 'TotalPlaybackTime',
  computed: {
    ...mapState({
      tracks: ({ playlist }) => playlist.tracks,
    }),
    /**
     * Calculate total playlist playtime
     */
    totalTime() {
      const seconds = this.tracks.reduce((value, track) => value + Number(track.duration), 0);
      return formatTime(seconds);
    },
  },
};
</script>

<style src="./TotalPlaybackTime.css" />
