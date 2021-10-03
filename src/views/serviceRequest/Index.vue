<template>
  <!-- <v-container>
    <NavigationDrawer :links="menus" />
    <LoggedNavbar />
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-container>
  -->
  <div>
    <NavigationDrawer :links="menusPermissions" />
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NavigationDrawer from "../../components/navbar/NavigationDrawer";
//import LoggedNavbar from "../../components/navbar/LoggedNavbar";
export default {
  name: "Index",
  components: {
    //LoggedNavbar,
    NavigationDrawer,
  },
  data: () => ({
    current: null,
  }),
  mounted() {
    /*
    const slug = this.splitRoute(this.$route.path);
    this.getModuleBySlug(slug);

     */

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
