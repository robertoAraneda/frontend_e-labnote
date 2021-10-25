<template>
  <v-row>
    <v-col cols="12" sm="3">
      <BaseSelect
        v-model="localAddress.use"
        :items="['Particular', 'Trabajo']"
        label="Uso"
        @input="$v.localAddress.use.$touch()"
        @blur="$v.localAddress.use.$touch()"
        :error-messages="addressUseErrors"
      />
    </v-col>
    <v-col cols="12" sm="9">
      <BaseTextfield
        @input="$v.localAddress.text.$touch()"
        @blur="$v.localAddress.text.$touch()"
        :error-messages="addressTextErrors"
        v-model="localAddress.text"
        label="Dirección"
      />
    </v-col>
    <v-col cols="12" sm="7">
      <BaseAutocomplete
        v-model="localAddress.state_code"
        :items="states"
        item-text="name"
        item-value="code"
        label="Región"
        @input="$v.localAddress.state_code.$touch()"
        @blur="$v.localAddress.state_code.$touch()"
        :error-messages="addressStateCodeErrors"
      />
    </v-col>
    <v-col cols="12" sm="5">
      <BaseAutocomplete
        v-model="localAddress.city_code"
        :items="cities"
        item-text="name"
        item-value="code"
        label="Comuna"
        @input="$v.localAddress.city_code.$touch()"
        @blur="$v.localAddress.city_code.$touch()"
        :error-messages="addressCityCodeErrors"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { validationMessage } from "../../helpers/ValidationMessage";

export default {
  name: "AddressPatientItem",

  mixins: [validationMixin],

  validations: {
    localAddress: {
      use: { required },
      text: { required },
      city_code: { required },
      state_code: { required },
    },
  },

  props: {
    address: {
      use: String,
      text: String,
      city_code: String,
      state_code: String,
    },
    index: Number,
    triggerValidation: Boolean,
  },

  data: (vm) => ({
    localAddress: { ...vm.address },
  }),

  watch: {
    localAddress: {
      deep: true,

      handler(value) {
        this.editAddress({ index: this.index, value });

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
      states: "patient/states",
      cities: "patient/cities",
      editedPatient: "patient/editedPatient",
    }),

    addressUseErrors() {
      const errors = [];
      if (!this.$v.localAddress.use.$dirty) return errors;
      !this.$v.localAddress.use.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    addressTextErrors() {
      const errors = [];
      if (!this.$v.localAddress.text.$dirty) return errors;
      !this.$v.localAddress.text.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    addressCityCodeErrors() {
      const errors = [];
      if (!this.$v.localAddress.city_code.$dirty) return errors;
      !this.$v.localAddress.city_code.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    addressStateCodeErrors() {
      const errors = [];
      if (!this.$v.localAddress.state_code.$dirty) return errors;
      !this.$v.localAddress.state_code.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },
  },

  methods: {
    ...mapActions({
      editAddress: "patient/editAddress",
    }),
  },
};
</script>

<style scoped></style>
