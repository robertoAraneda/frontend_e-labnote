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
              v-model="editedItem.identifierPatient[0].identifier_type_id"
              :items="[1, 2, 3]"
              label="Tipo documento"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <BaseTextfield
              v-model="editedItem.identifierPatient[0].value"
              label="Número documento"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-radio-group
              v-model="editedItem.identifierPatient[0].identifier_use_id"
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
            <BaseTextfield
              v-model="editedItem.humanName.given"
              label="Nombres"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <BaseTextfield
              v-model="editedItem.humanName.father_family"
              label="Apellido Paterno"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <BaseTextfield
              v-model="editedItem.humanName.mother_family"
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
                  v-model="editedItem.patient.birthdate"
                  label="Fecha de nacimiento"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="editedItem.patient.birthdate"
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
              v-model="editedItem.patient.administrative_gender_id"
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
          v-for="(address, index) in editedItem.addressPatient"
          :key="address.text + index"
        >
          <v-list-item-avatar size="24">
            <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <AddressSheet
              @use="editedItem.addressPatient[index].use = $event"
              @text="editedItem.addressPatient[index].text = $event"
              @city="editedItem.addressPatient[index].city_code = $event"
              @state="editedItem.addressPatient[index].state_code = $event"
              :states="states"
              :cities="cities"
              v-bind="editedItem.addressPatient[index]"
            />
          </v-list-item-content>

          <v-list-item-action v-if="editedItem.addressPatient.length !== 1">
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
          v-for="(contactPoint, index) in editedItem.contactPointPatient"
          :key="contactPoint.value + index"
        >
          <v-list-item-avatar size="24">
            <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <ContactPointSheet
              @system="editedItem.contactPointPatient[index].system = $event"
              @use="editedItem.contactPointPatient[index].use = $event"
              @value="editedItem.contactPointPatient[index].value = $event"
              v-bind="editedItem.contactPointPatient[index]"
            />
          </v-list-item-content>

          <v-list-item-action
            v-if="editedItem.contactPointPatient.length !== 1"
          >
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
          v-for="(contact, index) in editedItem.contactPatient"
          :key="contact.given + index"
        >
          <v-list-item-avatar size="24">
            <v-icon color="primary"> mdi-numeric-{{ index + 1 }}-box </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <ContactSheet
              @given="editedItem.contactPatient[index].given = $event"
              @family="editedItem.contactPatient[index].family = $event"
              @relationship="
                editedItem.contactPatient[index].relationship = $event
              "
              @phone="editedItem.contactPatient[index].phone = $event"
              @email="editedItem.contactPatient[index].email = $event"
              v-bind="editedItem.contactPatient[index]"
            />
          </v-list-item-content>

          <v-list-item-action v-if="editedItem.contactPatient.length !== 1">
            <v-btn icon @click="handleDestroyContactForm(index)">
              <v-icon color="grey lighten-1">mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-btn text> Cancel </v-btn>
        <v-btn color="primary" @click="savePatient"> Continue </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import AddressSheet from "../../components/serviceRequest/AddressSheet";
import ContactPointSheet from "../../components/serviceRequest/ContactPointSheet";
import ContactSheet from "../../components/serviceRequest/ContactSheet";
import { mapActions } from "vuex";
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
    editedItem: {
      patient: {
        birthdate: "1983-12-06",
        active: true,
        administrative_gender_id: 1,
      },
      identifierPatient: [
        {
          value: "15654738-7",
          identifier_type_id: 1,
          identifier_use_id: 1,
        },
      ],
      humanName: {
        use: "official",
        given: "ROBERTO ALEJANDRO",
        father_family: "ARANEDA",
        mother_family: "ESPINOZA",
      },
      contactPointPatient: [
        {
          value: "robaraneda@gmail.com",
          use: "Personal",
          system: "Email",
        },
        {
          value: "+56958639620",
          use: "Personal",
          system: "Celular",
        },
      ],
      addressPatient: [
        {
          use: "Casa",
          text: "texto de prueba",
          city_code: null,
          state_code: null,
        },
      ],

      contactPatient: [
        {
          given: "YOLANDA",
          family: "ESPINOZA",
          relationship: "Madre",
          phone: "+56958639620",
          email: "yolanda@gmail.com",
        },
      ],
    },
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
        this.editedItem.contactPatient[
          this.editedItem.contactPatient.length - 1
        ].relationship !== null &&
        this.editedItem.contactPatient[
          this.editedItem.contactPatient.length - 1
        ].given !== "" &&
        this.editedItem.contactPatient[
          this.editedItem.contactPatient.length - 1
        ].family !== ""
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
      this.editedItem.addressPatient.splice(index, 1);
    },

    handleDestroyContactPointForm(index) {
      console.log(index);
      this.editedItem.contactPointPatient.splice(index, 1);
    },

    handleDestroyContactForm(index) {
      console.log(index);
      this.editedItem.contactPatient.splice(index, 1);
    },

    handleNewAddress() {
      this.editedItem.addressPatient.push({
        use: "",
        text: "",
        city_id: null,
        district_id: null,
        state_id: null,
      });
    },

    handleNewContactPoint() {
      this.editedItem.contactPointPatient.push({
        value: "",
        use: null,
        system: null,
      });
    },

    handleNewContact() {
      if (this.validContact) {
        this.editedItem.contactPatient.push({
          given: "",
          family: "",
          relationship: null,
          phone: "",
          email: "",
        });
      } else {
        console.log("complete la información");
      }
    },
  },
};
</script>

<style scoped></style>
