<template>
  <v-select
    v-bind="$attrs"
    v-on="$listeners"
    color="primary"
    outlined
    dense
  ></v-select>
</template>

<script>
export default {
  name: "BaseSelect",
};
</script>

<style scoped></style>
