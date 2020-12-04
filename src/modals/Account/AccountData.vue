<template>
  <div>
    Logged in as {{ name }} ({{ email }})
  </div>
</template>

<script>
export default {
  name: 'AccountData',
  props: {
    email: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
  },
};
</script>
