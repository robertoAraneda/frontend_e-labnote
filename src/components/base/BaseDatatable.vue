<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by="sortBy"
      class="elevation-1"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      @page-count="pageCount = $event"
      @pagination="pagination = $event"
    >
      <template v-slot:top>
        <v-toolbar elevation="1" tile>
          <slot name="select"></slot>
          <v-spacer v-if="!!$slots.select"></v-spacer>
          <BaseTextfield
            hide-details
            single-line
            label="Buscar"
            placeholder="Buscar"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
          />
          <v-spacer v-if="!!$slots.searchButton"></v-spacer>
          <slot name="searchButton"> </slot>
        </v-toolbar>
      </template>
      <template v-slot:item.is_patient_codable="{ item }">
        <v-icon v-if="item.is_patient_codable" color="red"
          >mdi-alert-circle-outline</v-icon
        >
        <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
      </template>
      <template v-slot:item.actions="{ item }">
        <BaseDatatableRowButton
          title-tooltip="Ver"
          icon="mdi-magnify mdi-rotate-90"
          @click="searchItem(item)"
          v-if="canShow"
        />
        <BaseDatatableRowButton
          v-if="useSlugRoute && canUpdate"
          title-tooltip="Editar"
          icon="mdi-pencil"
          @click="editItem(item)"
          :to="{
            name: 'editObservationServiceRequest',
            params: { slug: item.slug },
          }"
        />
        <BaseDatatableRowButton
          v-else-if="canUpdate"
          title-tooltip="Editar"
          icon="mdi-pencil"
          @click="editItem(item)"
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
        <v-chip small outlined class="ma-2" color="secondary" label>
          <v-icon small left>
            {{ item.icon }}
          </v-icon>
          {{ item.icon }}
        </v-chip>
      </template>
      <template v-slot:item.active="{ item }">
        <v-switch
          hide-details
          dense
          @change="changeStatus(item)"
          v-model="item.active"
          inset
        ></v-switch>
      </template>
    </v-data-table>
    <v-toolbar elevation="1" tile>
      <v-toolbar-title class="text-body-2"
        >Filas por página: {{ pagination.itemsPerPage }}
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-title class="text-body-2">
        Total de registros: {{ pagination.itemsLength }}
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-title class="text-body-2">
        Mostrando: {{ pagination.pageStart + 1 }} a {{ pagination.pageStop }} de
        {{ pagination.itemsLength }}
      </v-toolbar-title>
      <v-spacer />
      <BasePagination v-model="page" :length="pageCount" />
    </v-toolbar>
  </div>
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
    useSlugRoute: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    search: "",
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    pagination: {},
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

<style scoped>
.v-input--selection-controls {
  margin-top: 4px;
  padding-top: 0px;
}
</style>
