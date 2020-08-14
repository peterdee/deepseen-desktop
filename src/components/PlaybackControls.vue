<template>
  <div class="controls">
    <button
      type="button"
      @click="$emit('play-previous')"
    >
      Previous
    </button>
    <button
      type="button"
      @click="$emit('play-next')"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  name: 'PlaybackControls',
};
</script>

<style>
.controls {
  display: flex;
  justify-content: space-between;
}
</style>
