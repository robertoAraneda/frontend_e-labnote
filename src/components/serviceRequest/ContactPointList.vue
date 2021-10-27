<template>
  <ContainerPatientForm subtitle="Medio de contacto">
    <template v-slot:leftButton>
      <BaseAcceptButton
        @click="handleAddNewTelecom"
        label="Agregar otro medio "
        small
        :loading="triggerValidation"
      />
    </template>
    <template v-slot:body>
      <v-list three-line color="transparent">
        <v-list-item
          v-for="(telecom, index) in telecoms"
          :key="telecom.value + index"
        >
          <v-list-item-avatar v-if="telecoms.length !== 1" size="24">
            <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <ContactPointItem
              @validated="isValid"
              :trigger-validation="triggerValidation"
              :index="index"
              :telecom="telecom"
              :reset="reset"
            />
            <v-divider v-if="index < telecoms.length - 1"></v-divider>
          </v-list-item-content>

          <v-list-item-action v-if="telecoms.length !== 1">
            <v-btn icon @click="destroyItem(index)">
              <v-icon color="grey lighten-1">mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </template>
  </ContainerPatientForm>
</template>

<script>
import ContainerPatientForm from "./ContainerPatientForm";
import ContactPointItem from "./ContactPointItem";
import { mapActions, mapGetters } from "vuex";
import ContactPointPatient from "../../models/ContactPointPatient";
export default {
  name: "ContactPointList",

  data: () => ({
    defaultItem: new ContactPointPatient(),
    isFormValid: false,
    triggerValidation: false,
  }),

  components: { ContactPointItem, ContainerPatientForm },

  props: {
    reset: Boolean,
  },

  computed: {
    ...mapGetters({
      telecoms: "patient/telecom",
    }),
  },

  methods: {
    ...mapActions({
      addNewItem: "patient/addNewTelecom",
      destroyItem: "patient/destroyTelecomItem",
    }),

    isValid(value) {
      this.isFormValid = value;
    },

    handleAddNewTelecom() {
      this.triggerValidation = true;

      setTimeout(() => {
        if (this.isFormValid) {
          this.addNewItem(this.defaultItem);
          this.isFormValid = false;
        }

        this.triggerValidation = false;
      }, 500);
    },
  },
};
</script>

<style scoped></style>
