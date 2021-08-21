<template>
  <v-btn v-bind="$attrs" v-on="$listeners" :color="color" depressed rounded>{{
    label
  }}</v-btn>
</template>

<script>
export default {
  name: "BaseAcceptButton",
  props: {
    label: {
      type: String,
      default: () => "Crear nuevo registro",
    },
    color: {
      type: String,
      default: () => "primary darken-1",
    },
  },
};
</script>

<style scoped></style>
