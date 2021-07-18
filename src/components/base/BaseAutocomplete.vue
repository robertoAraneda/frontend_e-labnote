<template>
  <v-autocomplete
    v-bind="$attrs"
    v-on="$listeners"
    filled
    color="primary"
    chips
    deletable-chips
    small-chips
    prepend-inner-icon="mdi-filter"
  >
    <template v-slot:selection="data">
      <v-chip
        class="my-3"
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        color="secondary"
        @click="data.select"
        @click:close="remove(data.item)"
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
    remove(item) {
      this.$emit("remove", item);
    },
  },
};
</script>

<style scoped></style>
