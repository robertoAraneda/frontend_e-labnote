<template>
  <v-container>
    <v-row class="mt-12">
      <v-col
        v-for="module in modulesByRoles"
        :key="module.id"
        cols="12"
        sm="6"
        md="4"
        lg="4"
        xl="3"
        class="text-center"
      >
        <v-hover v-slot="{ hover }">
          <v-card
            class="py-12 px-4"
            :dark="hover"
            :color="hover ? 'primary' : ''"
            :class="{ 'on-hover': hover }"
            :elevation="hover ? 12 : 0"
            flat
            :to="{ name: module.url, params: { slug: module.slug } }"
          >
            <v-theme-provider dark>
              <div>
                <v-avatar :color="!hover ? 'primary' : 'white'" size="88">
                  <v-icon
                    :color="hover ? 'primary' : 'white'"
                    large
                    v-text="module.icon"
                  />
                </v-avatar>
              </div>
            </v-theme-provider>

            <v-card-title
              v-text="module.name"
              class="justify-center font-weight-black text-uppercase subtitle-1"
              >Tiempo de respuesta</v-card-title
            >
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
