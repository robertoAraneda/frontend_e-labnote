<template>
  <v-pagination
    v-bind="$attrs"
    v-on="$listeners"
    prev-icon="mdi-menu-left"
    next-icon="mdi-menu-right"
  ></v-pagination>
</template>

<script>
export default {
  name: "BasePagination",
};
</script>

<style scoped></style>
