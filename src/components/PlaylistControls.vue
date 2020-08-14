<template>
  <div class="controls">
    <button
      type="button"
      @click="$emit('open-playlist')"
    >
      Open playlist
    </button>
    <button
      type="button"
      @click="$emit('save-playlist')"
    >
      Save playlist
    </button>
    <button
      type="button"
      @click="$emit('clear-playlist')"
    >
      Clear playlist
    </button>
  </div>
</template>

<script>
export default {
  name: 'PlaylistControls',
};
</script>

<style>
.controls {
  display: flex;
  justify-content: space-between;
}
</style>
