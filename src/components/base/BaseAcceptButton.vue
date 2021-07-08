<template>
  <v-btn
    v-bind="$attrs"
    v-on="$listeners"
    color="primary darken-1"
    rounded
    depressed
    >{{ label }}</v-btn
  >
</template>

<script>
export default {
  name: "BaseAcceptButton",
  props: {
    label: String,
  },
};
</script>

<style scoped></style>
