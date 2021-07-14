<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :sort-by="sortBy"
    class="elevation-1"
    :search="search"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title class="black--text">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <BaseTextfield class="mt-6" label="Buscar" v-model="search" />
        <v-spacer></v-spacer>
        <slot name="top"> </slot>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <BaseDatatableRowButton
        title-tooltip="Ver"
        icon="mdi-eye"
        @click="searchItem(item)"
        v-if="canShow"
      />
      <BaseDatatableRowButton
        title-tooltip="Editar"
        icon="mdi-pencil"
        @click="editItem(item)"
        v-if="canUpdate"
      />

      <BaseDatatableRowButton
        title-tooltip="Eliminar"
        icon="mdi-delete"
        @click="deleteItem(item)"
        v-if="canDelete"
      />

      <BaseDatatableRowButton
        v-if="extraButtons"
        title-tooltip="Modificar permisos"
        icon="mdi-shield-key"
        @click="customMethod(item)"
      />
    </template>
    <template v-slot:item.icon="{ item }">
      <v-chip small outlined class="ma-2" color="primary" label>
        <v-icon small left>
          {{ item.icon }}
        </v-icon>
        {{ item.icon }}
      </v-chip>
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
    extraButtons: {
      type: Boolean,
      default: () => false,
    },
    canUpdate: {
      type: Boolean,
      default: () => true,
    },
    canDelete: {
      type: Boolean,
      default: () => true,
    },
    canShow: {
      type: Boolean,
      default: () => true,
    },
    canCreate: {
      type: Boolean,
      default: () => true,
    },
  },
  data: () => ({
    search: "",
  }),
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

    searchItem(item) {
      this.$emit("searchItem", item);
    },

    customMethod(item) {
      this.$emit("customMethod", item);
    },
  },
};
</script>

<style scoped></style>
