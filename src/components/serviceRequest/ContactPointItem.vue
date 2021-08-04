<template>
  <v-row>
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="localTelecom.use"
        :items="['Casa', 'Trabajo', 'Personal']"
        label="Uso"
      />
    </v-col>
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="localTelecom.system"
        :items="['Email', 'Telefono fijo', 'Celular']"
        label="Tipo"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <BaseTextfield v-model="localTelecom.value" label="El tipo que sea" />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ContactPointItem",

  props: {
    telecom: {
      use: String,
      system: String,
      value: String,
    },
    index: Number,
  },

  data: (vm) => ({
    localTelecom: { ...vm.telecom },
  }),

  watch: {
    localTelecom: {
      deep: true,

      handler(value) {
        this.editTelecom({ index: this.index, value });
      },
    },
  },
  methods: {
    ...mapActions({
      editTelecom: "patient/editTelecom",
    }),
  },
};
</script>

<style scoped></style>
