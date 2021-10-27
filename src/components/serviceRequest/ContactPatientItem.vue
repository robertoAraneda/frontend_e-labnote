<template>
  <v-row>
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="localContact.relationship"
        :items="[
          'PADRE',
          'MADRE',
          'HERMANO/A',
          'ABUELO/A',
          'TIO/A',
          'HIJO/A',
          'OTRO',
        ]"
        label="Relación de contacto"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <BaseTextfield v-model="localContact.given" label="Nombres" />
    </v-col>
    <v-col cols="12" sm="5">
      <BaseTextfield v-model="localContact.family" label="Apellidos" />
    </v-col>
    <v-col cols="12" sm="6">
      <BaseTextfield v-model="localContact.phone" label="Teléfono" />
    </v-col>
    <v-col cols="12" sm="6">
      <BaseTextfield v-model="localContact.email" label="Email" />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ContactPatient from "../../models/ContactPatient";

export default {
  name: "ContactPatientItem",

  props: {
    contact: {
      given: String,
      family: String,
      relationship: String,
      phone: String,
      email: String,
    },
    index: Number,
    reset: Boolean,
  },

  data: (vm) => ({
    localContact: { ...vm.contact },
  }),

  watch: {
    localContact: {
      deep: true,

      handler(value) {
        this.editContact({ index: this.index, value });
      },
    },

    editedPatient() {
      this.localContact = { ...this.contact };
    },

    reset() {
      this.editContact([new ContactPatient()]);
    },
  },

  computed: {
    ...mapGetters({
      editedPatient: "patient/editedPatient",
    }),
  },

  methods: {
    ...mapActions({
      editContact: "patient/editContact",
    }),
  },
};
</script>

<style scoped></style>
