<template>
  <ContainerPatientForm subtitle="Contacto adicional">
    <template v-slot:leftButton>
      <BaseAcceptButton
        @click="addNewItem(defaultItem)"
        label="Agregar otro contacto"
        small
      />
    </template>
    <template v-slot:body>
      <v-list three-line color="transparent">
        <v-list-item
          v-for="(contact, index) in contacts"
          :key="contact.given + index"
        >
          <v-list-item-avatar v-if="contacts.length !== 1" size="24">
            <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <ContactPatientItem
              :reset="reset"
              :index="index"
              :contact="contact"
            />
            <v-divider v-if="index < contacts.length - 1"></v-divider>
          </v-list-item-content>

          <v-list-item-action v-if="contacts.length !== 1">
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
import ContactPatientItem from "./ContactPatientItem";
import { mapActions, mapGetters } from "vuex";
import ContactPatient from "../../models/ContactPatient";
export default {
  name: "ContactPatientList",

  data: () => ({
    defaultItem: new ContactPatient(),
  }),

  components: { ContactPatientItem, ContainerPatientForm },

  props: {
    reset: Boolean,
  },

  computed: {
    ...mapGetters({
      contacts: "patient/contact",
    }),
  },

  methods: {
    ...mapActions({
      addNewItem: "patient/addNewContact",
      destroyItem: "patient/destroyContactItem",
    }),
  },
};
</script>

<style scoped></style>
