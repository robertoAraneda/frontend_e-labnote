<template>
  <div>
    <v-card elevation="0">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <BaseTextfield v-model="editedItem.given" label="Nombres" />
          </v-col>
          <v-col cols="12" sm="4">
            <BaseTextfield
              v-model="editedItem.father_family"
              label="Primer apellido"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <BaseTextfield
              v-model="editedItem.mother_family"
              label="Segundo apellido"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <base-accept-button
              label="Buscar"
              class="float-right mb-3"
              @click="findPatientByNames(editedItem)"
            ></base-accept-button>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-data-table
      v-if="patients.length !== 0"
      :headers="headers"
      :items="patients"
      class="elevation-0 mt-3"
      hide-default-footer
    >
      <template v-slot:item.options="{ item }">
        <base-accept-button
          @click="handleSelectedPatient(item)"
          x-small
          label="Seleccionar"
        ></base-accept-button>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ServiceRequest",

  data: () => ({
    editedItem: {
      given: "",
      father_family: "araneda",
      mother_family: "",
    },
    headers: [
      {
        text: "N° Documento",
        value: "identifier[0].value",
        sortable: true,
      },
      {
        text: "Nombre",
        value: "name[0].given",
        sortable: true,
      },
      {
        text: "Primer apellido",
        value: "name[0].father_family",
        sortable: true,
      },
      {
        text: "Segundo apellido",
        value: "name[0].mother_family",
        sortable: true,
      },
      {
        text: "",
        value: "options",
      },
    ],
  }),

  computed: {
    ...mapGetters({
      patients: "patient/patients",
    }),
  },

  methods: {
    ...mapActions({
      findPatientByNames: "patient/findPatientByNames",
    }),

    handleSelectedPatient(item) {
      console.log(item);
    },
  },
};
</script>

<style scoped></style>
