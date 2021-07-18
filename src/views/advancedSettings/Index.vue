<template>
  <div>
    <NavigationDrawer :links="menus" />
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NavigationDrawer from "../../components/navbar/NavigationDrawer";
export default {
  name: "Index",
  components: { NavigationDrawer },
  data: () => ({}),
  mounted() {
    const slug = this.splitRoute(this.$route.path);
    this.getModuleBySlug(slug);
  },
  computed: {
    ...mapGetters({
      menusByModule: "module/menusByModule",
      currentModule: "module/currentModule",
    }),
    menus() {
      if (!this.currentModule) return [];
      return this.currentModule.menus;
    },
  },
  methods: {
    ...mapActions({
      getMenusByModule: "module/getMenusByModule",
      getModuleBySlug: "module/getModuleBySlug",
    }),
    splitRoute(route) {
      const split = route.split("/");
      return split[2];
    },
  },
};
</script>

<style scoped></style>
