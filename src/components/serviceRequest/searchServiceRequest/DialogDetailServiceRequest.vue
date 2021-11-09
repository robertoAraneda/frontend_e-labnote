<template>
  <v-dialog max-width="1150" persistent :value="value">
    <v-card elevation="0">
      <v-container fluid>
        <v-toolbar color="primary" dark>
          <v-toolbar-title
            >N° solicitud: {{ serviceRequest.requisition }}</v-toolbar-title
          >
          <v-spacer />
          <v-btn icon text @click="$emit('input', false)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-alert v-if="isConfidential" text dense color="error" border="left">
            <h3 class="text-h5">Solicitud de examen confidencial</h3>
            <div>
              Toda la información del paciente estará asociada su clave o código
              de identificación.
            </div>

            <v-divider class="my-4 warning" style="opacity: 0.22"></v-divider>

            <v-row align="center" no-gutters>
              <v-col class="grow">
                <span class="title font-weight-bold">
                  Código de identificación: {{ confidentialCode }}</span
                >
              </v-col>
            </v-row>
          </v-alert>
          <v-row class="mt-3">
            <v-col cols="12" sm="6">
              <TraceabilityServiceRequest :timeline="timeline" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-row>
                <v-col cols="12">
                  <ContainerDetailServiceRequest title="Información paciente">
                    <template v-slot:default>
                      <v-list class="transparent" three-line>
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-icon size="48">mdi-account-circle</v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>{{
                              namePatient
                            }}</v-list-item-title>

                            <v-list-item-subtitle class="subtitle-1"
                              >Cruz Blanca</v-list-item-subtitle
                            >

                            <v-list-item-subtitle class="subtitle-1">{{
                              location
                            }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </template>
                  </ContainerDetailServiceRequest>
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
        </v-card-text>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import TraceabilityServiceRequest from "./TraceabilityServiceRequest";
import InformationServiceRequest from "./InformationServiceRequest";
import ObservationsServiceRequest from "./ObservationsServiceRequest";
import ContainerDetailServiceRequest from "./ContainerDetailServiceRequest";
export default {
  name: "DialogDetailServiceRequest",
  components: {
    ContainerDetailServiceRequest,
    ObservationsServiceRequest,
    InformationServiceRequest,
    TraceabilityServiceRequest,
  },
  props: {
    dialog: Boolean,
    serviceRequest: Object,
    traceability: Array,
    value: Boolean,
  },
  data: () => ({}),

  computed: {
    timeline() {
      return this.traceability.slice().reverse();
    },

    isConfidential() {
      return this.serviceRequest?.is_confidential;
    },

    confidentialCode() {
      const [confidentialCode] =
        this.serviceRequest?._embedded.patient.identifier.filter(
          (identifier) => identifier.type === "CONFIDENCIAL"
        );

      return confidentialCode?.value;
    },

    location() {
      return this.serviceRequest?._embedded.location.name;
    },

    namePatient() {
      return this.serviceRequest?._embedded.patient.name[0].text;
    },

    observations() {
      return this.serviceRequest?._links.observations.collection;
    },

    specimens() {
      return this.serviceRequest?._links.specimens.collection.reduce(
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

  methods: {},
};
</script>

<style scoped></style>
