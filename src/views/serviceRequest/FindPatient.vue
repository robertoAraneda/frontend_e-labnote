<template>
  <v-container>
    <v-card elevation="0">
      <v-tabs grow v-model="tabs" slider-color="white">
        <v-tabs-slider></v-tabs-slider>
        <v-tab href="#mobile-tabs-5-1"> POR NÚMERO DE IDENTIFICACIÓN </v-tab>

        <v-tab href="#mobile-tabs-5-2"> POR DATOS DEMOGRÁFICOS </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabs">
        <v-tab-item value="mobile-tabs-5-1">
          <v-card flat>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="4">
                  <BaseSelect
                    :items="identifierTypes"
                    item-text="display"
                    item-value="id"
                    label="Tipo documento"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <BaseTextfield
                    v-model="editedItem.father_family"
                    label="Primer apellido"
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
        </v-tab-item>
        <v-tab-item value="mobile-tabs-5-2">
          <v-card flat>
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
        </v-tab-item>
      </v-tabs-items>
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
          small
          label="Seleccionar"
          class="float-right"
        ></base-accept-button>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "FindPatient",

  data: () => ({
    tabs: null,
    editedItem: {
      given: "",
      father_family: "araneda",
      mother_family: "",
    },
    selectedSpecimenCode: "TODAS LAS MUESTRAS",
    selectedObservations: [],
    searchObservation: "",
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

  mounted() {
    this.getIdentifierTypes();
  },

  computed: {
    ...mapGetters({
      patients: "patient/patients",
      identifierTypes: "patient/identifierTypes",
    }),
  },

  methods: {
    ...mapActions({
      findPatientByNames: "patient/findPatientByNames",
      getIdentifierTypes: "patient/getIdentifierTypes",
      findPatientByIdentifier: "patient/findPatientByIdentifier",
      setPatient: "serviceRequest/setPatient",
    }),

    async handleSelectedPatient(item) {
      await this.setPatient(item);

      console.log(item);
      this.$nextTick(() => {
        //this.dialog = true;
        this.$router.push({ name: "createServiceRequest" });
      });
    },
  },
};
</script>

<style scoped></style>
