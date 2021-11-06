<template>
  <section>
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
      class="elevation-2 mt-3"
      show-group-by
    >
      <template v-slot:top>
        <v-subheader class="subtitle-1 text-uppercase"
          >Lista de solicitudes</v-subheader
        >
      </template>
      <template v-slot:item._embedded.patient="{ item }">
        {{ prueba(item._embedded.patient) }}
      </template>
      <template v-slot:item.options="{ item }">
        <v-icon @click="openDetailServiceRequestDialog(item)"
          >mdi-magnify</v-icon
        >
        <v-icon
          v-if="item._embedded.status.code !== 'completo'"
          @click="handleEditServiceRequest(item)"
          >mdi-pencil</v-icon
        >
        <v-icon color="red" @click="handleViewPdf(item)">mdi-pdf-box</v-icon>
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

    <v-dialog v-model="patientsFound" transition="dialog-bottom-transition">
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
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DialogDetailServiceRequest from "../../components/serviceRequest/searchServiceRequest/DialogDetailServiceRequest";

export default {
  name: "SearchServiceRequest",
  components: {
    DialogDetailServiceRequest,
  },
  data: () => ({
    dialogPdf: false,
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

  beforeDestroy() {
    this.setPatient(null);
    this.setPatients([]);
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
      viewPdf: "serviceRequest/viewPdf",
      generateCodbar: "serviceRequest/generateCodbar",
      setPatients: "patient/setPatients",
      setEditedServiceRequest: "serviceRequest/handleEditServiceRequest",
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

    handleEditServiceRequest(serviceRequest) {
      this.setEditedServiceRequest(serviceRequest);
      this.$router.push({ name: "UpdateServiceRequest" });
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

    async handleViewPdf(item) {
      const response = await this.viewPdf(item);

      console.log(response);

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.href = url;
      link.setAttribute("target", "_blank");
      link.setAttribute("title", "prueba.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      this.dialogPdf = true;
    },

    async handleGenerateCodbar(item) {
      const response = await this.generateCodbar(item);

      console.log(response);

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.href = url;
      link.setAttribute("target", "_blank");
      link.setAttribute("title", "prueba.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      this.dialogPdf = true;
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

      this.$nextTick(() => {
        //this.dialog = true;
        this.$router.push({ name: "createServiceRequest" });
      });
    },
  },
};
</script>

<style scoped></style>
