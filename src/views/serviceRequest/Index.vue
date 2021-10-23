<template>
  <div>
    <NavigationDrawer :links="menusPermissions" />
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NavigationDrawer from "../../components/navbar/NavigationDrawer";
export default {
  name: "Index",
  components: {
    NavigationDrawer,
  },
  data: () => ({
    current: null,
  }),
  mounted() {
    if (this.modules) {
      const slug = this.splitRoute(this.$route.path);

      this.setCurrentModule(this.modules[slug]);
    }
  },

  watch: {
    modules() {
      const slug = this.splitRoute(this.$route.path);

      this.setCurrentModule(this.modules[slug]);
    },
  },

  computed: {
    ...mapGetters({
      menusByModule: "module/menusByModule",
      currentModule: "auth/currentModule",
      menusByModules: "auth/currentMenusByModules",
      namedPermissionsForMenu: "auth/namedPermissionsForMenu",
      modules: "auth/modules",
    }),
    menus() {
      if (!this.currentModule) return [];
      return this.currentModule.menus;
    },

    menusPermissions() {
      if (!this.currentModule) return [];
      return this.currentModule
        .filter((menu) => {
          console.log(menu);
          return this.namedPermissionsForMenu.includes(menu.name);
        })
        .map(({ menu }) => {
          return menu;
        });
    },
  },
  methods: {
    ...mapActions({
      getMenusByModule: "module/getMenusByModule",
      getModuleBySlug: "module/getModuleBySlug",
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
