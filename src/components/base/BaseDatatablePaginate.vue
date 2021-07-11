<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      @page-count="pageCount = $event"
      title="Usuarios"
      :loading="loading"
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
          title-tooltip="Ver"
          icon="mdi-eye"
          @click="searchItem(item)"
        />
        <BaseDatatableRowButton
          title-tooltip="Editar"
          icon="mdi-pencil"
          @click="editItem(item)"
        />

        <BaseDatatableRowButton
          title-tooltip="Eliminar"
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
      <template v-slot:footer>
        <v-pagination
          color="primary darken-2"
          :length="total"
          v-model="page"
          :total-visible="5"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
          circle
          @input="handlePageChange"
        ></v-pagination>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "BaseDatatablePaginate",
  props: {
    title: String,
    headers: Array,
    items: Array,
    sortBy: String,
    extraButtons: Boolean,
    loading: Boolean,
    total: Number,
    itemsPerPage: Number,
  },
  data: () => ({
    search: "",
    pageCount: 0,
    page: 1,
  }),
  methods: {
    handlePageChange(value) {
      this.$emit("changePage", value);
    },

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
