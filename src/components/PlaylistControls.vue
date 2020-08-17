<template>
  <div class="controls">
    <button
      class="action-button"
      type="button"
      @click="$emit('open-playlist')"
    >
      Open playlist
    </button>
    <button
      class="action-button"
      type="button"
      @click="$emit('save-playlist')"
    >
      Save playlist
    </button>
    <button
      class="action-button"
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
  justify-content: center;
}
.action-button {
  background-color: black;
  border: 2px solid white;
  border-radius: 5px;
  color: white;
  margin: 0 4px;
  outline: none;
  padding: 8px 16px;
  transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
}
.action-button:hover {
  background-color: white;
  color: black;
  cursor: pointer;
  transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
}
</style>
