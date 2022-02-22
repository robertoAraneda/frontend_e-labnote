<template>
  <v-btn icon v-bind="$attrs" v-on="$listeners" :color="color">
    <v-icon> {{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "BaseDatatableRowButton",
  props: {
    titleTooltip: String,
    icon: String,
    color: {
      type: String,
      default: "secondary",
    },
  },
};
</script>

<style scoped></style>
