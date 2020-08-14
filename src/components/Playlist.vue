<template>
  <div class="playlist">
    <div
      v-for="track in tracks"
      :key="track.id"
    >
      <button
        class="track"
        type="button"
        @click="$emit('select-track', track.id)"
      >
        {{ track.path.split('/').slice(-1)[0] }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Playlist',
  props: {
    tracks: {
      required: true,
      type: Array,
    },
  },
};
</script>

<style>
.playlist {
  background-color: black;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  justify-content: flex-start;
  overflow: scroll;
}
.track {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 16px;
  margin: 4px 0;
  outline: none;
  padding: 4px 16px;
  text-align: left;
  transition: background-color 125ms ease-in-out;
  width: 100%;
}
.track:hover {
  background-color: #555555;
  border-radius: 3px;
  transition: background-color 125ms ease-in-out;
}
</style>
