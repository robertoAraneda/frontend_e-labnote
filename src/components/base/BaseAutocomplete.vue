<template>
  <v-autocomplete
    v-bind="$attrs"
    v-on="$listeners"
    color="primary"
    :prepend-inner-icon="prependIcon"
  >
  </v-autocomplete>
</template>

<script>
export default {
  name: "BaseAutocomplete",

  props: {
    prependIcon: {
      type: String,
      default: () => "mdi-filter",
    },
  },

  data: () => ({
    avatar: "",
  }),

  methods: {
    remove() {
      this.$emit("remove");
    },
  },
};
</script>

<style scoped></style>
