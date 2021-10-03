<template>
  <div>
    <v-toolbar color="white" flat>
      <v-toolbar-title>{{ module.name }}</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-title class="text-subtitle-2">
        <v-treeview
          v-model="selectedPermissions"
          selection-type="leaf"
          selectable
          :items="items"
          selected-color="indigo"
          return-object
          expand-icon="mdi-chevron-down"
        ></v-treeview>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "TreeviewPermission",
  props: {
    module: Object,
    //role: Object,
    permissions: Array,
  },
  data: () => ({
    selectedPermissions: [],
    // permissions: [],
    // types: [],
  }),
  async mounted() {
    this.selectedPermissions = this.permissions.filter(
      (permission) => permission.checkbox
    );
  },

  computed: {
    ...mapGetters({
      permissionByRole: "role/permissionByRole",
      modules: "laboratory/modulesByLaboratory",
    }),
    items() {
      return this.types.map((type) => ({
        id: type,
        name: this.getName(type),
        children: this.getChildren(type),
      }));
    },

    types() {
      if (this.permissions.length === 0) return [];
      return this.permissions
        .reduce((acc, cur) => {
          const type = cur.model;

          if (!acc.includes(type)) acc.unshift(type);

          return acc;
        }, [])
        .sort();
    },
  },
  methods: {
    ...mapActions({
      getPermissionsByModule: "module/getPermissionsByModule",
      getPermissionByRole: "role/getPermissionByRole",
    }),
    async handlePermissionsByModule() {
      this.types = this.permissions
        .reduce((acc, cur) => {
          const type = cur.model;

          if (!acc.includes(type)) acc.unshift(type);

          return acc;
        }, [])
        .sort();

      this.selectedPermissions = this.permissions.filter(
        (permission) => permission.checkbox
      );
    },
    getChildren(type) {
      const permissions = [];

      for (const permission of this.permissions) {
        if (permission.model !== type) continue;

        permissions.push({
          ...permission,
          name: this.getName(permission.description),
        });
      }

      return permissions.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
    },
    getName(name) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    },
  },
};
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
</style>
