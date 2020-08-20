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

<style scoped>
.background {
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.3);
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}
.content {
  background-color: black;
  border: 1px solid white;
  border-radius: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200px;
  left: calc(50% - 200px);
  margin: auto auto;
  padding: 16px 0;
  position: fixed;
  top: calc(50% - 120px);
  width: 400px;
  z-index: 15;
}
.menu-button {
  margin: 0 auto;
  width: 160px;
}
</style>
