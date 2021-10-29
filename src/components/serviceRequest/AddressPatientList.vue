<template>
  <div>
    <ContainerPatientForm subtitle="Dirección">
      <template v-slot:leftButton>
        <BaseAcceptButton
          @click="handleAddNewAddress"
          label="Agregar otra dirección"
          small
        />
      </template>
      <template v-slot:body>
        <v-list three-line color="transparent">
          <v-list-item
            v-for="(address, index) in localAddresses"
            :key="address.text + index"
          >
            <v-list-item-avatar v-if="localAddresses.length !== 1" size="24">
              <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <AddressPatientItem
                :index="index"
                v-bind.sync="localAddresses[index]"
              />
              <v-divider v-if="index < localAddresses.length - 1"></v-divider>
            </v-list-item-content>

            <v-list-item-action v-if="localAddresses.length !== 1">
              <v-btn icon @click="destroyAddressItem(index)">
                <v-icon color="grey lighten-1">mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
    </ContainerPatientForm>
    <BaseSnackbar
      custom-message="No puede agregar una nueva dirección. Faltan datos obligatorios."
      type="error"
      v-model="openWarningMessage"
    />
  </div>
</template>

<script>
import AddressPatientItem from "./AddressPatientItem";
import { mapActions, mapGetters } from "vuex";
import ContainerPatientForm from "./ContainerPatientForm";
import AddressPatient from "../../models/AddressPatient";

import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "AddressPatientList",

  components: { ContainerPatientForm, AddressPatientItem },

  mixins: [validationMixin],

  validations: {
    localAddresses: {
      required,
      $each: {
        use: { required },
        text: { required },
        state_code: { required },
        city_code: { required },
      },
    },
  },

  data: () => ({
    localAddresses: [new AddressPatient()],
    triggerValidation: false,
    openWarningMessage: false,
  }),

  watch: {
    addresses() {
      this.localAddresses = [
        ...this.addresses.map((address) => ({
          ...address,
          textAddress: address.text,
        })),
      ];
      console.log("changing address");
    },

    emitFormData() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.editAddresses(
          this.localAddresses.map((address) => ({
            ...address,
            text: address.textAddress,
          }))
        ) && this.handleAddressFormValid(!this.$v.$invalid);
      }
    },
  },
  computed: {
    ...mapGetters({
      addresses: "patient/address",
      emitFormData: "patient/emitFormData",
    }),
  },

  methods: {
    ...mapActions({
      addNewAddress: "patient/addNewAddress",
      destroyAddressItem: "patient/destroyAddressItem",
      editAddresses: "patient/editAddress",
      emitTriggerErrorForm: "patient/triggerErrorForm",
      handleAddressFormValid: "patient/addressFormValid",
    }),

    handleAddNewAddress() {
      this.emitTriggerErrorForm();

      if (!this.$v.$invalid) {
        this.localAddresses.push(new AddressPatient());
      } else {
        this.openWarningMessage = true;
        console.log("falta informacióm");
      }
    },
  },
};
</script>

<style scoped></style>
