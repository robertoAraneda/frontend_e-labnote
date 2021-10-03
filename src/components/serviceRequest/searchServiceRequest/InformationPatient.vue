<template>
  <ContainerDetailServiceRequest :title="title">
    <template v-slot:default>
      <v-list three-line>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon size="48">mdi-account-circle</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ fullName }}</v-list-item-title>

            <v-list-item-subtitle class="subtitle-1"
              >Cruz Blanca</v-list-item-subtitle
            >

            <v-list-item-subtitle class="subtitle-1"
              >Uci adulto</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </ContainerDetailServiceRequest>
</template>

<script>
import ContainerDetailServiceRequest from "./ContainerDetailServiceRequest";
export default {
  name: "InformationPatient",

  components: { ContainerDetailServiceRequest },

  data: () => ({
    title: "Información paciente",
  }),

  props: {
    patient: Object,
  },

  computed: {
    fullName() {
      return `${this.patient.name[0].given} ${this.patient.name[0].father_family} ${this.patient.name[0].mother_family}`;
    },
  },
};
</script>

<style scoped></style>
