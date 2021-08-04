<template>
  <v-row>
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="contact.relationship"
        :items="['Padre', 'Madre', 'Hermano/a', 'Abuelo/a', 'Tío/a', 'Otro']"
        label="Relación de contacto"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <BaseTextfield v-model="contact.given" label="Nombres" />
    </v-col>
    <v-col cols="12" sm="5">
      <BaseTextfield v-model="contact.family" label="Apellidos" />
    </v-col>
    <v-col cols="12" sm="6">
      <BaseTextfield v-model="contact.phone" label="Teléfono" />
    </v-col>
    <v-col cols="12" sm="6">
      <BaseTextfield v-model="contact.email" label="Email" />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";

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
  },
  methods: {
    ...mapActions({
      editContact: "patient/editContact",
    }),
  },
};
</script>

<style scoped></style>
