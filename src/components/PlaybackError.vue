<template>
  <div class="error">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'PlaybackError',
  props: {
    message: {
      default() {
        return '';
      },
      required: false,
      type: String,
    },
  },
};
</script>

<style>
.error {
  color: red;
  font-size: 20px;
}
</style>
