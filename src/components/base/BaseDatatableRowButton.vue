<template>
  <v-btn icon v-bind="$attrs" v-on="$listeners" color="secondary">
    <v-icon> {{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "BaseDatatableRowButton",
  props: {
    titleTooltip: String,
    icon: String,
  },
};
</script>

<style scoped></style>
