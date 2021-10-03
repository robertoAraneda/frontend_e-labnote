<template>
  <v-container>
    <v-card elevation="0">
      <v-tabs grow v-model="tabs" slider-color="white">
        <v-tabs-slider></v-tabs-slider>
        <v-tab href="#mobile-tabs-5-1"> POR NÚMERO DE SOLICITUD</v-tab>

        <v-tab href="#mobile-tabs-5-2"> POR DATOS PACIENTE </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabs">
        <v-tab-item value="mobile-tabs-5-1">
          <v-card flat>
            <v-card-text class="mt-6">
              <v-row justify="center">
                <v-col cols="6">
                  <v-text-field
                    v-model="serviceRequestIdentifier"
                    placeholder="Número solicitud"
                    label="Número solicitud"
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <base-accept-button
                    label="Buscar"
                    class="float-right mb-3"
                    @click="handleServiceRequestByIdentifier"
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
                  <BaseSelect
                    v-model="editedItem.identifierType"
                    :items="identifierTypes"
                    item-text="display"
                    item-value="id"
                    label="Tipo documento"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <BaseTextfield
                    v-model="editedItem.identifier"
                    label="Número de documento"
                  />
                </v-col>
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
                    @click="handleSearchServiceRequestByPatient"
                  ></base-accept-button>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="foundServiceRequests"
      class="elevation-0 mt-3"
      show-group-by
    >
      <template v-slot:top>
        <v-subheader class="subtitle-1">Lista de solicitudes</v-subheader>
      </template>
      <template v-slot:item._embedded.patient="{ item }">
        {{ prueba(item._embedded.patient) }}
      </template>
      <template v-slot:item.options="{ item }">
        <v-btn
          x-small
          rounded
          color="primary"
          depressed
          @click="openDetailServiceRequestDialog(item)"
          >Ver</v-btn
        >
      </template>

      <template v-slot:group.header="{ group, remove }">
        <div class="white mr-n12">
          <v-chip @click="remove" class="ma-2" color="primary" outlined>
            <strong>{{ group }}</strong>
            <v-icon right> mdi-close </v-icon>
          </v-chip>
        </div>
      </template>
    </v-data-table>

    <DialogDetailServiceRequest
      v-if="serviceRequestSelected"
      :service-request="serviceRequestSelected"
      v-model="detailServiceRequestDialog"
    />

    <v-card
      class="mt-3 pb-3"
      elevation="0"
      v-if="foundServiceRequests.length > 0"
    >
      <v-subheader class="subtitle-1">Lista de solicitudes</v-subheader>
      <v-expansion-panels inset tile v-model="panel">
        <v-expansion-panel
          v-for="serviceRequest in foundServiceRequests"
          :key="serviceRequest.id"
        >
          <v-expansion-panel-header class="elevation-0">
            <template v-slot="{ open }">
              <v-fade-transition leave-absolute>
                <v-row class="align-center" v-if="open">
                  <v-spacer />
                  <v-col cols="3">
                    <v-chip class="ma-2" color="error accent-4" outlined>
                      <v-icon left> mdi-hospital-box-outline</v-icon>
                      <strong>Prioridad &colon;</strong>
                      {{ serviceRequest._embedded.priority.name }}
                    </v-chip></v-col
                  >
                  <v-col cols="3">
                    <v-chip class="ma-2" color="orange darken-4" outlined>
                      <v-icon left>mdi-alert-circle-outline</v-icon>
                      <strong>Estado &colon; </strong>
                      {{ serviceRequest._embedded.status.name }}
                    </v-chip></v-col
                  >
                  <v-col cols="3">
                    <strong class="headline text-h4">
                      N° {{ serviceRequest.requisition }}</strong
                    >
                  </v-col>
                </v-row>

                <v-row v-else align="center" class="spacer" no-gutters>
                  <v-col cols="4" sm="2" md="1">
                    <v-avatar size="36px">
                      <v-icon color="primary"> mdi-cog</v-icon>
                    </v-avatar>
                  </v-col>

                  <v-col class="hidden-xs-only" sm="4" md="2">
                    <strong
                      class="text-body-1"
                      v-html="serviceRequest.requisition"
                    ></strong>
                  </v-col>

                  <v-col cols="8" sm="4">
                    <strong
                      v-html="
                        serviceRequest._embedded.patient.name[0].given +
                        ' ' +
                        serviceRequest._embedded.patient.name[0].father_family +
                        ' ' +
                        serviceRequest._embedded.patient.name[0].mother_family
                      "
                    ></strong>
                    <p v-html="serviceRequest._embedded.location.name"></p>
                  </v-col>
                  <v-col class="text-truncate hidden-sm-and-down">
                    <span
                      v-html="'Fecha solicitud: ' + serviceRequest.occurrence"
                    ></span>
                    <p>
                      <v-chip
                        color="warning lighten-2"
                        class="ml-0 mr-2 black--text"
                        label
                        small
                      >
                        Estado: {{ serviceRequest._embedded.status.name }}
                      </v-chip>
                      <v-chip
                        color="success lighten-2"
                        class="ml-0 mr-2 black--text"
                        label
                        small
                      >
                        Prioridad:
                        {{ serviceRequest._embedded.priority.name }}
                      </v-chip>
                    </p>
                  </v-col>
                </v-row>
              </v-fade-transition>
            </template>
          </v-expansion-panel-header>

          <v-expansion-panel-content eager class="elevation-0">
            <v-divider />
            <v-row class="mt-3">
              <v-col cols="12" sm="5">
                <TraceabilityServiceRequest :timeline="timeline" />
              </v-col>
              <v-col cols="12" sm="7">
                <v-row>
                  <v-col cols="12">
                    <InformationPatient
                      :patient="serviceRequest._embedded.patient"
                    />
                  </v-col>

                  <v-col cols="12">
                    <InformationServiceRequest
                      :service-request="serviceRequest"
                    />
                  </v-col>

                  <v-col cols="12">
                    <ObservationsServiceRequest :observations="observations" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-dialog
      v-model="patientsFound"
      transition="dialog-bottom-transition"
      max-width="800"
    >
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar color="primary" dark>Seleccione un paciente</v-toolbar>
          <v-card-text>
            <v-simple-table fixed-header height="300px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Tipo documento</th>
                    <th class="text-left">Documento</th>
                    <th class="text-left">Nombre</th>
                    <th class="text-left">Opción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="patient in patients" :key="patient.id">
                    <td>{{ identifierType(patient) }}</td>
                    <td>{{ identifierValue(patient) }}</td>
                    <td>{{ names(patient) }}</td>
                    <td>
                      <v-btn
                        small
                        depressed
                        color="secondary"
                        :loading="loadingPatientFoundButton"
                        @click="handleServiceRequestByPatient(patient)"
                        >Seleccione</v-btn
                      >
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog.value = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import InformationServiceRequest from "../../components/serviceRequest/searchServiceRequest/InformationServiceRequest";
import InformationPatient from "../../components/serviceRequest/searchServiceRequest/InformationPatient";
import TraceabilityServiceRequest from "../../components/serviceRequest/searchServiceRequest/TraceabilityServiceRequest";
import ObservationsServiceRequest from "../../components/serviceRequest/searchServiceRequest/ObservationsServiceRequest";
import DialogDetailServiceRequest from "../../components/serviceRequest/searchServiceRequest/DialogDetailServiceRequest";

export default {
  name: "SearchServiceRequest",
  components: {
    DialogDetailServiceRequest,
    ObservationsServiceRequest,
    TraceabilityServiceRequest,
    InformationPatient,
    InformationServiceRequest,
  },
  data: () => ({
    tabs: null,
    panel: null,
    serviceRequestIdentifier: "12233446",
    editedItem: {
      identifierType: "",
      identifier: "15654738-7",
      given: "",
      father_family: "araneda",
      mother_family: "",
    },

    searchedObservation: [],
    search: "",
    detailServiceRequestDialog: false,
    serviceRequestSelected: null,

    events: [],
    input: null,
    nonce: 0,

    headers: [
      { text: "N° Solicitud", value: "requisition", groupable: false },
      { text: "Nombre", value: "_embedded.patient", groupable: false },
      { text: "Procedencia", value: "_embedded.location.name" },
      { text: "Estado", value: "_embedded.status.name" },
      { text: "Prioridad", value: "_embedded.priority.name" },
      { text: "Opciones", value: "options", groupable: false },
    ],

    observations: [],

    foundServiceRequests: [],

    setButtonName: true,

    patientsFound: false,

    loadingPatientFoundButton: false,

    patients: [],
  }),

  mounted() {
    this.getIdentifierTypes();
  },

  watch: {
    async panel(value) {
      this.setButtonName = true;
      if (value !== undefined) {
        const { href } =
          this.foundServiceRequests[value]._embedded.patient._links.self;
        const response = await this.getPatient(href);

        this.setButtonName = false;

        this.comment(value);

        console.log(response);

        this.observations =
          this.foundServiceRequests[value]._links.observations.collection;
      }
    },
  },

  computed: {
    ...mapGetters({
      identifierTypes: "patient/identifierTypes",
    }),

    timeline() {
      return this.events.slice().reverse();
    },
  },

  methods: {
    ...mapActions({
      findPatientByNames: "patient/findPatientByNames",
      getIdentifierTypes: "patient/getIdentifierTypes",
      findPatientByIdentifier: "patient/findPatientByIdentifier",
      setPatient: "serviceRequest/setPatient",
      findServiceRequestByIdentifier:
        "serviceRequest/getServiceRequestByIdentifier",
      findServiceRequestByPatient: "serviceRequest/getServiceRequestByPatient",
      getPatient: "patient/showItem",
    }),

    prueba(value) {
      return `${value.name[0].given} ${value.name[0].father_family} ${value.name[0].mother_family}`;
    },

    identifierType(patient) {
      return patient.identifier[0].identifierType.display;
    },

    identifierValue(patient) {
      return patient.identifier[0].value;
    },

    names(patient) {
      return `${patient.name[0].given} ${patient.name[0].father_family} ${patient.name[0].mother_family}`;
    },

    openDetailServiceRequestDialog(value) {
      this.serviceRequestSelected = value;
      this.detailServiceRequestDialog = true;
    },

    comment(value) {
      if (this.events.length === 0) {
        const serviceRequest = this.foundServiceRequests[value];
        const requester = serviceRequest._embedded.requester;
        const performer = serviceRequest._embedded.performer;

        this.events.push({
          id: serviceRequest.id + this.events.length,
          text: `<strong class="overline">Creada por:</strong> <p class="grey--text">${requester.name} ${requester.father_family} ${requester.mother_family}</p>`,
          time: `<span class="overline">${serviceRequest.authored_on}</span>`,
          icon: "mdi-lightbulb",
        });

        this.events.push({
          id: serviceRequest.id + this.events.length,
          text: `<strong class="overline">Solicitada por:</strong> <p class="grey--text">${performer.given} ${performer.family}</p>`,
          time: `<span class="overline">${serviceRequest.authored_on}</span>`,
          icon: "mdi-lightbulb",
        });
      }
    },

    async handleServiceRequestByIdentifier() {
      this.foundServiceRequests = [];

      const serviceRequests = await this.findServiceRequestByIdentifier(
        this.serviceRequestIdentifier
      );

      this.foundServiceRequests =
        this.unshiftFoundedServiceRequest(serviceRequests);
    },

    async handleSearchServiceRequestByPatient() {
      this.foundServiceRequests = [];

      if (this.editedItem.identifierType && this.editedItem.identifier) {
        await this.handleServiceRequestByPatient();
      } else if (
        this.editedItem.given ||
        this.editedItem.father_family ||
        this.editedItem.mother_family
      ) {
        this.patients = await this.findPatientByNames(this.editedItem);

        this.patientsFound = true;
      }
    },

    async handleServiceRequestByPatient(value = null) {
      this.loadingPatientFoundButton = true;
      let payload;
      if (!value) {
        payload = {
          patient: this.editedItem.identifier,
          type: this.editedItem.identifierType,
        };
      } else {
        payload = {
          patient: value.identifier[0].value,
          type: value.identifier[0].identifierType.id,
        };
      }

      const serviceRequests = await this.findServiceRequestByPatient(payload);

      this.foundServiceRequests =
        this.unshiftFoundedServiceRequest(serviceRequests);

      this.patientsFound = false;
      this.loadingPatientFoundButton = false;
    },

    unshiftFoundedServiceRequest(array) {
      return array.slice().reverse();
    },

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
