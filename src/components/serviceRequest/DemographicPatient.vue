<template>
  <ContainerPatientForm subtitle="Datos demográficos">
    <template v-slot:body>
      <v-row>
        <v-col cols="12" sm="4">
          <BaseTextfield v-model="name.given" label="Nombres" />
        </v-col>
        <v-col cols="12" sm="4">
          <BaseTextfield
            v-model="name.father_family"
            label="Apellido Paterno"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <BaseTextfield
            v-model="name.mother_family"
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
                v-model="birthdate"
                label="Fecha de nacimiento"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
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
            v-model="localGender"
            :items="administrativeGenders"
            item-text="display"
            item-value="id"
            label="Género"
          />
        </v-col>
      </v-row>
    </template>
  </ContainerPatientForm>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ContainerPatientForm from "./ContainerPatientForm";

export default {
  name: "DemographicPatient",

  components: { ContainerPatientForm },

  data: () => ({
    activePicker: null,
    date: null,
    menu: false,
  }),

  async mounted() {
    await this.getAdministrativeGenders();
  },

  computed: {
    ...mapGetters({
      name: "patient/name",
      birthdate: "patient/birthdate",
      active: "patient/active",
      gender: "patient/gender",
      administrativeGenders: "patient/administrativeGenders",
    }),

    localGender: {
      get() {
        return this.gender;
      },
      set(value) {
        this.setGender(value);
      },
    },

    backgroundColorSheet() {
      return "grey lighten-5";
    },
  },

  methods: {
    ...mapActions({
      setBirthdate: "patient/editBirthdate",
      setGender: "patient/editAdministrativeGender",
      getAdministrativeGenders: "patient/getAdministrativeGenders",
    }),

    save(date) {
      this.setBirthdate(date);
      this.$refs.menu.save(date);
    },
  },
};
</script>

<style scoped></style>
