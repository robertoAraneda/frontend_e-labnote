<template>
  <v-icon
    @click="handleClickEvent()"
    v-bind="$attrs"
    v-on="$listeners"
    class="mr-2"
    color="secondary"
  >
    {{ icon }}
  </v-icon>
</template>

<script>
export default {
  name: "BaseDatatableRowButton",
  props: {
    titleTooltip: String,
    icon: String,
  },
  methods: {
    handleClickEvent() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped></style>
