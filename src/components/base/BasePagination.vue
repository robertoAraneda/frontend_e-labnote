<template>
  <v-pagination
    v-bind="$attrs"
    v-on="$listeners"
    prev-icon="mdi-menu-left"
    next-icon="mdi-menu-right"
    :total-visible="7"
  ></v-pagination>
</template>

<script>
export default {
  name: "BasePagination",
};
</script>

<style scoped></style>
