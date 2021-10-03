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

  data: () => ({
    current: null,
  }),
  async mounted() {
    if (this.modules) {
      const slug = this.splitRoute(this.$route.path);

      //this.current = this.modules[slug];
      this.setCurrentModule(this.modules[slug]);
    }
  },

  watch: {
    modules() {
      const slug = this.splitRoute(this.$route.path);

      //this.current = this.modules[slug];
      this.setCurrentModule(this.modules[slug]);
    },
  },

  computed: {
    ...mapGetters({
      menusByModule: "module/menusByModule",
      currentModule: "auth/currentModule",
      roleUserLogged: "auth/role",
      permissionName: "auth/namedPermissions",
      namedPermissionsForMenu: "auth/namedPermissionsForMenu",
      menusByModules: "auth/currentMenusByModules",
      modules: "auth/modules",
    }),

    menusPermissions() {
      if (!this.currentModule) return [];
      return this.currentModule
        .filter((menu) => {
          return this.namedPermissionsForMenu.includes(menu.name);
        })
        .map(({ menu }) => {
          console.log();
          return menu;
        });
    },
  },

  methods: {
    ...mapActions({
      getMenusByModule: "module/getMenusByModule",
      getModuleBySlug: "module/getModuleBySlug",
      getPermissionsByModule: "module/getPermissionsByModule",
      setCurrentModule: "auth/setCurrentModule",
    }),
    splitRoute(route) {
      const split = route.split("/");
      return split[2];
    },
  },
};
</script>

<style scoped></style>
