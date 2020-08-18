<template>
  <div class="controls">
    <button
      class="control-button"
      :disabled="playlist.length === 0"
      type="button"
      @click="$emit('play-previous')"
    >
      ◄
    </button>
    <button
      class="control-button"
      :disabled="playlist.length === 0"
      type="button"
      @click="$emit('play-next')"
    >
      ►
    </button>
  </div>
</template>

<script>
export default {
  name: 'PlaybackControls',
  props: {
    playlist: {
      default() {
        return [];
      },
      required: false,
      type: Array,
    },
  },
};
</script>

<style>
.controls {
  background-color: black;
  display: flex;
  justify-content: center;
  padding: 16px;
}
.control-button {
  background-color: black;
  border: 2px solid white;
  border-radius: 50%;
  color: white;
  font-size: 16px;
  margin: 0 4px;
  outline: none;
  padding: 16px;
  transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
}
.control-button:hover {
  background-color: white;
  color: black;
  cursor: pointer;
  transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
}
.control-button:disabled {
  background-color: #696969;
  color: #d0d0d0;
  cursor: default;
  transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
}
</style>
