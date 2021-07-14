<template>
  <v-autocomplete
    v-bind="$attrs"
    v-on="$listeners"
    outlined
    dense
    chips
    deletable-chips
    small-chips
  ></v-autocomplete>
</template>

<script>
export default {
  name: "BaseAutocomplete",
};
</script>

<style scoped></style>
