<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :sort-by="sortBy"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar color="primary lighten-1" flat>
        <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <slot name="top"> </slot>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small class="mr-2" @click="deleteItem(item)"> mdi-delete </v-icon>
      <v-icon
        v-if="extraButtons"
        small
        class="mr-2"
        @click="customMethod(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:item.active="{ item }">
      <v-chip
        class="max-width"
        small
        :color="item.active ? 'primary' : 'secondary'"
        dark
        outlined
      >
        {{ item.active ? "Activo" : "Inactivo" }}
      </v-chip>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "BaseDatatable",
  props: {
    title: String,
    headers: Array,
    items: Array,
    sortBy: String,
    extraButtons: Boolean,
  },
  methods: {
    editItem(item) {
      this.$emit("editItem", item);
    },
    deleteItem(item) {
      this.$emit("deleteItem", item);
    },
    customMethod(item) {
      this.$emit("customMethod", item);
    },
  },
};
</script>

<style scoped></style>
