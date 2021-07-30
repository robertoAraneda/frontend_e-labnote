<template>
  <div>
    <BaseHeaderModule
      title="Admisión de pacientes"
      subtitle=" En éste módulo podrás gestionar los pacientes de E-labNote."
    />
    <v-card elevation="0" flat class="mb-12">
      <v-subheader>Identificación</v-subheader>
      <v-sheet outlined rounded class="px-3 mx-3" :color="backgroundColorSheet">
        <v-row>
          <v-col cols="12" sm="2">
            <BaseSelect
              v-model="editedItem.identifier[0].identifier_type_id"
              :items="[1, 2, 3]"
              label="Tipo documento"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <BaseTextfield
              v-model="editedItem.identifier[0].value"
              label="Número documento"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-radio-group
              v-model="editedItem.identifier[0].identifier_use_id"
              row
            >
              <v-radio label="Oficial" :value="2"></v-radio>
              <v-radio label="Temporal" :value="3"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-sheet>
      <v-subheader>Datos demográficos</v-subheader>
      <v-sheet outlined rounded class="px-3 mx-3" :color="backgroundColorSheet">
        <v-row>
          <v-col cols="12" sm="4">
            <BaseTextfield v-model="editedItem.name.given" label="Nombres" />
          </v-col>
          <v-col cols="12" sm="4">
            <BaseTextfield
              v-model="editedItem.name.father_family"
              label="Apellido Paterno"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <BaseTextfield
              v-model="editedItem.name.mother_family"
              label="Apellido Materno"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="editedItem.birthdate"
                  label="Fecha de nacimiento"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="editedItem.birthdate"
                :active-picker.sync="activePicker"
                :max="
                  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .substr(0, 10)
                "
                min="1900-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6">
            <BaseSelect
              v-model="editedItem.gender"
              :items="[1, 2, 3]"
              label="Género"
            />
          </v-col>
        </v-row>
      </v-sheet>
      <v-subheader
        >Dirección
        <v-spacer />
        <BaseAcceptButton
          @click="handleNewAddress"
          label="Agregar otra dirección"
          small
      /></v-subheader>
      <v-list>
        <v-list-item
          v-for="(address, index) in editedItem.address"
          :key="address.text + index"
        >
          <v-list-item-avatar size="24">
            <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <AddressSheet
              @use="editedItem.address[index].use = $event"
              @text="editedItem.address[index].text = $event"
              @city="editedItem.address[index].city_code = $event"
              @state="editedItem.address[index].state_code = $event"
              :states="states"
              :cities="cities"
              v-bind="editedItem.address[index]"
            />
          </v-list-item-content>

          <v-list-item-action v-if="editedItem.address.length !== 1">
            <v-btn icon @click="handleDestroyAddressForm(index)">
              <v-icon color="grey lighten-1">mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-subheader
        >Medio de contacto <v-spacer />
        <BaseAcceptButton
          @click="handleNewContactPoint"
          label="Agregar otro medio "
          small
      /></v-subheader>
      <v-list>
        <v-list-item
          v-for="(contactPoint, index) in editedItem.telecom"
          :key="contactPoint.value + index"
        >
          <v-list-item-avatar size="24">
            <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <ContactPointSheet
              @system="editedItem.telecom[index].system = $event"
              @use="editedItem.telecom[index].use = $event"
              @value="editedItem.telecom[index].value = $event"
              v-bind="editedItem.telecom[index]"
            />
          </v-list-item-content>

          <v-list-item-action v-if="editedItem.telecom.length !== 1">
            <v-btn icon @click="handleDestroyContactPointForm(index)">
              <v-icon color="grey lighten-1">mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-subheader class="mt-6"
        >Contacto adicional
        <v-spacer />
        <BaseAcceptButton
          @click="handleNewContact"
          label="Agregar otro contacto"
          small
        />
      </v-subheader>
      <v-list>
        <v-list-item
          v-for="(contact, index) in editedItem.contact"
          :key="contact.given + index"
        >
          <v-list-item-avatar size="24">
            <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <ContactSheet
              @given="editedItem.contact[index].given = $event"
              @family="editedItem.contact[index].family = $event"
              @relationship="editedItem.contact[index].relationship = $event"
              @phone="editedItem.contact[index].phone = $event"
              @email="editedItem.contact[index].email = $event"
              v-bind="editedItem.contact[index]"
            />
          </v-list-item-content>

          <v-list-item-action v-if="editedItem.contact.length !== 1">
            <v-btn icon @click="handleDestroyContactForm(index)">
              <v-icon color="grey lighten-1">mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-btn text> Cancelar </v-btn>
        <v-btn color="primary" @click="savePatient"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import AddressSheet from "../../components/serviceRequest/AddressSheet";
import ContactPointSheet from "../../components/serviceRequest/ContactPointSheet";
import ContactSheet from "../../components/serviceRequest/ContactSheet";
import Patient from "../../models/Patient";
import AddressPatient from "../../models/AddressPatient";
import ContactPointPatient from "../../models/ContactPointPatient";
import ContactPatient from "../../models/ContactPatient";
export default {
  name: "AdmitPatient",
  components: { ContactSheet, ContactPointSheet, AddressSheet },
  mixins: [validationMixin],

  validations: {
    editedItem: {
      patient: {
        birthdate: { required },
        gender_id: { required },
      },
      humanNames: {
        use: { required },
        given: { required },
        father_family: { required },
        mother_family: { required },
      },
    },
  },

  data: () => ({
    test: "",
    addressLength: 1,
    chip1: true,
    chip2: true,
    activePicker: null,
    date: null,
    menu: false,
    states: [],
    cities: [],
    editedItem: new Patient(),
  }),

  async mounted() {
    const { data: states_ } = await this.getStates();

    this.states = states_.collection;

    const { data: cities_ } = await this.getCities();
    this.cities = cities_.collection;
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  computed: {
    backgroundColorSheet() {
      return "grey lighten-5";
    },

    validContact() {
      return (
        this.editedItem.contact[this.editedItem.contact.length - 1]
          .relationship !== null &&
        this.editedItem.contact[this.editedItem.contact.length - 1].given !==
          "" &&
        this.editedItem.contact[this.editedItem.contact.length - 1].family !==
          ""
      );
    },
  },

  methods: {
    ...mapActions({
      store: "patient/postItem",
      getStates: "patient/getStates",
      getCities: "patient/getCities",
    }),

    savePatient() {
      this.store(this.editedItem);
      console.log(this.editedItem);
    },

    save(date) {
      this.$refs.menu.save(date);
    },

    handleDestroyAddressForm(index) {
      console.log(index);
      this.editedItem.address.splice(index, 1);
    },

    handleDestroyContactPointForm(index) {
      console.log(index);
      this.editedItem.telecom.splice(index, 1);
    },

    handleDestroyContactForm(index) {
      console.log(index);
      this.editedItem.contact.splice(index, 1);
    },

    handleNewAddress() {
      this.editedItem.address.push(new AddressPatient());
    },

    handleNewContactPoint() {
      this.editedItem.telecom.push(new ContactPointPatient());
    },

    handleNewContact() {
      if (this.validContact) {
        this.editedItem.contact.push(new ContactPatient());
      } else {
        console.log("complete la información");
      }
    },
  },
};
</script>

<style scoped></style>
