<template>
  <v-container>
    <v-card>
      <v-container fluid>
        <v-card elevation="0">
          <v-subheader class="font-weight-bold">Datos demográficos</v-subheader>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  dense
                  v-model="serviceRequest.patient.name.given"
                  label="Nombre"
                  disabled
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  dense
                  disabled
                  v-model="serviceRequest.patient.name.father_family"
                  label="Primer apellido"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  dense
                  disabled
                  v-model="serviceRequest.patient.name.mother_family"
                  label="Segundo apellido"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  outlined
                  dense
                  disabled
                  v-model="serviceRequest.patient.birthdate"
                  label="Fecha de nacimiento"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  outlined
                  dense
                  v-model="serviceRequest.patient.age"
                  disabled
                  label="Edad"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  dense
                  outlined
                  v-model="serviceRequest.patient.insurance"
                  label="Previsión"
                  :items="['FONASA', 'ISAPRE']"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="0">
          <v-subheader class="font-weight-bold">Datos procedencia</v-subheader>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <BaseAutocomplete
                  dense
                  outlined
                  v-model="serviceRequest.location_id"
                  :items="locations"
                  flat
                  placeholder="Seleccione:"
                  item-value="id"
                  item-text="name"
                  label="Ubicación"
                ></BaseAutocomplete>
              </v-col>

              <v-col cols="12" md="4">
                <BaseAutocomplete
                  dense
                  outlined
                  v-model="serviceRequest.performer_id"
                  :items="practitioners"
                  flat
                  placeholder="Seleccione:"
                  item-value="id"
                  item-text="name"
                  label="Profesional solicitante"
                ></BaseAutocomplete>
              </v-col>

              <v-col cols="12" md="4">
                <v-menu
                  v-model="issuedDateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      v-model="computedDateFormatted"
                      label="Fecha"
                      hint="Formato DD/MM/YYYY"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                    @input="issuedDateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field dense outlined label="Diagnóstico"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="serviceRequest.note"
                  dense
                  outlined
                  label="Observaciones"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <BaseAutocomplete
                  dense
                  outlined
                  v-model="serviceRequest.service_request_priority_id"
                  :items="serviceRequestPriorities"
                  flat
                  placeholder="Seleccione:"
                  item-value="id"
                  item-text="display"
                  label="Prioridad"
                ></BaseAutocomplete>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>
        <v-subheader class="font-weight-bold"
          >Selección de exámenes</v-subheader
        >
        <v-spacer />
        <v-btn
          @click="handleOpenAdvancedSelecionDialog"
          color="primary"
          rounded
          small
          >Selección avanzada
        </v-btn>
      </v-card-title>

      <v-toolbar elevation="0" tile dark color="primary">
        <BaseAutocomplete
          solo-inverted
          hide-no-data
          hide-details
          v-model="selectedSpecimenCode"
          :items="specimenCodes"
          dense
          flat
          placeholder="Seleccione:"
          label="Tipo muestra"
        ></BaseAutocomplete>
        <v-spacer />
        <BaseAutocomplete
          solo-inverted
          hide-no-data
          hide-details
          :items="observations"
          v-model="selectedObservation"
          flat
          dense
          placeholder="Seleccione:"
          item-value="id"
          item-text="name"
          label="Exámenes"
          prepend-icon="mdi-magnify"
          @change="test"
        ></BaseAutocomplete>
      </v-toolbar>
      <v-card-text class="overflow-y-auto" :style="{ height: '350px' }">
        <v-card elevation="0" v-if="defaultObservations.length > 0">
          <v-list
            :style="{ position: 'sticky' }"
            height="60"
            dense
            color="grey lighten-3"
          >
            <v-list-item class="font-weight-bold">
              <v-list-item-avatar> N° </v-list-item-avatar>
              <v-list-item-avatar width="100"> LOINC </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  NOMBRE EXAMEN
                  <v-chip class="ml-2" color="secondary" label x-small>
                    TIPO MUESTRA
                  </v-chip></v-list-item-title
                >
              </v-list-item-content>
              <v-list-item-action>OPCIONES</v-list-item-action>
            </v-list-item>
          </v-list>
          <v-slide-y-transition class="py-0" group tag="v-list">
            <template v-for="(observation, i) in defaultObservations">
              <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>
              <v-list-item link dense :key="observation.id">
                <v-list-item-avatar>
                  {{ i + 1 }}
                </v-list-item-avatar>
                <v-list-item-avatar width="100">
                  {{ observation.loinc_num }}
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ observation.core_name }}
                    <v-chip class="ml-2" color="warning" label x-small>
                      {{ observation.specimen_code }}
                    </v-chip></v-list-item-title
                  >
                </v-list-item-content>

                <v-scroll-x-transition>
                  <v-btn icon>
                    <v-icon
                      @click="deleteObservation(observation)"
                      v-if="observation.id"
                      color="error"
                    >
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </v-scroll-x-transition>
              </v-list-item>
            </template>
          </v-slide-y-transition>
        </v-card>
      </v-card-text>
      <v-card-actions
        ><v-spacer /><v-btn
          @click="handleCreateServiceRequest"
          color="primary"
          rounded
          >Crear solicitud</v-btn
        ></v-card-actions
      >
    </v-card>
    <v-dialog scrollable v-model="advancedSelectionDialog">
      <v-card>
        <v-card-text style="height: 800px">
          <v-subheader class="font-weight-bold"
            >Selección avanzada de exámenes</v-subheader
          >

          <v-row>
            <v-col cols="8">
              <v-toolbar dark color="primary">
                <BaseAutocomplete
                  solo-inverted
                  hide-no-data
                  hide-details
                  v-model="selectedSpecimenCode"
                  :items="specimenCodes"
                  flat
                  placeholder="Seleccione:"
                  label="Tipo muestra"
                ></BaseAutocomplete>
                <v-spacer />
                <v-text-field
                  solo-inverted
                  hide-no-data
                  hide-details
                  label="Buscar examen"
                  v-model="searchObservation"
                ></v-text-field>
              </v-toolbar>
              <v-card class="overflow-y-auto">
                <v-card-text :style="{ height: '668px' }">
                  <v-row v-if="selectedSpecimenCode === 'TODAS LAS MUESTRAS'">
                    <v-col
                      cols="12"
                      v-for="specimen in specimenCodes"
                      :key="specimen.id"
                    >
                      <v-card
                        class="mt-n2"
                        color="grey lighten-5"
                        elevation="0"
                        v-if="
                          specimen !== 'TODAS LAS MUESTRAS' &&
                          extendedObservation[specimen] !== undefined
                        "
                      >
                        <v-card-text>
                          <v-subheader class="font-weight-bold">{{
                            specimen
                          }}</v-subheader>

                          <v-row class="mt-10">
                            <v-col
                              class="mt-n12"
                              v-for="observation in extendedObservation[
                                specimen
                              ]"
                              :key="observation.id"
                              cols="4"
                            >
                              <v-checkbox
                                dense
                                v-model="selectedObservations"
                                :value="observation.id"
                              >
                                <template v-slot:label
                                  ><span class="body-2">
                                    {{ observation.name }}</span
                                  >
                                </template>
                              </v-checkbox>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                      <v-card
                        class="mt-n2"
                        color="grey lighten-5"
                        elevation="0"
                        v-else-if="specimen !== 'TODAS LAS MUESTRAS'"
                      >
                        <v-card-text>
                          <v-subheader class="font-weight-bold">{{
                            specimen
                          }}</v-subheader>
                          <p>
                            No se han encontrado exámenes para este tipo de
                            muestra
                          </p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row v-else>
                    <v-col>
                      <v-card class="mt-3" color="grey lighten-5" elevation="0">
                        <v-card-text>
                          <v-subheader class="font-weight-bold">{{
                            selectedSpecimenCode
                          }}</v-subheader>
                          <v-row class="mt-10">
                            <v-col
                              class="mt-n12"
                              v-for="observation in extendedObservation[
                                selectedSpecimenCode
                              ]"
                              :key="observation.id"
                              cols="4"
                            >
                              <v-checkbox
                                dense
                                v-model="selectedObservations"
                                :value="observation.id"
                              >
                                <template v-slot:label
                                  ><span class="body-2">
                                    {{ observation.name }}</span
                                  >
                                </template>
                              </v-checkbox>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card
                elevation="0"
                class="mt-n10"
                :style="{
                  position: 'sticky',
                  top: '10px',
                }"
              >
                <v-toolbar elevation="0">
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="advancedSelectionDialog = false"
                    icon
                    class="mr-n6 mt-n8"
                    ><v-icon>mdi-close</v-icon></v-btn
                  ></v-toolbar
                >

                <v-card class="mt-n7">
                  <v-toolbar color="primary" dark flat tile>
                    <v-toolbar-title>Exámenes seleccionados</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-toolbar-title>
                      Total:

                      {{
                        observationAdvancedSelection.numberOfSelectedObservations
                      }}
                    </v-toolbar-title>
                  </v-toolbar>
                  <v-virtual-scroll
                    :items="detailObservation"
                    :item-height="50"
                    height="670"
                  >
                    <template v-slot:default="{ item, index }">
                      <v-list-item>
                        <v-list-item-avatar>
                          {{ index + 1 }}
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="item.name"
                          ></v-list-item-title>
                          <v-list-item-subtitle>
                            LOINC: {{ item.loinc_num }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon
                            @click="deleteObservation(item)"
                            color="error"
                          >
                            mdi-close
                          </v-icon>
                        </v-list-item-action>
                      </v-list-item>
                    </template>
                  </v-virtual-scroll>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { groupBy } from "../../helpers/Functions";
import moment from "moment";

export default {
  name: "ServiceRequest",

  data: (vm) => ({
    serviceRequest: {
      patient: {
        name: {
          given: "",
          mother_family: "",
          father_family: "",
        },
        birthdate: "",
        age: "",
        insurance: "",
      },
      note: "",
      patient_id: "",
      location_id: null,
      performer_id: null,
      occurrence: "",
      service_request_priority_id: null,
      isReady: false,
      observations: [],
      specimens: [],
    },

    selectedSpecimenCode: "TODAS LAS MUESTRAS",
    selectedObservations: [],
    selectedSpecimens: [],
    searchObservation: "",
    advancedSelectionDialog: false,
    selectedObservation: "",
    scrollTop: 0,
    issuedDateMenu: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
  }),

  watch: {
    advancedSelectionDialog() {
      this.selectedSpecimenCode = "TODAS LAS MUESTRAS";
    },

    defaultObservations() {
      const groupedObservationByContainer = groupBy(
        this.defaultObservations,
        "container_id"
      );
      this.selectedSpecimens = Object.keys(groupedObservationByContainer).map(
        (container) => {
          return {
            container_id: parseInt(container),
            specimen_code_id:
              groupedObservationByContainer[container][0].specimen_id,
            patient_id: this.serviceRequest.patient_id,
          };
        }
      );

      console.log(groupBy(this.defaultObservations, "container_id"));
    },
  },

  mounted() {
    if (!this.patient) {
      this.$router.push({ name: "findPatient" });
    } else {
      this.serviceRequest.patient.name = this.patient.name[0];
      this.serviceRequest.patient.birthdate = this.patient.birthdate;
      this.serviceRequest.patient_id = this.patient.id;

      const currentDate = moment();
      const momentBirthDatePatient = moment(this.patient.birthdate);

      this.serviceRequest.patient.age = currentDate.diff(
        momentBirthDatePatient,
        "years"
      ); // 1
    }

    this.getLocations();
    this.getPractitioners();
    this.getObservations();
    this.getSpecimenCodes();
    this.getServiceRequestStatuses();
  },

  filters: {
    transformDates(date) {
      const [year, month, day] = date.split("-");
      return `${day}-${month} ${year}`;
    },
  },
  computed: {
    ...mapGetters({
      _locations: "location/locations",
      _practitioners: "practitioner/practitioners",
      _observations: "observationServiceRequest/observationServiceRequests",
      _specimenCodes: "specimen/specimens",
      _serviceRequestPriorities: "serviceRequest/serviceRequestPriorities",
      patient: "serviceRequest/patient",
    }),

    computedDateFormatted() {
      return this.formatDate(this.date);
    },

    locations() {
      return this._locations.collection;
    },
    practitioners() {
      if (this._practitioners.length === 0) return [];
      return this._practitioners.collection.map((practitioner) => {
        return {
          id: practitioner.id,
          name: `${practitioner.rut} - ${practitioner.given} ${practitioner.family}`,
        };
      });
    },

    serviceRequestPriorities() {
      if (this._serviceRequestPriorities.length === 0) return [];
      return this._serviceRequestPriorities.collection;
    },

    observations() {
      if (this._observations.length === 0) return [];
      return this._observations.collection
        .map((observation) => {
          return {
            id: observation.id,
            name: `(${observation.loinc_num}) ${observation.name}`,
            specimen_code: observation.specimen_code,
          };
        })
        .filter((observation) => {
          console.log(observation);
          if (this.selectedSpecimenCode === "TODAS LAS MUESTRAS")
            return (
              observation && !this.selectedObservations.includes(observation.id)
            );
          return (
            observation.specimen_code === this.selectedSpecimenCode &&
            !this.selectedObservations.includes(observation.id)
          );
        });
    },

    defaultObservations() {
      if (this._observations.length === 0) return [];

      const defaultObservations = [];

      this._observations.collection.forEach((observation) => {
        if (this.selectedObservations.includes(observation.id)) {
          defaultObservations.unshift(observation);
        }
      });

      return defaultObservations;
    },

    extendedObservation() {
      if (this._observations.length === 0) return [];

      const observation = this._observations.collection
        .map((observation) => {
          return {
            id: observation.id,
            name: `(${observation.loinc_num}) ${observation.core_name}`,
            specimen_code: observation.specimen_code,
          };
        })
        .filter((observation) => {
          if (this.selectedSpecimenCode === "TODAS LAS MUESTRAS")
            return (
              observation &&
              (observation.name || "")
                .toLowerCase()
                .indexOf((this.searchObservation || "").toLowerCase()) > -1
            );
          return (
            observation.specimen_code === this.selectedSpecimenCode &&
            (observation.name || "")
              .toLowerCase()
              .indexOf((this.searchObservation || "").toLowerCase()) > -1
          );
        });

      return groupBy(observation, "specimen_code");
    },

    detailObservation() {
      if (this._observations.length === 0) return [];
      return this._observations.collection.filter((observation) => {
        return this.selectedObservations.some((selected) => {
          return observation.id === selected;
        });
      });
    },

    observationAdvancedSelection() {
      if (this._observations.length === 0) return [];
      const observations = this._observations.collection.filter(
        (observation) => {
          return this.selectedObservations.some((selected) => {
            return observation.id === selected;
          });
        }
      );

      const groupedObservations = groupBy(observations, "specimen_code");

      const samples = Object.keys(groupedObservations);

      return {
        numberOfSelectedObservations: observations.length,
        detail: samples.map((sample) => {
          return {
            name: sample,
            children: groupedObservations[sample].map((observation) =>
              Object.assign(observation, { divider: true })
            ),
          };
        }),
      };
    },

    specimenCodes() {
      if (this._specimenCodes.length === 0) return [];

      const specimens = this._specimenCodes.collection.map(
        (specimen) => `${specimen.display}`
      );

      specimens.unshift("TODAS LAS MUESTRAS");
      return specimens;
    },
  },

  methods: {
    ...mapActions({
      getLocations: "location/getItems",
      getPractitioners: "practitioner/getItems",
      getObservations: "observationServiceRequest/getItems",
      getSpecimenCodes: "specimen/getItems",
      getServiceRequestStatuses: "serviceRequest/getServiceRequestPriorities",
      create: "serviceRequest/postItem",
    }),

    async handleCreateServiceRequest() {
      this.serviceRequest.observations = Object.keys(
        groupBy(this.defaultObservations, "id")
      ).map((observation) => {
        return {
          service_request_observation_code_id: parseInt(observation),
        };
      });
      this.serviceRequest.specimens = this.selectedSpecimens;
      this.serviceRequest.occurrence = this.date;

      await this.create(this.serviceRequest);

      console.log(this.serviceRequest);
    },

    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },

    onScroll(e) {
      this.scrollTop = e.target.scrollTop;
    },

    handleOpenAdvancedSelecionDialog() {
      this.advancedSelectionDialog = true;
    },

    test(observation) {
      this.selectedObservations.push(observation);
      this.selectedObservation = "";
    },

    deleteObservation(observation) {
      const index = this.selectedObservations.indexOf(observation.id);

      this.selectedObservations.splice(index, 1);

      this.selectedObservation = 0;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
