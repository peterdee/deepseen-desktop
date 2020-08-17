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
</style>
