<template>
  <v-text-field
    v-bind="$attrs"
    v-on="$listeners"
    color="primary"
    outlined
    dense
  ></v-text-field>
</template>

<script>
export default {
  name: "BaseTextfield",
};
</script>

<style scoped></style>
