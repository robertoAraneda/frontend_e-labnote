<template>
  <v-tooltip color="primary darken-2" bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        @click="handleClickEvent()"
        dense
        v-bind="attrs"
        v-on="on"
        class="mr-2"
        color="secondary"
      >
        {{ icon }}
      </v-icon>
    </template>
    <span>{{ titleTooltip }}</span>
  </v-tooltip>
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
