<template>
  <div class="controls">
    <button
      class="control-button"
      type="button"
      @click="$emit('play-previous')"
    >
      ◄
    </button>
    <button
      class="control-button"
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
  background-color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  margin: 0 4px;
  outline: none;
  padding: 16px;
  transition: background-color 150ms ease-in-out;
}
.control-button:hover {
  background-color: #bfbfbf;
  cursor: pointer;
  transition: background-color 150ms ease-in-out;
}
</style>
