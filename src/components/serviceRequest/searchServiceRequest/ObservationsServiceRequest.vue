<template>
  <ContainerDetailServiceRequest :title="title">
    <template v-slot:default>
      <v-text-field
        v-model="search"
        dense
        outlined
        placeholder="Buscar"
      ></v-text-field>

      <v-virtual-scroll
        :items="filteredObservations"
        :item-height="50"
        height="300"
        class="mt-n6"
      >
        <template v-slot:default="{ index, item }">
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar color="primary" size="24" class="white--text"
                >{{ index + 1 }}
              </v-avatar>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn depressed small>
                {{ item.loinc_num }}
                <v-icon color="orange darken-4" right> mdi-open-in-new </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
    </template>
  </ContainerDetailServiceRequest>
</template>

<script>
import ContainerDetailServiceRequest from "./ContainerDetailServiceRequest";
export default {
  name: "ObservationsServiceRequest",

  components: { ContainerDetailServiceRequest },

  props: {
    observations: Array,
  },

  data: () => ({
    search: "",
    title: "Exámenes solicitados",
  }),

  computed: {
    filteredObservations() {
      return this.observations.filter((analyte) => {
        return (
          analyte &&
          (analyte.name || "")
            .toLowerCase()
            .indexOf((this.search || "").toLowerCase()) > -1
        );
      });
    },
  },
};
</script>

<style scoped></style>
