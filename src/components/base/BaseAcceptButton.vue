<template>
  <v-btn v-bind="$attrs" v-on="$listeners" :color="color" rounded depressed>{{
    label
  }}</v-btn>
</template>

<script>
export default {
  name: "BaseAcceptButton",
  props: {
    label: String,
    color: {
      type: String,
      default: () => "primary darken-1",
    },
  },
};
</script>

<style scoped></style>
