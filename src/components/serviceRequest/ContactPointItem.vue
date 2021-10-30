<template>
  <v-row>
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="systemLocal"
        :items="['EMAIL', 'TELÉFONO']"
        label="Tipo"
        @input="$v.localTelecom.system.$touch()"
        @blur="$v.localTelecom.system.$touch()"
        :error-messages="systemErrors"
      />
    </v-col>
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="useLocal"
        :items="['TRABAJO', 'PERSONAL']"
        label="Uso"
        @input="$v.localTelecom.use.$touch()"
        @blur="$v.localTelecom.use.$touch()"
        :error-messages="useErrors"
      />
    </v-col>

    <v-col cols="12" sm="6">
      <BaseTextfield
        v-if="isEmail"
        v-model="valueLocal"
        label="Email"
        @input="$v.localTelecom.valueTelecom.$touch()"
        @blur="$v.localTelecom.valueTelecom.$touch()"
        :error-messages="valueErrors"
      />
      <BaseTextfield
        v-else
        @input="$v.localTelecom.valueTelecom.$touch()"
        @blur="$v.localTelecom.valueTelecom.$touch()"
        :error-messages="valueErrors"
        v-model="valueLocal"
        label="Teléfono"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { validationMessage } from "../../helpers/ValidationMessage";
import ContactPointPatient from "../../models/ContactPointPatient";

export default {
  name: "ContactPointItem",

  mixins: [validationMixin],

  validations() {
    if (this.isEmail) {
      return {
        localTelecom: {
          use: { required },
          system: { required },
          valueTelecom: { email, required },
        },
      };
    } else {
      return {
        localTelecom: {
          use: { required },
          system: { required },
          valueTelecom: { required },
        },
      };
    }
  },

  props: {
    use: String,
    system: String,
    valueTelecom: String,
    value: String,
    index: Number,
    isFormValid: Boolean,
  },

  data: () => ({
    localTelecom: new ContactPointPatient(),
  }),

  mounted() {
    this.localTelecom.use = this.use;
    this.localTelecom.valueTelecom = this.valueTelecom;
    this.localTelecom.system = this.system;

    this.$emit("update:isFormValid", !this.$v.$invalid);
  },

  watch: {
    triggerErrorForm(value) {
      console.log("trigger error in telecom form");
      this.$emit("update:isFormValid", !this.$v.$invalid);
      value && this.$v.$touch();
    },

    isValid() {
      this.$emit("update:isFormValid", !this.$v.$invalid);
    },
  },

  computed: {
    ...mapGetters({
      editedPatient: "patient/editedPatient",
      triggerErrorForm: "patient/triggerFormErrorAdmitPatient",
    }),
    isEmail() {
      return this.localTelecom.system === "EMAIL";
    },

    useErrors() {
      const errors = [];
      if (!this.$v.localTelecom.use.$dirty) return errors;

      !this.$v.localTelecom.use.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    systemErrors() {
      const errors = [];
      if (!this.$v.localTelecom.system.$dirty) return errors;
      !this.$v.localTelecom.system.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    valueErrors() {
      const errors = [];
      if (!this.$v.localTelecom.valueTelecom.$dirty) return errors;

      if (this.isEmail) {
        !this.$v.localTelecom.valueTelecom.email &&
          errors.push(validationMessage.EMAIL);
        !this.$v.localTelecom.valueTelecom.required &&
          errors.push(validationMessage.REQUIRED);
      } else {
        !this.$v.localTelecom.valueTelecom.required &&
          errors.push(validationMessage.REQUIRED);
      }
      return errors;
    },

    useLocal: {
      get() {
        return this.use;
      },
      set(value) {
        this.$emit("update:use", value);
        this.localTelecom.use = value;
      },
    },

    isValid() {
      return !this.$v.$invalid;
    },

    systemLocal: {
      get() {
        return this.system;
      },
      set(value) {
        this.$emit("update:system", value);
        this.localTelecom.system = value;
      },
    },

    valueLocal: {
      get() {
        return this.valueTelecom;
      },
      set(value) {
        this.$emit("update:valueTelecom", value);
        this.localTelecom.value = value;
        this.localTelecom.valueTelecom = value;
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
