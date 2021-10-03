<template>
  <v-container>
    <v-row class="mt-12">
      <v-col
        v-for="module in modulesByRoles"
        :key="module.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-hover v-slot="{ hover }">
          <v-card
            :dark="hover"
            :color="hover ? 'primary' : ''"
            :class="{ 'on-hover': hover }"
            :elevation="hover ? 12 : 2"
            flat
            :to="{ name: module.url, params: { slug: module.slug } }"
          >
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar
                  class="mt-6"
                  size="64"
                  :color="!hover ? 'primary' : 'white'"
                >
                  <v-icon :color="hover ? 'primary' : 'white'" large>{{
                    module.icon
                  }}</v-icon>
                </v-avatar>
                <h2 class="mt-5 text-h5">{{ module.name }}</h2>
                <p class="text-caption mt-1">text</p>
              </div>
            </v-list-item-content>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Index",
  mounted() {
    if (this.modulesByLaboratory.length === 0) {
      this.getModulesByLaboratory(1);
    }
  },

  watch: {
    modules() {
      this.getAllMenusFromModules(this.modulesKeys);
    },
  },

  computed: {
    ...mapGetters({
      modulesByLaboratory: "laboratory/modulesByLaboratory",
      modules: "auth/modules",
      modulesKeys: "auth/modulesKeys",
    }),

    //se muestran sólo los módulos que contengan al menos un menu con privilegios de lectura (index)
    //extraido de los permissions al momento de hacer login
    modulesByRoles() {
      return this.modulesByLaboratory.filter((module) => {
        console.log(module);
        return Object.values(this.modulesKeys).includes(module.slug);
      });
    },
  },
  methods: {
    ...mapActions({
      getModulesByLaboratory: "laboratory/getModulesByLaboratory",
      getAllMenusFromModules: "auth/allModulesWithPermissions",
    }),
  },
};
</script>

<style scoped>
.v-card {
  transition: opacity 0.4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.8;
}
</style>
