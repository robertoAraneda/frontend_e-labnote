<template>
  <v-row class="justify-center">
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="localType"
        :items="localIdentifierTypes"
        item-text="display"
        item-value="id"
        label="Tipo documento"
      />
    </v-col>
    <v-col cols="12" sm="5">
      <BaseTextfield
        v-model="localValueRut"
        v-if="isRut"
        label="Rut"
        maxlength="9"
        @keypress.enter="handleFindPatient"
        :error-messages="valueRutErrors"
        @input="$v.localIdentifier.valueRut.$touch()"
        @blur="
          $v.localIdentifier.valueRut.$touch();
          handleMaskRut();
        "
      />
      <BaseTextfield
        v-else
        label="Número documento"
        @keypress.enter="handleFindPatient"
        v-model="localValueOther"
        :error-messages="valueOtherErrors"
        @input="$v.localIdentifier.valueOther.$touch()"
        @blur="$v.localIdentifier.valueOther.$touch()"
      />
    </v-col>
    <v-col cols="2">
      <v-btn @click="handleFindPatient" block depressed color="primary"
        >Buscar</v-btn
      >
    </v-col>
    <v-col cols="2">
      <v-btn block @click="handleResetForm" depressed color="secondary"
        >Limpiar</v-btn
      >
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { PatientIdentifierTypeEnum } from "../../enums/patient-identifier-type.enum";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { validationMessage } from "../../helpers/ValidationMessage";
import IdentifierPatient from "../../models/IdentifierPatient";
import Patient from "../../models/Patient";

export default {
  name: "IdentifierPatientItem",

  mixins: [validationMixin],

  validations() {
    if (this.isRut) {
      return {
        localIdentifier: {
          valueRut: {
            required,
            minLength: minLength(6),
          },
          identifier_type_id: { required },
        },
      };
    } else {
      return {
        localIdentifier: {
          valueOther: { required },
          identifier_type_id: { required },
        },
      };
    }
  },

  props: {
    identifier_type_id: Number,
    valueRut: String,
    valueOther: String,
    index: Number,
  },

  data: () => ({
    localIdentifier: new IdentifierPatient(),
    defaultItem: new Patient(),
  }),

  async mounted() {
    await this.getIdentifierUses();
    await this.getIdentifierTypes();
  },

  watch: {
    identifier_type_id() {
      this.$emit("update:valueRut", "");
      this.$emit("update:valueOther", "");
    },

    triggerErrorForm(value) {
      console.log("triggered in identifier form");
      value && this.$v.$touch();
    },
  },

  computed: {
    ...mapGetters({
      identifierTypes: "patient/identifierTypes",
      identifierUses: "patient/identifierUses",
      editedPatient: "patient/editedPatient",
      triggerErrorForm: "patient/triggerFormErrorAdmitPatient",
    }),

    localType: {
      get() {
        return this.identifier_type_id;
      },
      set(value) {
        this.$emit("update:identifier_type_id", value);
      },
    },

    localValueRut: {
      get() {
        return this.valueRut;
      },
      set(value) {
        this.$emit("update:valueRut", value);
        this.localIdentifier.valueRut = value;
      },
    },

    localValueOther: {
      get() {
        return this.valueOther;
      },
      set(value) {
        this.$emit("update:valueOther", value);
        this.localIdentifier.valueOther = value;
      },
    },

    isRut() {
      return this.localType === 1;
    },

    typeErrors() {
      const errors = [];
      if (!this.$v.localIdentifier.identifier_type_id.$dirty) return errors;
      !this.$v.localIdentifier.identifier_type_id.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    valueRutErrors() {
      const errors = [];
      if (!this.$v.localIdentifier.valueRut.$dirty) return errors;
      !this.$v.localIdentifier.valueRut.required &&
        errors.push(validationMessage.REQUIRED);
      !this.$v.localIdentifier.valueRut.minLength &&
        errors.push("Número inválido");

      return errors;
    },

    valueOtherErrors() {
      const errors = [];
      if (!this.$v.localIdentifier.valueOther.$dirty) return errors;
      !this.$v.localIdentifier.valueOther.required &&
        errors.push(validationMessage.REQUIRED);

      return errors;
    },

    localIdentifierTypes() {
      return this.identifierTypes.filter(
        (identifierType) =>
          identifierType.code !== PatientIdentifierTypeEnum.CONFIDENTIAL
      );
    },
  },

  methods: {
    ...mapActions({
      editIdentifier: "patient/editIdentifier",
      getIdentifierTypes: "patient/getIdentifierTypes",
      getIdentifierUses: "patient/getIdentifierUses",
      findPatientByIdentifier: "patient/findPatientByIdentifier",
      setEditedPatient: "patient/setEditedPatient",
      setPatient: "patient/setPatient",
      triggerAdmitPatientForm: "patient/showAdmitForm",
    }),

    handleMaskRut() {
      const rut = this.localValueRut.replace("-", "");

      let mask = "";
      switch (rut.length) {
        case 7:
          mask = "######-N";
          break;
        case 8:
          mask = "#######-N";
          break;
        case 9:
          mask = "########-N";
          break;
        default:
          mask = "##########";
      }

      this.localValueRut = this.$options.filters.VMask(rut, mask);
    },

    handleResetForm() {
      this.setPatient(this.defaultItem);
      this.setEditedPatient(this.defaultItem);
      this.localValueRut = "";
      this.localValueOther = "";
      this.triggerAdmitPatientForm(false);
      this.$v.$reset();
    },

    async handleFindPatient() {
      if (this.isRut) {
        this.localIdentifier.value = this.localValueRut;
      } else {
        this.localIdentifier.value = this.localValueOther;
      }
      if (this.localIdentifier.value) {
        const patient = await this.findPatientByIdentifier(
          this.localIdentifier
        );

        if (!patient) {
          this.triggerAdmitPatientForm(true);
        }
      }
    },
  },
};
</script>

<style scoped></style>
