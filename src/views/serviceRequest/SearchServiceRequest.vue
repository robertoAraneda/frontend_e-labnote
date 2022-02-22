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
      :items="serviceRequests"
      class="elevation-2 mt-3"
      show-group-by
    >
      <template v-slot:top>
        <v-subheader class="subtitle-1 text-uppercase"
          >Lista de solicitudes</v-subheader
        >
      </template>

      <template v-slot:item.options="{ item }">
        <v-icon @click="openDetailServiceRequestDialog(item)"
          >mdi-magnify</v-icon
        >
        <v-icon
          v-if="item.status !== 'completo'"
          @click="handleEditServiceRequest(item)"
          >mdi-pencil</v-icon
        >
        <v-icon color="red" @click="handleViewPdf(item)">mdi-pdf-box</v-icon>
        <v-btn
          text
          small
          color="red"
          v-if="item.raw.request_hl7_file"
          @click="handleOpenHl7Traceability(item)"
        >
          HL7</v-btn
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
      :traceability="events"
    />

    <v-dialog
      max-width="1024"
      v-model="patientsFound"
      transition="dialog-bottom-transition"
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
    <v-dialog max-width="800" v-model="dialogHl7"
      ><v-sheet max-width="800" v-if="serviceRequestSelected">
        <v-subheader>Trazabilidad interoperabilidad LIS</v-subheader>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Fecha</th>
                <th class="text-left">Tipo</th>
                <th class="text-left">Contenido</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ serviceRequestSelected.request_hl7_date }}</td>
                <td>Solicitud</td>
                <td>{{ serviceRequestSelected.request_hl7_file }}</td>
              </tr>
              <tr>
                <td>{{ serviceRequestSelected.request_hl7_date }}</td>
                <td>Respuesta</td>
                <td>{{ serviceRequestSelected.response_hl7_file }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-sheet>
    </v-dialog>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DialogDetailServiceRequest from "../../components/serviceRequest/searchServiceRequest/DialogDetailServiceRequest";
import moment from "moment";

export default {
  name: "SearchServiceRequest",
  components: {
    DialogDetailServiceRequest,
  },
  data: () => ({
    dialogPdf: false,
    tabs: null,
    panel: null,
    serviceRequestIdentifier: "",
    editedItem: {
      identifierType: "",
      identifier: "",
      given: "",
      father_family: "",
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
      { text: "Nombre/Código", value: "name", groupable: false },
      { text: "Procedencia", value: "location" },
      { text: "Estado", value: "status" },
      { text: "Prioridad", value: "priority" },
      { text: "Opciones", value: "options", groupable: false, width: "180" },
    ],
    observations: [],
    foundServiceRequests: [],
    setButtonName: true,
    patientsFound: false,
    loadingPatientFoundButton: false,
    patients: [],
    dialogHl7: false,
  }),

  mounted() {
    this.getIdentifierTypes();
  },

  beforeDestroy() {
    this.setPatient(null);
    this.setPatients([]);
  },

  computed: {
    ...mapGetters({
      identifierTypes: "patient/identifierTypes",
    }),

    timeline() {
      return this.events.slice().reverse();
    },

    serviceRequests() {
      return this.foundServiceRequests?.map((serviceRequest) => {
        const confidentialName =
          serviceRequest._embedded.patient.identifier.filter(
            (identifier) => identifier.type === "CONFIDENCIAL"
          )[0];
        const name = serviceRequest._embedded.patient.name[0];

        return {
          requisition: serviceRequest.requisition,
          name: serviceRequest.is_confidential
            ? confidentialName.value
            : name.text,
          location: serviceRequest._embedded.location.name,
          status: serviceRequest._embedded.status.name,
          priority: serviceRequest._embedded.priority.name,
          raw: serviceRequest,
        };
      });
    },

    specimens() {
      return this.serviceRequestSelected?._links.specimens.collection.reduce(
        (accumulator, object) => {
          let key = object.specimen["collected_at"];
          if (!accumulator[key]) {
            accumulator[key] = [];
          }
          accumulator[key].push(object);
          return accumulator;
        },
        {}
      );
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

    handleOpenHl7Traceability(value) {
      this.serviceRequestSelected = value.raw;
      this.dialogHl7 = true;
    },

    traceability() {
      this.events = [];
      const requester = this.serviceRequestSelected?._embedded.requester;
      const performer = this.serviceRequestSelected?._embedded.performer;

      this.events.push({
        id: this.serviceRequestSelected?.id + this.events.length,
        text: `<strong class="overline">Creada por:</strong> <p class="secondary--text">${requester.name} ${requester.father_family} ${requester.mother_family}</p>`,
        time: `<span class="overline">${this.serviceRequestSelected?.authored_on}</span>`,
        icon: "mdi-clock-check-outline",
      });

      this.events.push({
        id: this.serviceRequestSelected?.id + this.events.length,
        text: `<strong class="overline">Solicitada por:</strong> <p class="secondary--text">${performer.given} ${performer.family}</p>`,
        time: `<span class="overline">${this.serviceRequestSelected?.authored_on}</span>`,
        icon: "mdi-clock-check-outline",
      });
      const [date] = Object.keys(this.specimens);

      const [specimen] = this.specimens[date];

      const collector = specimen.specimen.collector;

      if (date !== "null") {
        this.events.push({
          id: this.serviceRequestSelected.id + this.events.length,
          text: `<strong class="overline">Muestras tomadas por:</strong> <p class="secondary--text">${collector.names} ${collector.lastname} ${collector.mother_lastname}</p>`,
          time: `<span class="overline">${moment(
            specimen.specimen.collected_at
          ).format("DD/MM/YYYY HH:mm:ss")}</span>`,
          icon: "mdi-clock-check-outline",
        });
      }
    },

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
      //en atributo raw se encuentra la instancia de la solicitud.
      this.serviceRequestSelected = value.raw;
      this.traceability();
      this.detailServiceRequestDialog = true;
    },

    handleEditServiceRequest(serviceRequest) {
      this.setEditedServiceRequest(serviceRequest.raw);
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
      const response = await this.viewPdf(item.raw);

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
      const response = await this.generateCodbar(item.raw);

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
