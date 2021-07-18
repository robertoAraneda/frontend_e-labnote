<template>
  <v-switch
    v-bind="$attrs"
    v-on="$listeners"
    hide-details
    color="secondary"
    dense
    inset
  ></v-switch>
</template>

<script>
export default {
  name: "BaseSwitch",
};
</script>

<style scoped>
.v-input--selection-controls {
  margin-top: 4px;
  padding-top: 0px;
}
</style>
