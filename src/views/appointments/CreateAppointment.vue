(
<template>
  <v-container>
    <BaseHeaderModule
      title="Módulo de gestión de bloques"
      subtitle="En este módulo podrás gestionar los bloques para agendar horas de pacientes."
    />
    <v-sheet class="pa-3">
      <v-row>
        <v-col cols="12" sm="3" md="4">
          <v-date-picker
            color="secondary"
            ref="picker"
            v-model="date"
            full-width
            header-color="primary"
            show-current
            :picker-date.sync="pickerDate"
            :events="arrayEvents"
            :event-color="colorEvent"
          ></v-date-picker>
          <v-divider class="my-2" />
          <v-alert
            border="left"
            colored-border
            type="info"
            color="primary"
            elevation="2"
            class="mt-3"
            >Las fechas con indicador
            <span class="error--text mr-1 font-weight-bold">ROJO</span>
            <span class="text-decoration-underline">no</span>

            contienen bloques horarios disponibles.</v-alert
          >
        </v-col>
        <v-col cols="12" sm="9" md="8">
          <v-stepper non-linear v-model="e1">
            <v-stepper-header>
              <v-stepper-step editable :complete="e1 > 1" step="1">
                Buscar cliente
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step editable :complete="e1 > 2" step="2">
                Seleccionar bloque
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card elevation="0">
                  <v-sheet elevation="1" class="ma-3">
                    <v-tabs grow v-model="tabs" slider-color="white">
                      <v-tabs-slider></v-tabs-slider>
                      <v-tab href="#mobile-tabs-5-1">
                        POR NÚMERO DE IDENTIFICACIÓN
                      </v-tab>

                      <v-tab href="#mobile-tabs-5-2">
                        POR DATOS DEMOGRÁFICOS
                      </v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tabs">
                      <v-tab-item value="mobile-tabs-5-1">
                        <v-card flat>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" sm="4">
                                <BaseSelect
                                  :items="identifierTypes"
                                  item-text="display"
                                  item-value="id"
                                  label="Tipo documento"
                                />
                              </v-col>
                              <v-col cols="12" sm="4">
                                <BaseTextfield
                                  v-model="editedItem.father_family"
                                  label="N° Documento"
                                />
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12">
                                <base-accept-button
                                  small
                                  label="Buscar"
                                  class="float-right mb-3"
                                  @click="findPatientByNames(editedItem)"
                                ></base-accept-button>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item value="mobile-tabs-5-2">
                        <v-card flat>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" sm="4">
                                <BaseTextfield
                                  v-model="editedItem.given"
                                  label="Nombres"
                                />
                              </v-col>
                              <v-col cols="12" sm="4">
                                <BaseTextfield
                                  v-model="editedItem.father_family"
                                  label="Primer apellido"
                                />
                              </v-col>
                              <v-col cols="12" sm="4">
                                <BaseTextfield
                                  v-model="editedItem.mother_family"
                                  label="Segundo apellido"
                                />
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12">
                                <base-accept-button
                                  small
                                  label="Buscar"
                                  class="float-right mb-3"
                                  @click="findPatientByNames(editedItem)"
                                ></base-accept-button>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-sheet>
                  <v-sheet elevation="1" class="ma-3">
                    <v-subheader class="text-body-1 primary--text"
                      >Seleccione un usuario para continuar</v-subheader
                    >
                    <v-data-table
                      v-model="selectedPatient"
                      :headers="headers"
                      :items="patients"
                      class="elevation-0 mt-3 row-pointer"
                      hide-default-footer
                      @click:row="handleSelectedPatient"
                      show-select
                      single-select
                      :item-class="colorRow"
                      item-key="id"
                    >
                    </v-data-table>
                  </v-sheet>
                </v-card>
                <v-divider class="my-3" />
                <div class="float-right">
                  <v-btn color="primary" depressed rounded @click="e1 = 2">
                    Continuar
                  </v-btn>
                </div>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-row>
                  <v-col cols="5">
                    <v-sheet class="pa-3" color="white">
                      <v-subheader
                        >Seleccione una fecha en el calendario</v-subheader
                      >
                      <v-text-field
                        dense
                        outlined
                        disabled
                        v-model="date"
                      ></v-text-field>
                      <v-subheader>Seleccione un bloque horario</v-subheader>
                      <v-select
                        v-model="appointintment.slot_id"
                        outlined
                        dense
                        :items="availableSlot"
                        item-value="id"
                        item-text="text"
                      ></v-select>
                      <v-subheader>Comentarios</v-subheader>
                      <v-textarea
                        v-model="appointintment.description"
                        outlined
                        auto-grow
                        rows="3"
                      ></v-textarea>
                    </v-sheet>
                  </v-col>
                  <v-col cols="7">
                    <v-card
                      v-if="selectedPatientFromDatatable"
                      elevation="0"
                      max-width="500"
                      min-height="400"
                      class="px-3"
                      color="grey lighten-4"
                    >
                      <v-card-text class="grey-text">
                        <v-list class="ml-n6 mr-n5 grey lighten-4" two-line>
                          <v-list-item>
                            <v-list-item-icon>
                              <v-icon color="primary"
                                >mdi-account-box-outline</v-icon
                              >
                            </v-list-item-icon>

                            <v-list-item-content>
                              <v-list-item-title class="text-h6">
                                {{ selectedPatientFromDatatable.name[0].given }}
                              </v-list-item-title>
                              <v-list-item-subtitle
                                >{{
                                  selectedPatientFromDatatable.name[0]
                                    .father_family
                                }}
                                {{
                                  selectedPatientFromDatatable.name[0]
                                    .mother_family
                                }}</v-list-item-subtitle
                              >
                            </v-list-item-content>
                          </v-list-item>

                          <v-list-item>
                            <v-list-item-action></v-list-item-action>

                            <v-list-item-content>
                              <v-list-item-title>
                                {{ identifier.value }}
                              </v-list-item-title>
                              <v-list-item-subtitle>{{
                                identifier.identifierType.display
                              }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action class="mt-n2"
                              >{{ age }} años</v-list-item-action
                            >
                          </v-list-item>

                          <v-divider inset></v-divider>
                          <v-list-item
                            v-for="(phone, index) in telecomsPhone"
                            :key="phone.id"
                          >
                            <v-list-item-icon v-if="index === 0">
                              <v-icon color="primary"> mdi-phone </v-icon>
                            </v-list-item-icon>
                            <v-list-item-action v-else></v-list-item-action>

                            <v-list-item-content>
                              <v-list-item-title
                                v-html="phone.value"
                              ></v-list-item-title>
                              <v-list-item-subtitle
                                v-html="phone.system"
                              ></v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>

                          <v-divider inset></v-divider>

                          <v-list-item
                            v-for="(email, index) in telecomsEmail"
                            :key="email.value"
                          >
                            <v-list-item-icon v-if="index === 0">
                              <v-icon color="primary"> mdi-email </v-icon>
                            </v-list-item-icon>
                            <v-list-item-action v-else></v-list-item-action>

                            <v-list-item-content>
                              <v-list-item-title
                                v-html="email.value"
                              ></v-list-item-title>
                              <v-list-item-subtitle
                                v-html="email.system"
                              ></v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>

                          <v-divider inset></v-divider>

                          <v-list-item
                            v-for="(address, index) in addresses"
                            :key="address.text"
                          >
                            <v-list-item-icon v-if="index === 0">
                              <v-icon color="primary"> mdi-map-marker </v-icon>
                            </v-list-item-icon>
                            <v-list-item-action v-else></v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title
                                v-html="address.text"
                              ></v-list-item-title>
                              <v-list-item-subtitle
                                >{{ address.city_name }},
                                {{ address.state_name }}</v-list-item-subtitle
                              >
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                    <v-card
                      v-else
                      elevation="0"
                      max-width="374"
                      min-height="300"
                      class="pa-3"
                      color="grey lighten-3"
                    >
                      <v-card-text class="text-center">
                        <v-icon size="64">mdi-account-box-outline</v-icon>
                      </v-card-text>
                      <v-card-text class="grey-text text-center">
                        <div class="text-h6">No hay</div>
                        <div class="text-h6">paciente</div>
                        <div class="text-h6">seleccionado</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-divider class="my-3" />
                <div class="float-right">
                  <v-btn color="secondary" text @click="e1 = 1"> Cancel </v-btn>
                  <v-btn
                    color="primary"
                    depressed
                    rounded
                    @click="handleSaveAppointment"
                  >
                    Guardar
                  </v-btn>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { EnumSlotStatus } from "../../enums/EnumSlotStatus";
import moment from "moment";

export default {
  name: "CreateAppointment",

  data: () => ({
    e1: 1,

    date: "",
    pickerDate: null,
    arrayEvents: [],
    arraySlots: [],

    tabs: null,
    editedItem: {
      given: "",
      father_family: "araneda",
      mother_family: "",
    },

    appointintment: {
      patient_id: "",
      slot_id: "",
      description: "",
    },

    selectedPatient: [],

    headers: [
      {
        text: "N° Documento",
        value: "identifier[0].value",
        sortable: false,
      },
      {
        text: "Nombre",
        value: "name[0].given",
        sortable: false,
      },
      {
        text: "Primer apellido",
        value: "name[0].father_family",
        sortable: false,
      },
      {
        text: "Segundo apellido",
        value: "name[0].mother_family",
        sortable: false,
      },
    ],
  }),

  mounted() {
    this.getIdentifierTypes();
  },

  watch: {
    async pickerDate(value) {
      const slots = await this.getSlotsByDate(value);

      this.arraySlots = slots.collection;

      this.arrayEvents = slots.collection.map((slot) =>
        slot.start.slice(0, 10)
      );
    },
    selectedPatient() {
      if (this.selectedPatient.length !== 0) {
        this.appointintment.patient_id = this.selectedPatient[0].id;
      }
    },
  },

  computed: {
    ...mapGetters({
      patients: "patient/patients",
      identifierTypes: "patient/identifierTypes",
    }),

    availableSlot() {
      if (!this.date) return [];
      return this.arraySlots
        .filter((slot) => {
          return (
            slot.start.includes(this.date) &&
            slot.slot_status_id === EnumSlotStatus.FREE
          );
        })
        .map((slot) => ({
          id: slot.id,
          text: `${slot.start.slice(10, 16)} - ${slot.end.slice(10, 16)} `,
        }));
    },

    selectedPatientFromDatatable() {
      if (this.selectedPatient.length === 0) return null;
      return this.selectedPatient[0];
    },

    telecomsEmail() {
      if (!this.selectedPatientFromDatatable) return [];
      return this.selectedPatientFromDatatable.telecom.filter(
        (telecom) => telecom.system === "Email"
      );
    },
    telecomsPhone() {
      if (!this.selectedPatientFromDatatable) return [];
      return this.selectedPatientFromDatatable.telecom.filter(
        (telecom) => telecom.system === "Celular"
      );
    },
    addresses() {
      if (!this.selectedPatientFromDatatable) return [];
      return this.selectedPatientFromDatatable.address;
    },
    identifier() {
      if (!this.selectedPatientFromDatatable) return null;
      return this.selectedPatientFromDatatable.identifier[0];
    },
    age() {
      if (!this.selectedPatientFromDatatable) return null;

      const currentDate = moment();

      const age = moment(this.selectedPatientFromDatatable.birthdate);

      return currentDate.diff(age, "year", false);
    },
  },
  methods: {
    ...mapActions({
      getSlotsByDate: "slot/getItemsByDate",
      findPatientByNames: "patient/findPatientByNames",
      getIdentifierTypes: "patient/getIdentifierTypes",
      findPatientByIdentifier: "patient/findPatientByIdentifier",
      setPatient: "serviceRequest/setPatient",
      store: "appointment/postItem",
      setSelectedDateWhenPatientIsAppointment:
        "appointment/setSelectedDateWhenAppointment",
    }),

    async handleSaveAppointment() {
      await this.store(this.appointintment);
      this.setSelectedDateWhenPatientIsAppointment(this.date);
      await this.$router.push({ name: "schedules" });
    },

    colorRow(item) {
      if (
        this.selectedPatient.length !== 0 &&
        item.id === this.selectedPatient[0].id
      ) {
        return "selected";
      }
    },

    async handleSelectedPatient(item) {
      console.log(item);
      if (this.selectedPatient.length === 1) {
        this.selectedPatient = [];
      } else {
        this.selectedPatient.push(item);
      }
    },

    colorEvent(event) {
      const filteredDates = this.arraySlots.filter((slot) => {
        return slot.start.includes(event);
      });

      const availableDates = filteredDates.filter(
        (slot) => slot.slot_status_id === EnumSlotStatus.FREE
      );

      if (availableDates.length === 0) {
        return "error";
      }
      return "success darken-1";
    },
  },
};
</script>

<style scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
