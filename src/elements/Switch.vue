<template>
  <label
    class="form-switch"
  >
    <input
      @input="$emit('handle-switch', $event)"
      type="checkbox"
      :checked="value"
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
    }
  },
};
</script>

<style src="./Switch.css" scoped />
