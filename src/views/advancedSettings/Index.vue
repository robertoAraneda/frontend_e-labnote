<template>
  <div>
    <NavigationDrawer :links="menusPermissions" />
    <v-container>
      <router-view />
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

      // this.current = this.modules[slug];

      this.setCurrentModule(this.modules[slug]);

      //  console.log(this.current);
    },
  },

  computed: {
    ...mapGetters({
      menusByModule: "module/menusByModule",
      menusByModules: "auth/currentMenusByModules",
      namedPermissionsForMenu: "auth/namedPermissionsForMenu",
      modules: "auth/modules",
      currentModule: "auth/currentModule",
    }),

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

    menus() {
      if (!this.currentModule) return [];
      return this.currentModule.menus;
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
