<template>
  <div>
    <BaseHeaderModule
      title="Módulo de solicitud de medios."
      subtitle="En éste módulo podrás gestionar pacientes y sus solicitudes de exámenes."
    />
    <v-row class="mt-12">
      <v-col
        v-for="menu in menus"
        :key="menu.id"
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
            :elevation="hover ? 12 : 0"
            flat
            :to="{ name: menu.url }"
          >
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar
                  class="mt-6"
                  size="48"
                  :color="!hover ? 'primary' : 'white'"
                >
                  <v-icon :color="hover ? 'primary' : 'white'">{{
                    menu.icon
                  }}</v-icon>
                </v-avatar>
                <h2 class="mt-5 subtitle-1">{{ menu.name }}</h2>
              </div>
            </v-list-item-content>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "BaseIndex",

  computed: {
    ...mapGetters({
      currentModule: "auth/currentModule",
    }),

    menus() {
      if (!this.currentModule) return [];
      return this.currentModule.map(({ menu }) => menu);
    },
  },
  methods: {
    ...mapActions({
      getModulesByLaboratory: "laboratory/getModulesByLaboratory",
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
