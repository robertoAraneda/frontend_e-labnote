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
      <template v-slot:item.active="{ item }">
        <v-switch
          hide-details
          color="secondary darken-3"
          @change="changeStatus(item)"
          dense
          v-model="item.active"
          inset
        ></v-switch>
      </template>
      <template v-slot:footer>
        <BasePagination
          :length="total"
          v-model="page"
          :total-visible="5"
          @input="handlePageChange"
        />
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
    extraButtons: {
      type: Boolean,
      default: () => false,
    },
    loading: Boolean,
    total: Number,
    itemsPerPage: Number,
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

<style scoped>
.v-input--selection-controls {
  margin-top: 4px;
  padding-top: 0px;
}
</style>
