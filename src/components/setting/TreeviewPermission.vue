<template>
  <div>
    <v-toolbar color="white" flat>
      <v-toolbar-title>{{ module.name }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        depressed
        rounded
        dark
        color="primary"
        @click="handlePermissionsByModule"
        >Cargar</v-btn
      >
    </v-toolbar>
    <v-card max-height="350" class="scroll">
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
  name: "TreviewPermission",
  props: {
    module: Object,
    role: Object,
  },
  data: () => ({
    selectedPermissions: [],
    permissions: [],
    types: [],
  }),
  async mounted() {},
  watch: {
    permissions(val) {
      this.types = val
        .reduce((acc, cur) => {
          const type = cur.model;

          if (!acc.includes(type)) acc.push(type);

          return acc;
        }, [])
        .sort();
      console.log(this.types);
    },
  },
  computed: {
    ...mapGetters({
      permissionByRole: "role/permissionByRole",
    }),
    items() {
      const children = this.types.map((type) => ({
        id: type,
        name: this.getName(type),
        children: this.getChildren(type),
      }));

      return [
        {
          id: 1,
          name: this.module.name,
          children,
        },
      ];
    },
  },
  methods: {
    ...mapActions({
      getPermissionsByModule: "module/getPermissionsByModule",
      getPermissionByRole: "role/getPermissionByRole",
    }),
    async handlePermissionsByModule() {
      this.permissions = await this.getPermissionsByModule({
        idRol: this.role.id,
        idModule: this.module.id,
      });
      this.selectedPermissions = await this.getPermissionByRole({
        idRole: this.role.id,
        idModule: this.module.id,
      });
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
