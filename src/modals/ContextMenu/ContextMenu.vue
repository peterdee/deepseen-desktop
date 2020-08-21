<template>
  <div>
    <div
      class="background"
      @click="setContextMenuVisibility(false)"
    />
    <div class="content">
      <div class="title">
        {{ trackName }}
      </div>
      <button
        class="action-button menu-button"
        type="button"
        @click="$emit('delete-track', trackId)"
      >
        Delete
      </button>
      <button
        class="action-button menu-button"
        type="button"
        @click="setContextMenuVisibility(false)"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ContextMenu',
  computed: {
    ...mapState({
      contextTrackId: ({ contextMenu }) => contextMenu.trackId,
      tracks: ({ playlist }) => playlist.tracks,
    }),
    /**
     * Get track name by the track ID
     */
    trackName() {
      const [track = {}] = this.tracks.filter((item) => item.id === this.contextTrackId);
      return track.name;
    },
  },
  methods: {
    ...mapActions({
      setContextMenuVisibility: 'contextMenu/setVisibility',
    }),
  },
};
</script>

<style src="./ContextMenu.css" scoped />
