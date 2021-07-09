<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="module in modulesByLaboratory" :key="module.id" cols="4">
        <v-card :to="{ name: module.url, params: { slug: module.slug } }">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">MÓDULO</div>
              <v-list-item-title class="text-h5 mb-1">
                {{ module.name }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar
              tile
              size="80"
              color="primary"
            ></v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Index",
  mounted() {
    this.getModulesByLaboratory(1);
  },
  computed: {
    ...mapGetters({
      modulesByLaboratory: "laboratory/modulesByLaboratory",
    }),
  },
  methods: {
    ...mapActions({
      getModulesByLaboratory: "laboratory/getModulesByLaboratory",
    }),
  },
};
</script>

<style scoped></style>
