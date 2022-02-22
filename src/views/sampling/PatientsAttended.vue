<template>
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
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";

export default {
  name: "PatientsAttended",

  data: () => ({
    serviceRequests: [],
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
  }),

  async mounted() {
    this.serviceRequests = await this.getServiceRequestByDate({
      date: moment().format("YYYY-MM-DD"),
    });
  },
  methods: {
    ...mapActions({
      getServiceRequestByDate: "serviceRequest/getServiceRequestByDate",
    }),
  },
};
</script>

<style scoped></style>
