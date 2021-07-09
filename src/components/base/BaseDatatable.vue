<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :sort-by="sortBy"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title class="black--text">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <slot name="top"> </slot>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <BaseDatatableRowButton
        title-tooltip="Editar rol"
        icon="mdi-pencil"
        @click="editItem(item)"
      />

      <BaseDatatableRowButton
        title-tooltip="Eliminar rol"
        icon="mdi-delete"
        @click="deleteItem(item)"
      />

      <BaseDatatableRowButton
        v-if="extraButtons"
        title-tooltip="Modificar permisos"
        icon="mdi-shield-key"
        @click="customMethod(item)"
      />
    </template>
    <template v-slot:item.active="{ item }">
      <v-tooltip color="primary darken-2" bottom>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-switch
              @change="changeStatus(item)"
              dense
              v-model="item.active"
              inset
            ></v-switch>
          </div>
        </template>
        <span>{{ item.active ? "Activo" : "Inactivo" }}</span>
      </v-tooltip>
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
    changeStatus(item) {
      this.$emit("changeStatus", item);
    },

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
