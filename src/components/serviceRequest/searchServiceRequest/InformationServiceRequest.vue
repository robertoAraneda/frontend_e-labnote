<template>
  <ContainerDetailServiceRequest :title="title">
    <template v-slot:default>
      <v-list class="transparent">
        <v-list-item dense v-for="item in specimens" :key="item.specimen.id">
          <v-list-item-avatar>
            <v-icon size="24">{{
              handleIconStatus(item.specimen_status.display)
            }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="overline"
              v-html="item.specimen.accession_identifier"
            ></v-list-item-title>
            <v-list-item-subtitle
              v-html="item.container.name"
            ></v-list-item-subtitle>
            <v-list-item-subtitle
              ><v-chip color="secondary" x-small outlined>{{
                item.specimen_code.display
              }}</v-chip></v-list-item-subtitle
            >
          </v-list-item-content>
          <v-list-item-action>
            <v-chip
              small
              v-html="item.specimen_status.display"
              class="ma-2"
              :color="handleColorStatus(item.specimen_status.display)"
            >
            </v-chip
          ></v-list-item-action>
        </v-list-item>
      </v-list>
    </template>
  </ContainerDetailServiceRequest>
</template>

<script>
import ContainerDetailServiceRequest from "./ContainerDetailServiceRequest";
export default {
  name: "InformationServiceRequest",
  components: { ContainerDetailServiceRequest },
  props: {
    serviceRequest: Object,
  },

  data: () => ({
    title: "Estado de muestras",
  }),

  computed: {
    specimens() {
      return this.serviceRequest._links.specimens.collection;
    },

    performer() {
      return `${this.serviceRequest._embedded.performer.given} ${this.serviceRequest._embedded.performer.family}`;
    },
  },

  methods: {
    handleColorStatus(status) {
      switch (status) {
        case "PENDIENTE":
          return "warning";
        case "DISPONIBLE":
          return "success";
        case "ERROR":
          return "error";
        default:
          return "secondary";
      }
    },

    handleIconStatus(status) {
      switch (status) {
        case "PENDIENTE":
          return "mdi-test-tube-empty";
        case "DISPONIBLE":
          return "mdi-test-tube";
        default:
          return "mdi-test-tube-off";
      }
    },
  },
};
</script>

<style scoped></style>
