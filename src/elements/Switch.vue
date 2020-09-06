<template>
  <label class="form-switch align-items-center">
    <input
      :checked="value"
      @input="$emit('handle-switch', $event)"
      type="checkbox"
    >
    <i></i>
    {{ label }}
  </label>
</template>

<script>
export default {
  name: 'Switch',
  props: {
    label: {
      required: true,
      type: String,
    },
    value: {
      default() {
        return false;
      },
      required: false,
      type: Boolean,
    },
  },
};
</script>

<style src="./Switch.css" scoped />
