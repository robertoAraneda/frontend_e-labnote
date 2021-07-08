<template>
  <v-btn
    v-bind="$attrs"
    v-on="$listeners"
    color="secondary darken-1"
    rounded
    outlined
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
