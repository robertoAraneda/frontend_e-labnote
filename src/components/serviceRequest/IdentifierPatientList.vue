<template>
  <ContainerPatientForm subtitle="Identificación">
    <template v-slot:body>
      <v-list color="transparent">
        <v-list-item
          v-for="(identifier, index) in localIdentifiers"
          :key="index"
        >
          <v-list-item-content>
            <IdentifierPatientItem
              :isFormValid.sync="isValid"
              v-bind.sync="localIdentifiers[index]"
              :resetForm="reset"
            />
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
    isValid: false,
  }),

  watch: {
    emitFormData() {
      this.$v.$touch();

      this.handleIdentifierFormValid(this.isValid);

      this.setIdentifier(
        this.localIdentifiers.map((identifier) => {
          let value = identifier.valueOther;
          if (
            identifier.identifierType?.code === PatientIdentifierTypeEnum.RUT
          ) {
            value = identifier.valueRut;
          }
          return { ...identifier, value };
        })
      );
    },

    identifiers() {
      this.localIdentifiers = [
        ...this.identifiers.map((identifier) => {
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
    },

    reset() {
      if (this.reset) this.$emit("update:reset", false);
    },
  },

  computed: {
    ...mapGetters({
      identifiers: "patient/identifier",
      emitFormData: "patient/emitFormData",
    }),
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
