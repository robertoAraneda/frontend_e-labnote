<template>
  <ContainerPatientForm subtitle="Identificación">
    <template v-slot:body>
      <v-list color="transparent">
        <v-list-item
          v-for="(identifier, index) in localIdentifiers"
          :key="index"
        >
          <v-list-item-content>
            <IdentifierPatientItem v-bind.sync="localIdentifiers[index]" />
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

import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { PatientIdentifierTypeEnum } from "../../enums/patient-identifier-type.enum";

export default {
  name: "IdentifierPatientList",

  components: { ContainerPatientForm, IdentifierPatientItem },

  mixins: [validationMixin],

  validations: {
    localIdentifiers: {
      required,
      $each: {
        value: { required },
        identifier_type_id: { required },
      },
    },
  },

  props: {
    reset: Boolean,
  },

  data: () => ({
    triggerValidation: false,
    openWarningMessage: false,
    localIdentifiers: [new IdentifierPatient()],
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
          ) &&
          this.handleIdentifierFormValid(!this.$v.$invalid);
      }
    },

    identifiers() {
      this.localIdentifiers = [
        ...this.identifiers.map((identifier) => {
          console.log("identifier", identifier);
          if (
            identifier.identifierType?.code === PatientIdentifierTypeEnum.RUT
          ) {
            return {
              ...identifier,
              valueRut: identifier.value,
            };
          }
          return {
            ...identifier,
            valueOther: identifier.value,
          };
        }),
      ];
      console.log("changing address");
    },

    isFormValid() {
      this.handleIdentifierFormValid(this.isFormValid);
    },
  },

  computed: {
    ...mapGetters({
      identifiers: "patient/identifier",
    }),

    isFormValid() {
      return !this.$v.$invalid;
    },
  },

  methods: {
    ...mapActions({
      setIdentifier: "patient/editIdentifier",
      handleIdentifierFormValid: "patient/identifierFormValid",
    }),
  },
};
</script>

<style scoped></style>
