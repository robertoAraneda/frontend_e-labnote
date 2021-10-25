<template>
  <v-row>
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="localTelecom.system"
        :items="['EMAIL', 'TELÉFONO']"
        label="Tipo"
        @input="$v.localTelecom.system.$touch()"
        @blur="$v.localTelecom.system.$touch()"
        :error-messages="systemErrors"
      />
    </v-col>
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="localTelecom.use"
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
        v-model="localTelecom.value"
        label="Email"
        @input="$v.localTelecom.value.$touch()"
        @blur="$v.localTelecom.value.$touch()"
        :error-messages="valueErrors"
      />
      <BaseTextfield
        v-else
        @input="$v.localTelecom.value.$touch()"
        @blur="$v.localTelecom.value.$touch()"
        :error-messages="valueErrors"
        v-model="localTelecom.value"
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

export default {
  name: "ContactPointItem",

  mixins: [validationMixin],

  validations() {
    if (this.isEmail) {
      return {
        localTelecom: {
          use: { required },
          system: { required },
          value: { email, required },
        },
      };
    } else {
      return {
        localTelecom: {
          use: { required },
          system: { required },
          value: { required },
        },
      };
    }
  },

  props: {
    telecom: {
      use: String,
      system: String,
      value: String,
    },
    index: Number,
    triggerValidation: Boolean,
  },

  data: (vm) => ({
    localTelecom: { ...vm.telecom },
  }),

  watch: {
    localTelecom: {
      deep: true,

      handler(value) {
        this.editTelecom({ index: this.index, value });
        this.$emit("validated", !this.$v.$invalid);
      },
    },

    editedPatient() {
      this.localAddress = { ...this.address };
    },

    triggerValidation() {
      console.log("trigger");
      this.$v.$touch();
      this.$emit("validated", !this.$v.$invalid);
    },
  },

  computed: {
    ...mapGetters({
      editedPatient: "patient/editedPatient",
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
      if (!this.$v.localTelecom.value.$dirty) return errors;

      if (this.isEmail) {
        !this.$v.localTelecom.value.email &&
          errors.push(validationMessage.EMAIL);
        !this.$v.localTelecom.value.required &&
          errors.push(validationMessage.REQUIRED);
      } else {
        !this.$v.localTelecom.value.required &&
          errors.push(validationMessage.REQUIRED);
      }
      return errors;
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
