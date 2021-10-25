<template>
  <ContainerPatientForm subtitle="Dirección">
    <template v-slot:leftButton>
      <BaseAcceptButton
        @click="handleAddNewAddress"
        label="Agregar otra dirección"
        small
        :loading="triggerValidation"
      />
    </template>
    <template v-slot:body>
      <v-list three-line color="transparent">
        <v-list-item
          v-for="(address, index) in addresses"
          :key="address.text + index"
        >
          <v-list-item-avatar v-if="addresses.length !== 1" size="24">
            <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <AddressPatientItem
              @validated="isValid"
              :trigger-validation="triggerValidation"
              :index="index"
              :address="address"
            />
            <v-divider v-if="index < addresses.length - 1"></v-divider>
          </v-list-item-content>

          <v-list-item-action v-if="addresses.length !== 1">
            <v-btn icon @click="destroyAddressItem(index)">
              <v-icon color="grey lighten-1">mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </template>
  </ContainerPatientForm>
</template>

<script>
import AddressPatientItem from "./AddressPatientItem";
import { mapActions, mapGetters } from "vuex";
import ContainerPatientForm from "./ContainerPatientForm";
import AddressPatient from "../../models/AddressPatient";
export default {
  name: "AddressPatientList",

  data: () => ({
    defaultItem: new AddressPatient(),
    isFormValid: false,
    triggerValidation: false,
  }),

  components: { ContainerPatientForm, AddressPatientItem },

  computed: {
    ...mapGetters({
      addresses: "patient/address",
    }),
  },

  methods: {
    ...mapActions({
      addNewAddress: "patient/addNewAddress",
      destroyAddressItem: "patient/destroyAddressItem",
    }),

    isValid(value) {
      console.log(value);

      this.isFormValid = value;
    },

    handleAddNewAddress() {
      this.triggerValidation = true;

      setTimeout(() => {
        if (this.isFormValid) {
          this.addNewAddress(this.defaultItem);
          this.isFormValid = false;
        }

        this.triggerValidation = false;
      }, 500);
    },
  },
};
</script>

<style scoped></style>
