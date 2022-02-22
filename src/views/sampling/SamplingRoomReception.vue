<template>
  <v-container>
    <BaseHeaderModule
      title="Módulo de atención de toma de muestras."
      subtitle="En este módulo gestionar la atención de los pacientes para su toma de muestra."
    />

    <v-row justify="center" class="mt-5">
      <v-col cols="8">
        <v-alert text border="left" type="warning">
          <strong>Recuerde.</strong> <br />Una vez tomada la(s) muestra(s),
          escanear el código de barras de los contenedores.
        </v-alert>
      </v-col>
    </v-row>

    <v-row class="fill-height">
      <v-col cols="12" md="6" lg="6">
        <v-sheet class="pa-3 mt-3" rounded="lg" elevation="6">
          <v-subheader class="title text-uppercase primary--text"
            >Pacientes en espera</v-subheader
          >
          <v-toolbar color="transparent" flat>
            <v-text-field
              v-model="search"
              clearable
              filled
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Buscar"
            ></v-text-field>
          </v-toolbar>
          <v-list two-line v-if="mappedFilterRequests.length === 0">
            <v-list-item>
              <v-list-item-avatar>
                <v-icon size="32" color="success darken-1"
                  >mdi-check-circle-outline</v-icon
                >
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  >No hay pacientes pendientes.</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-virtual-scroll
            :items="mappedFilterRequests"
            :item-height="100"
            height="500"
          >
            <template v-slot:default="{ item, index }">
              <v-slide-y-transition group>
                <v-list-item :key="item.id" @click="test(item, index)">
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.patientName"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      >{{ item.patientIdentifierType }}:
                      {{ item.patientIdentifierValue }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >Fecha de nacimiento:
                      {{ item.patientBirthdate }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >Género:
                      {{
                        item.patientAdministrativeGender
                      }}</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-list-item-action>
                    <p class="text-button">{{ item.requisition }}</p>
                    <v-chip color="primary" label small> TOMAR MUESTRA </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-slide-y-transition>
              <v-divider :key="index"></v-divider>
            </template>
          </v-virtual-scroll>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="6" lg="6">
        <v-sheet class="pa-3 mt-3" rounded="lg" elevation="6">
          <v-subheader class="title text-uppercase primary--text"
            >Pacientes en atención</v-subheader
          >
          <v-list two-line v-if="serviceRequestInAttention.length === 0">
            <v-list-item>
              <v-list-item-avatar>
                <v-icon size="32" color="success darken-1"
                  >mdi-check-circle-outline</v-icon
                >
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  >No hay pacientes en atención.</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-virtual-scroll
            :items="serviceRequestInAttention"
            :item-height="100"
            height="600"
          >
            <template v-slot:default="{ item, index }">
              <v-slide-y-transition group>
                <v-list-item :key="item.id">
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.patientName"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      >{{ item.patientIdentifierType }}:
                      {{ item.patientIdentifierValue }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >Fecha de nacimiento:
                      {{ item.patientBirthdate }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >Género:
                      {{
                        item.patientAdministrativeGender
                      }}</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-list-item-action>
                    <p class="text-button">{{ item.requisition }}</p>
                    <v-chip color="success" label small> EN ATENCIÓN </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-slide-y-transition>
              <v-divider :key="index"></v-divider>
            </template>
          </v-virtual-scroll>
        </v-sheet>
      </v-col>
    </v-row>
    <div class="text-center">
      <v-dialog max-width="800" persistent v-model="sheet" scrollable>
        <v-sheet class="text-center">
          <div class="py-3">
            <v-card
              class="pa-3"
              elevation="0"
              rounded="lg"
              v-if="selectedServiceRequest"
            >
              <span class="title ml-4">Atentiendo a:</span>
              <v-expand-transition>
                <div class="mt-n5">
                  <v-card-title>
                    {{ selectedServiceRequest.patientName }} <v-spacer />
                    <v-btn
                      class="white mr-2"
                      @click="handleGenerateCodbar()"
                      icon
                    >
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>

                    <v-btn class="white" icon>
                      <v-icon>mdi-alert</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-subheader class="body-1"
                      >Lista de contenedores</v-subheader
                    >
                    <v-row>
                      <v-col cols="12" class="text-center">
                        <v-chip class="mr-1" outlined>
                          <v-icon left color="primary darken-1"
                            >mdi-test-tube-empty</v-icon
                          >

                          Pendiente
                        </v-chip>
                        <v-chip class="mr-1" outlined>
                          <v-icon left color="primary darken-1"
                            >mdi-test-tube</v-icon
                          >
                          Disponible
                        </v-chip>
                        <v-chip outlined>
                          <v-icon left color="primary darken-1"
                            >mdi-test-tube-off</v-icon
                          >
                          Rechazado/Error
                        </v-chip>
                      </v-col>
                    </v-row>

                    <v-list three-line>
                      <template v-for="sample in selectedSpecimens">
                        <v-hover :key="sample.container.id" v-slot="{ hover }">
                          <v-sheet
                            class="pa-1 mb-2"
                            rounded="lg"
                            :elevation="hover ? 10 : 0"
                            outlined
                          >
                            <v-list-item class="text-left">
                              <v-list-item-avatar>
                                <v-icon
                                  color="primary darken-1"
                                  dark
                                  size="36"
                                  class="grey lighten-3"
                                >
                                  {{
                                    sample.specimen_status.code === "pendiente"
                                      ? "mdi-test-tube-empty"
                                      : "mdi-test-tube"
                                  }}
                                </v-icon>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title class="mb-2">{{
                                  sample.container.name
                                }}</v-list-item-title>

                                <v-list-item-subtitle class="subtitle-1 mb-2">{{
                                  sample.specimen.accession_identifier
                                }}</v-list-item-subtitle>
                                <v-list-item-subtitle
                                  ><v-chip class="mr-2" color="secondary" small>
                                    <v-icon left :color="sample.container.color"
                                      >mdi-circle</v-icon
                                    >{{ sample.container.shortname }}</v-chip
                                  ><v-chip
                                    class="mr-2"
                                    dark
                                    color="secondary"
                                    small
                                    >{{ sample.specimen_code.display }}</v-chip
                                  >
                                </v-list-item-subtitle>
                              </v-list-item-content>

                              <v-list-item-action>
                                <v-menu
                                  origin="center center"
                                  transition="scale-transition"
                                  bottom
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      class="mt-n3"
                                      icon
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                  </template>

                                  <v-list>
                                    <v-list-item
                                      @click="
                                        handleGenerateSingleBarcode(sample)
                                      "
                                    >
                                      <v-list-item-title
                                        >Imprimir</v-list-item-title
                                      >
                                      <v-list-item-action>
                                        <v-icon color="black lighten-3" small
                                          >mdi-printer</v-icon
                                        ></v-list-item-action
                                      >
                                    </v-list-item>
                                    <v-list-item>
                                      <v-list-item-title class="error--text"
                                        >Rechazar</v-list-item-title
                                      >
                                      <v-list-item-action>
                                        <v-icon dark small color="error"
                                          >mdi-alert</v-icon
                                        ></v-list-item-action
                                      >
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </v-list-item-action>
                            </v-list-item>
                          </v-sheet>
                        </v-hover>
                      </template>
                    </v-list>
                    <v-subheader class="body-1"
                      >Escanear contenedores</v-subheader
                    >

                    <div class="mt-3 fill-height">
                      <v-row justify="center">
                        <v-col cols="12">
                          <v-text-field
                            v-model="barcodeScan"
                            @keypress.enter="handleBarcodeScan"
                            height="60"
                            filled
                            class="centered-input text-h5"
                            prepend-inner-icon="mdi-barcode-scan"
                            placeholder="Código de barras"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-expand-transition>
                        <v-alert
                          v-for="container in scannedContainers"
                          :key="container.id"
                          type="success"
                          prominent
                          >Contenedor
                          <strong>{{
                            container.specimen.accession_identifier
                          }}</strong>
                          escaneado correctamente. <br />
                          <strong>Fecha:</strong>
                          {{ container.specimen.collected_at | parseDate }}
                          <strong>Hora:</strong>
                          {{ container.specimen.collected_at | parseTime }}
                        </v-alert>
                      </v-expand-transition>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      depressed
                      rounded
                      color="secondary"
                      text
                      @click="handleCancelSampling"
                      >Cancelar atención</v-btn
                    >
                    <v-btn
                      depressed
                      rounded
                      color="primary"
                      @click="handleFinallySampling"
                      >Finalizar atención</v-btn
                    >
                  </v-card-actions>
                </div>
              </v-expand-transition>
            </v-card>
            <v-card v-else>
              <v-slide-y-transition group>
                <v-alert
                  v-for="container in scannedContainers"
                  :key="container.id"
                  type="success"
                  prominent
                  >Contenedor
                  <strong>{{ container.specimen.accession_identifier }}</strong>
                  escaneado correctamente. <br />
                  <strong>Fecha:</strong>
                  {{ container.specimen.collected_at | parseDate }}
                  <strong>Hora:</strong>
                  {{ container.specimen.collected_at | parseTime }}
                </v-alert>
              </v-slide-y-transition>
            </v-card>
          </div>
        </v-sheet>
      </v-dialog>
    </div>
    <BaseSnackbar
      :custom-message="messageSnackbar"
      type="error"
      v-model="openWarningMessage"
    />
    <v-snackbar
      color="grey lighten-4"
      :timeout="30000"
      centered
      multi-line
      v-model="missingSamplesSnackbar"
    >
      <template v-slot:default>
        <div class="secondary--text mb-4 text-h6">{{ messageSnackbar }}</div>
        <div class="text-center">
          <v-btn color="secondary" text @click="missingSamplesSnackbar = false">
            Cancelar
          </v-btn>

          <v-btn color="primary" @click="finallySampling"> Continuar </v-btn>
        </div>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import moment from "moment";
import { SpecimenStatusEnum } from "../../enums/specimen-status.enum";
import { ServiceRequestStatusEnum } from "../../enums/service-request-status.enum";
import { ServiceRequestBusinessStatusEnum } from "../../enums/service-request-business-status.enum";
import Pusher from "pusher-js";

export default {
  name: "SamplingRoomReception",

  data: () => ({
    missingSamplesSnackbar: false,
    selected: null,
    sheet: false,
    messageSnackbar:
      "EL paciente ya se encuentra en atención. Espere unos segundos.",
    openWarningMessage: false,
    tiles: [
      { img: "keep.png", title: "Keep" },
      { img: "inbox.png", title: "Inbox" },
      { img: "hangouts.png", title: "Hangouts" },
      { img: "messenger.png", title: "Messenger" },
      { img: "google.png", title: "Google+" },
    ],
    errorPatients: [],
    itemsPerPage: 2,
    serviceRequests: [],
    cloneServiceRequest: [],
    search: "",
    selectedIndex: -1,
    selectedColor: "secondary lighten-3",
    selectedServiceRequest: null,
    barcodeScan: "",
    scannedContainers: [],
    serviceRequestInAttention: [],
    selectedSpecimens: [],
    activateFilterPendingSamples: true,
    tab: null,
  }),

  async mounted() {
    this.subscribe();
    await this.handleGetServiceRequestByDate();

    setTimeout(() => {
      this.cloneServiceRequest = [...this.pendingServiceRequest];
      this.serviceRequestInAttention = [...this.inAttentionServiceRequest];
    }, 2000);
  },

  watch: {
    scannedContainers() {
      if (this.scannedContainers.length !== 0) {
        setTimeout(() => {
          this.scannedContainers = [];
        }, 3000);
      }
    },
  },

  filters: {
    parseDate(value) {
      return moment(value).format("DD-MM-YY");
    },

    parseTime(value) {
      return moment(value).format("H:m");
    },
  },

  computed: {
    mappedFilterRequests() {
      return this.pendingServiceRequest.filter((serviceRequest) => {
        return (
          (serviceRequest.patientName || "")
            .toLowerCase()
            .indexOf((this.search || "").toLowerCase()) > -1 ||
          (serviceRequest.requisition || "")
            .toLowerCase()
            .indexOf((this.search || "").toLowerCase()) > -1 ||
          (serviceRequest.patientIdentifierValue || "")
            .toLowerCase()
            .indexOf((this.search || "").toLowerCase()) > -1
        );
      });
    },

    pendingServiceRequest() {
      if (this.serviceRequests.length === 0) return [];

      return this.serviceRequests
        .map((serviceRequest) => ({
          id: serviceRequest.id,
          requisition: serviceRequest.requisition,
          occurrence: serviceRequest.occurrence,
          patientName: `${serviceRequest._embedded.patient?.name[0].given} ${serviceRequest._embedded.patient.name[0].father_family} ${serviceRequest._embedded.patient.name[0].mother_family}`,
          patientIdentifierValue:
            serviceRequest._embedded.patient.identifier[0].value,
          patientIdentifierType:
            serviceRequest._embedded.patient.identifier[0].type,
          patientBirthdate: serviceRequest._embedded.patient.birthdate,
          patientAdministrativeGender:
            serviceRequest._embedded.patient.administrative_gender,
          raw: serviceRequest,
        }))
        .filter(
          (serviceRequest) =>
            serviceRequest.raw._embedded.status.code ===
            ServiceRequestStatusEnum.ACTIVE
        )
        .filter(
          (serviceRequest) =>
            serviceRequest.raw._links.tasks.collection.length === 0
        );
    },

    inAttentionServiceRequest() {
      if (this.serviceRequests.length === 0) return [];

      return this.serviceRequests
        .map((serviceRequest) => ({
          id: serviceRequest.id,
          requisition: serviceRequest.requisition,
          occurrence: serviceRequest.occurrence,
          patientName: `${serviceRequest._embedded.patient.name[0].given} ${serviceRequest._embedded.patient.name[0].father_family} ${serviceRequest._embedded.patient.name[0].mother_family}`,
          patientIdentifierValue:
            serviceRequest._embedded.patient.identifier[0].value,
          patientIdentifierType:
            serviceRequest._embedded.patient.identifier[0].type,
          patientBirthdate: serviceRequest._embedded.patient.birthdate,
          patientAdministrativeGender:
            serviceRequest._embedded.patient.administrative_gender,
          raw: serviceRequest,
        }))
        .filter(
          (serviceRequest) =>
            serviceRequest.raw._embedded.status.code ===
            ServiceRequestStatusEnum.ACTIVE
        )
        .filter(
          (serviceRequest) =>
            serviceRequest.raw._links.tasks.collection.filter(
              (task) => task.business_status_id === 2
            ).length !== 0
        );
    },
  },

  methods: {
    ...mapActions({
      getServiceRequestByDate: "serviceRequest/getServiceRequestByDate",
      generateCodbar: "serviceRequest/generateCodbar",
      generateSingleBarcode: "serviceRequest/generateSingleBarcode",
      generateConfidentialCodbar: "serviceRequest/generateConfidentialCodbar",
      generateSingleConfidentialBarcode:
        "serviceRequest/generateSingleConfidentialBarcode",
      update: "specimen/putItem",
      updateDateCollection: "specimen/updateDateCollection",
      activateServiceRequest: "serviceRequest/updateSamplingRoomServiceRequest",
      createTask: "task/postItem",
      cancelPatientSamplingRoom: "serviceRequest/setDraftStatusServiceRequest",
    }),

    subscribe() {
      //  Pusher.logToConsole = true;
      let pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
        cluster: process.env.VUE_APP_PUSHER_CLUSTER,
      });

      pusher.subscribe("patient-sampling-room");
      pusher.subscribe("send-patient-sampling-room");
      pusher.subscribe("cancel-patient-sampling-room");

      pusher.bind("send_patient_sampling_room", ({ message }) => {
        console.log(message);
        //his.serviceRequests.unshift()
        this.handleGetServiceRequestByDate();
      });

      pusher.bind("patient_sampling_room", ({ message }) => {
        console.log("data", message.id);
        const [serviceRequest] = this.cloneServiceRequest.filter(
          (serviceRequest) => {
            return serviceRequest.raw.id === message.id;
          }
        );

        console.log("serviceRequest", serviceRequest);

        this.serviceRequestInAttention.unshift(serviceRequest);

        const index = this.serviceRequests.findIndex(
          (serviceRequest) => serviceRequest.id === message.id
        );

        this.serviceRequests.splice(index, 1);
        //this.handleGetServiceRequestByDate();
      });
      pusher.bind("cancel_patient_sampling_room", ({ message }) => {
        //this.handleGetServiceRequestByDate();

        const [serviceRequest] = this.cloneServiceRequest.filter(
          (serviceRequest) => serviceRequest.raw.id === message.id
        );

        this.serviceRequests.unshift(serviceRequest.raw);
        const index = this.serviceRequestInAttention.findIndex(
          (serviceRequest) => serviceRequest.raw.id === message.id
        );

        this.serviceRequestInAttention.splice(index, 1);
        this.handleGetServiceRequestByDate();
      });
    },

    async handleGetServiceRequestByDate() {
      this.serviceRequests = await this.getServiceRequestByDate({
        date: moment().format("YYYY-MM-DD"),
      });

      this.cloneServiceRequest = [...this.pendingServiceRequest];
    },

    async test(item) {
      console.log("item", item);
      try {
        this.getSpecimens(item);
        this.sheet = true;

        this.selectedIndex = this.serviceRequests.findIndex(
          (serviceRequest) => serviceRequest.id === item.raw.id
        );

        await this.createTask({
          based_on: item.id,
          business_status_id: ServiceRequestBusinessStatusEnum.ACTIVE,
        });
      } catch (e) {
        if (e.response.status === 409) {
          this.openWarningMessage = true;
        }
      }
    },

    handleFinallySampling() {
      const pendingContainers =
        this.selectedServiceRequest.raw._links.specimens.collection.filter(
          (specimen) => {
            return (
              specimen.specimen_status.code === SpecimenStatusEnum.PENDING &&
              specimen.specimen.accession_identifier !== this.barcodeScan
            );
          }
        );

      if (pendingContainers.length !== 0) {
        this.messageSnackbar = "Aún existen muestras pendientes por tomar.";
        this.missingSamplesSnackbar = true;
      } else {
        this.handleCancelSampling();
        this.serviceRequests.splice(this.selectedIndex, 1);
      }
    },

    async finallySampling() {
      this.errorPatients.push(this.serviceRequests[this.selectedIndex]);
      this.serviceRequests.splice(this.selectedIndex, 1);
      await this.handleCancelSampling();
      this.missingSamplesSnackbar = false;
    },

    handleCancelSampling() {
      this.cancelPatientSamplingRoom(this.selectedServiceRequest);
      this.selectedServiceRequest = null;
      this.selectedIndex = -1;
      this.sheet = false;
    },

    getSpecimens(item) {
      this.selectedServiceRequest = item;
      this.selectedSpecimens = [...item.raw._links.specimens.collection];
    },

    async handleGenerateCodbar() {
      let response;

      if (this.selectedServiceRequest.raw.is_confidential) {
        response = await this.generateConfidentialCodbar({
          id: this.selectedServiceRequest.raw.id,
        });
      } else {
        response = await this.generateCodbar({
          id: this.selectedServiceRequest.raw.id,
        });
      }

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

    async handleGenerateSingleBarcode(sample) {
      let response;
      if (this.selectedServiceRequest.raw.is_confidential) {
        response = await this.generateSingleConfidentialBarcode({
          id: this.selectedServiceRequest.raw.id,
          accession_identifier: sample.specimen.accession_identifier,
        });
      } else {
        response = await this.generateSingleBarcode({
          id: this.selectedServiceRequest.raw.id,
          accession_identifier: sample.specimen.accession_identifier,
        });
      }

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

    async handleBarcodeScan() {
      if (this.barcodeScan) {
        try {
          const index = this.selectedSpecimens.findIndex(
            (item) => item.specimen.accession_identifier === this.barcodeScan
          );

          const { data } = await this.updateDateCollection({
            accession_identifier: this.barcodeScan,
            service_request_id: this.selectedServiceRequest.id,
          });

          if (index !== -1) {
            this.selectedSpecimens[index].specimen = data.specimen;
            this.selectedSpecimens[index].specimen_status =
              data.specimen_status;
          }

          this.scannedContainers.unshift(data);
        } catch (e) {
          alert("El contenedor ya ha sido escaneado");
          console.log(e);
        } finally {
          this.barcodeScan = "";
        }
      }
    },
  },
};
</script>
<style scoped>
.v-card {
  transition: opacity 0.8s ease-in-out;
}
.v-card:not(.on-hover) {
  opacity: 1;
}

.active-card {
  opacity: 1 !important;
  color: white;
}

.centered-input >>> input {
  text-align: center !important;
}

>>> .my-custom-dialog {
  align-self: flex-end;
  align-content: end;
}
</style>
