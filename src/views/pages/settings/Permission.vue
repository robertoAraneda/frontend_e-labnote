<template>
  <v-row>
    <v-col cols="12">
      <h5>En este módulo podrás asignar permisos a los roles existentes.</h5>
    </v-col>
    <v-col cols="6">
      <v-select
        label="Rol"
        v-model="selectedRole"
        :items="roles"
        return-object
        outlined
        item-text="name"
        item-value="id"
      >
      </v-select>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col v-for="module in modulesByLaboratory" :key="module.id" cols="6">
          <TreeviewPermission :module="module" :role="selectedRole" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TreeviewPermission from "../../../components/setting/TreeviewPermission";

export default {
  name: "Permission",
  components: { TreeviewPermission },
  data: () => ({
    selectedRole: null,
    selectedPermissions: [],
  }),
  created() {
    this.getRoles();
  },
  mounted() {
    if (!this.modulesByLaboratory.length) {
      this.getModulesByLaboratory(1);
    }
  },
  computed: {
    ...mapGetters({
      roles: "role/roles",
      isRolesLoading: "role/isRolesLoading",
      permissionByRole: "role/permissionByRole",
      isPermissionByRoleLoading: "role/isPermissionByRoleLoading",
      modulesByLaboratory: "laboratory/modulesByLaboratory",
    }),
  },
  methods: {
    ...mapActions({
      getPermissionByRole: "role/getPermissionByRole",
      getRoles: "role/getRoles",
      getModulesByLaboratory: "laboratory/getModulesByLaboratory",
    }),
  },
};
</script>

<style scoped></style>
