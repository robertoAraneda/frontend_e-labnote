<template>
  <v-dialog persistent :value="value">
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
          <v-row class="mt-3">
            <v-col cols="12" sm="6">
              <TraceabilityServiceRequest :timeline="timeline" />
            </v-col>
            <v-col cols="12" sm="6">
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
        </v-card-text>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import TraceabilityServiceRequest from "./TraceabilityServiceRequest";
import InformationPatient from "./InformationPatient";
import InformationServiceRequest from "./InformationServiceRequest";
import ObservationsServiceRequest from "./ObservationsServiceRequest";
export default {
  name: "DialogDetailServiceRequest",
  components: {
    ObservationsServiceRequest,
    InformationServiceRequest,
    InformationPatient,
    TraceabilityServiceRequest,
  },
  props: {
    dialog: Boolean,
    serviceRequest: Object,
    value: Boolean,
  },

  mounted() {
    setTimeout(() => {
      this.comment();
    }, 500);
  },

  data: () => ({
    events: [],
  }),

  computed: {
    timeline() {
      return this.events.slice().reverse();
    },

    observations() {
      return this.serviceRequest._links.observations.collection;
    },
  },

  methods: {
    comment() {
      if (this.events.length === 0) {
        const requester = this.serviceRequest._embedded.requester;
        const performer = this.serviceRequest._embedded.performer;

        this.events.push({
          id: this.serviceRequest.id + this.events.length,
          text: `<strong class="overline">Creada por:</strong> <p class="grey--text">${requester.name} ${requester.father_family} ${requester.mother_family}</p>`,
          time: `<span class="overline">${this.serviceRequest.authored_on}</span>`,
          icon: "mdi-lightbulb",
        });

        this.events.push({
          id: this.serviceRequest.id + this.events.length,
          text: `<strong class="overline">Solicitada por:</strong> <p class="grey--text">${performer.given} ${performer.family}</p>`,
          time: `<span class="overline">${this.serviceRequest.authored_on}</span>`,
          icon: "mdi-lightbulb",
        });
      }
    },
  },
};
</script>

<style scoped></style>
