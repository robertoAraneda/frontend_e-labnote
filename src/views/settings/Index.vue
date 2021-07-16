<template>
  <div>
    <NavigationDrawer :links="menusPermissions" />
    <v-container>
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NavigationDrawer from "../../components/navbar/NavigationDrawer";

export default {
  name: "Index",
  components: { NavigationDrawer },
  data: () => ({}),
  async mounted() {
    const slug = this.splitRoute(this.$route.path);
    await this.getModuleBySlug(slug);
    await this.getPermissionsByModule({
      idRol: this.roleUserLogged.id,
      idModule: this.currentModule.id,
    });
  },
  computed: {
    ...mapGetters({
      menusByModule: "module/menusByModule",
      currentModule: "module/currentModule",
      roleUserLogged: "auth/role",
      permissionName: "auth/namedPermissions",
      namedPermissionsForMenu: "auth/namedPermissionsForMenu",
    }),

    menus() {
      if (!this.currentModule) return [];
      return this.currentModule.menus;
    },

    menusPermissions() {
      if (!this.currentModule) return [];
      return this.currentModule.menus.filter((menu) => {
        console.log(menu.permission.name);
        return this.namedPermissionsForMenu.includes(menu.permission.name);
      });
    },
  },

  methods: {
    ...mapActions({
      getMenusByModule: "module/getMenusByModule",
      getModuleBySlug: "module/getModuleBySlug",
      getPermissionsByModule: "module/getPermissionsByModule",
    }),
    splitRoute(route) {
      const split = route.split("/");
      return split[2];
    },
  },
};
</script>

<style scoped></style>
