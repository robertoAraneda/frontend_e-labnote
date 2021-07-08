<template>
  <v-text-field
    v-bind="$attrs"
    v-on="$listeners"
    outlined
    color="primary"
    dense
  ></v-text-field>
</template>

<script>
export default {
  name: "BaseTextfield",
};
</script>

<style scoped></style>
