<template>
  <v-container>
    <BaseHeaderModule
      title="Módulo de atención de toma de muestras."
      subtitle="En este módulo gestionar la atención de los pacientes para su toma de muestra."
    />

    <v-tabs v-model="tab" centered color="primary" icons-and-text>
      <v-tabs-slider></v-tabs-slider>

      <v-tab>
        PACIENTES PENDIENTES
        <v-icon>mdi-phone</v-icon>
      </v-tab>
      <v-tab>
        VER PACIENTES ATENDIDOS
        <v-icon>mdi-heart</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item class="pa-3">
        <v-divider />

        <v-card-text>
          <span class="subtitle-1"
            >Seleccione un paciente para gestionar su toma de muestra.</span
          >
          <v-row justify="center" class="mt-5">
            <v-col cols="8">
              <v-alert elevation="1" colored-border border="left" type="info">
                <strong>Recuerde.</strong> <br />Una vez tomada la(s)
                muestra(s), escanear el código de barras de los contenedores.
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
        <v-row class="fill-height">
          <v-col cols="12" md="6" lg="6" xl="7">
            <v-sheet class="pa-3 mt-3" rounded="lg" elevation="6">
              <v-row>
                <v-col class="text-center" cols="12">
                  <v-chip class="pl-2 mr-2" outlined>
                    <v-icon left color="grey lighten-3"
                      >mdi-circle-slice-8</v-icon
                    >
                    Pendiente
                  </v-chip>
                  <v-chip outlined>
                    <v-icon left color="primary darken-1"
                      >mdi-circle-slice-8</v-icon
                    >
                    En atención
                  </v-chip>
                </v-col>
              </v-row>
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
                v-else
                :items="mappedFilterRequests"
                :item-height="100"
                height="600"
              >
                <template v-slot:default="{ item, index }">
                  <v-list-item
                    :dark="selectedIndex === index"
                    :class="
                      selectedIndex === index
                        ? 'primary darken-1'
                        : index % 2 === 0
                        ? 'grey lighten-4'
                        : 'grey lighten-5'
                    "
                  >
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
                      <v-btn
                        v-if="selectedIndex !== index"
                        :color="selectedIndex === index ? 'grey' : ''"
                        depressed
                        small
                        @click="getSpecimens($event, item, index)"
                        :disabled="!!selectedServiceRequest"
                      >
                        {{
                          selectedIndex === index
                            ? "En atención"
                            : "Tomar muestra"
                        }}

                        <v-icon color="orange darken-4" right>
                          mdi-open-in-new
                        </v-icon>
                      </v-btn>
                      <v-chip small v-else dark class="text-button" label
                        >EN ATENCIÓN
                        <v-icon small color="orange darken-4" right>
                          mdi-open-in-new
                        </v-icon></v-chip
                      >
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-virtual-scroll>

              <!--
              <v-data-iterator
                :items-per-page="itemsPerPage"
                :items="mappedFilterRequests"
                :search="search"
              >
                <template v-slot:header>
                  <v-toolbar class="mb-10" color="transparent" flat>
                    <v-text-field
                      v-model="search"
                      clearable
                      filled
                      hide-details
                      prepend-inner-icon="mdi-magnify"
                      label="Buscar"
                    ></v-text-field>
                  </v-toolbar>
                </template>

                <template v-slot:default="props">
                  <v-row>
                    <v-col
                      v-for="(item, index) in props.items"
                      :key="item.id"
                      cols="12"
                    >
                      <v-hover v-slot="{ hover }">
                        <v-card
                          :elevation="hover || selectedIndex === index ? 12 : 3"
                          :class="{
                            'on-hover': hover,
                            'active-card': selectedIndex === index,
                          }"
                          rounded="lg"
                          @click="getSpecimens($event, item, index)"
                        >
                          <v-card-title
                            :class="selectedIndex === index ? 'primary' : ''"
                            class="subheading font-weight-bold"
                          >
                            {{ item.requisition }}
                            <v-spacer />
                            {{ item.occurrence }}
                            <v-spacer />
                            <v-icon
                              dark
                              v-if="selectedIndex === index"
                              size="48"
                              class="ml-n3 mr-3"
                              >mdi-arrow-right-bold</v-icon
                            >
                          </v-card-title>

                          <v-divider></v-divider>

                          <v-list dense>
                            <v-list-item>
                              <v-list-item-content>Nombre:</v-list-item-content>
                              <v-list-item-content
                                v-text="item.patientName"
                                class="align-end"
                              >
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content
                                v-text="item.patientIdentifierType"
                              ></v-list-item-content>
                              <v-list-item-content
                                v-text="item.patientIdentifierValue"
                                class="align-end"
                              >
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content
                                >Fecha de nacimiento:</v-list-item-content
                              >
                              <v-list-item-content
                                v-text="item.patientBirthdate"
                                class="align-end"
                              >
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>Género:</v-list-item-content>
                              <v-list-item-content
                                v-text="item.patientAdministrativeGender"
                                class="align-end"
                              >
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-hover>
                    </v-col>
                  </v-row>
                </template>
              </v-data-iterator>
              -->
            </v-sheet>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="7">
            <v-card
              class="pa-3"
              elevation="0"
              rounded="lg"
              v-if="selectedServiceRequest"
            >
              <span class="title ml-4">Atentiendo a:</span>
              <v-expand-transition>
                <div class="mt-n5" v-show="selectedIndex !== -1">
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
                            :class="`grey lighten-3`"
                            outlined
                          >
                            <v-list-item class="">
                              <v-list-item-avatar>
                                <v-icon
                                  color="primary darken-1"
                                  dark
                                  size="42"
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
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item class="pa-3">
        <v-divider />
        <v-data-table
          :headers="headers"
          :items="serviceRequests"
          sort-by="id"
          class="elevation-1"
          >>
          <template v-slot:item.actions="">
            <v-icon small class="mr-2"> mdi-pencil </v-icon>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import moment from "moment";
import { SpecimenStatusEnum } from "../../enums/specimen-status.enum";
import { ServiceRequestStatusEnum } from "../../enums/service-request-status.enum";

export default {
  name: "SamplingRoomReception",

  data: () => ({
    itemsPerPage: 2,
    serviceRequests: [],
    search: "",
    selectedIndex: -1,
    selectedColor: "secondary lighten-3",
    selectedServiceRequest: null,
    barcodeScan: "",
    scannedContainers: [],
    headers: [
      {
        text: "N°",
        value: "id",
        sortable: true,
        width: "65",
      },
      {
        text: "Rut",
        value: "_embedded.patient.identifier[0].value",
        sortable: true,
      },
      {
        text: "Nombre",
        value: "_embedded.patient.name[0].text",
        sortable: true,
      },
      {
        text: "Solicitud",
        value: "requisition",
        sortable: true,
      },
      {
        text: "Estado",
        value: "_embedded.status.name",
        sortable: true,
      },
      {
        text: "Opciones",
        value: "actions",
      },
    ],

    selectedSpecimens: [],

    activateFilterPendingSamples: true,

    tab: null,
  }),

  async mounted() {
    this.serviceRequests = await this.getServiceRequestByDate({
      date: moment().format("YYYY-MM-DD"),
    });
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
        );
    },
  },

  methods: {
    ...mapActions({
      getServiceRequestByDate: "serviceRequest/getServiceRequestByDate",
      generateCodbar: "serviceRequest/generateCodbar",
      generateSingleBarcode: "serviceRequest/generateSingleBarcode",
      update: "specimen/putItem",
      updateDateCollection: "specimen/updateDateCollection",
    }),

    handleFinallySampling() {
      const pendingContainers =
        this.selectedServiceRequest.raw._links.specimens.collection.filter(
          (specimen) => {
            console.log(specimen);
            return (
              specimen.specimen_status.code === SpecimenStatusEnum.PENDING &&
              specimen.specimen.accession_identifier !== this.barcodeScan
            );
          }
        );

      if (pendingContainers.length !== 0) {
        //TODO cambiar a alert
        alert("aún hay contenedores pendientes.. continuar?");
      } else {
        this.handleCancelSampling();
        this.serviceRequests.splice(this.selectedIndex, 1);
      }
    },

    handleCancelSampling() {
      this.selectedServiceRequest = null;
      this.selectedIndex = -1;
    },

    getSpecimens(event, item, index) {
      console.log(event);
      this.top = event.y - 500;
      this.selectedIndex = -1;
      this.selectedServiceRequest = item;
      this.selectedSpecimens = [...item.raw._links.specimens.collection];

      setTimeout(() => {
        console.log(item);
        this.selectedIndex = index;
        this.activateFilterPendingSamples = false;
      }, 500);
    },

    async handleGenerateCodbar() {
      const response = await this.generateCodbar({
        id: this.selectedServiceRequest.raw.id,
      });

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
      const response = await this.generateSingleBarcode({
        id: this.selectedServiceRequest.raw.id,
        accession_identifier: sample.specimen.accession_identifier,
      });

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

          console.log("index", index);

          const { data } = await this.updateDateCollection({
            accession_identifier: this.barcodeScan,
            service_request_id: this.selectedServiceRequest.id,
          });

          if (index !== -1) {
            this.selectedSpecimens[index].specimen = data.specimen;
            this.selectedSpecimens[index].specimen_status =
              data.specimen_status;
          }

          console.log(data);

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
</style>
