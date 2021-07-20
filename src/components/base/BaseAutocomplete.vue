<template>
  <v-autocomplete
    v-bind="$attrs"
    v-on="$listeners"
    color="primary"
    prepend-inner-icon="mdi-filter"
  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        color="blue-grey lighten-5"
        @click="data.select"
        @click:close="remove()"
      >
        <span class="text-truncate">{{ data.item.name }}</span>
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: "BaseAutocomplete",

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
