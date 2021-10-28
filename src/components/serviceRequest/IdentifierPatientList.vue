<template>
  <ContainerPatientForm subtitle="Identificación">
    <template v-slot:body>
      <v-list color="transparent">
        <v-list-item v-for="n in identifiersLength" :key="n">
          <v-list-item-content>
            <IdentifierPatientItem v-bind.sync="identifiers[n - 1]" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </ContainerPatientForm>
</template>

<script>
import IdentifierPatientItem from "./IdentifierPatientItem";
import ContainerPatientForm from "./ContainerPatientForm";
import IdentifierPatient from "../../models/IdentifierPatient";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "IdentifierPatientList",

  components: { ContainerPatientForm, IdentifierPatientItem },

  props: {
    reset: Boolean,
  },

  data: () => ({
    isFormValid: false,
    triggerValidation: false,
    identifiers: [new IdentifierPatient()],
  }),

  watch: {
    emitFormData(value) {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        value &&
          this.setIdentifier(
            this.identifiers.map((identifier) => {
              const value = identifier.valueRut || identifier.valueOther;
              return { ...identifier, value };
            })
          );
      }
    },
  },

  computed: {
    ...mapGetters({
      emitFormData: "patient/emitFormData",
    }),
    identifiersLength() {
      return this.identifiers.length;
    },
  },

  methods: {
    ...mapActions({
      setIdentifier: "patient/editIdentifier",
    }),
  },
};
</script>

<style scoped></style>
