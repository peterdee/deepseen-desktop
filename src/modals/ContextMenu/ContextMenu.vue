<template>
  <div>
    <div
      class="background"
      @click="$emit('close')"
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
        @click="$emit('close')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    playlist: {
      required: true,
      type: Array,
    },
    trackId: {
      required: true,
      type: String,
    },
  },
  computed: {
    trackName() {
      const [track = {}] = this.playlist.filter((item) => item.id === this.trackId);
      return track.name;
    }
  }
};
</script>

<style src="./ContextMenu.css" scoped />
