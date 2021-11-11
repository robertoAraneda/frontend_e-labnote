<template>
  <v-container id="main-header">
    <BaseHeaderModule
      title="Solicitud de exámenes"
      subtitle=" En éste módulo podrás generar solicitudes de exámenes."
    />

    <v-card v-if="serviceRequest.patient.identifier !== ''">
      <v-card-text>
        <v-card-title>
          <v-spacer />
          <v-subheader
            class="font-weight-bold text-uppercase primary--text text-h4"
            >{{ serviceRequest.patient.name.text }}</v-subheader
          >
          <v-spacer />
        </v-card-title>
        <v-sheet class="mx-auto" max-width="900">
          <v-row>
            <v-col cols="6">
              <v-list two-line class="transparent">
                <v-list-item>
                  <v-list-item-icon size="24">
                    <v-icon size="24">mdi-account-box</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="title font-weight-medium">{{
                      serviceRequest.patient.identifier.value
                    }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      serviceRequest.patient.identifier.identifierType.display
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon size="24">
                    <v-icon size="24">mdi-calendar-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      serviceRequest.patient.birthdate | transformDates
                    }}</v-list-item-title>
                    <v-list-item-subtitle
                      >Fecha de nacimiento</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon size="24">
                    <v-icon size="24"> mdi-calendar-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      >{{ serviceRequest.patient.age }} años</v-list-item-title
                    >
                    <v-list-item-subtitle>Edad</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="6">
              <v-list two-line class="transparent">
                <v-list-item
                  v-for="(telecom, index) in serviceRequest.patient.telecom"
                  :key="index"
                >
                  <v-list-item-icon size="24">
                    <v-icon size="24">{{
                      telecom.system === "EMAIL" ? "mdi-email" : "mdi-phone"
                    }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-action></v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ telecom.value }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      telecom.system
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-sheet>
      </v-card-text>
    </v-card>

    <v-card class="mt-3">
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-text>
                    <span class="subheading font-weight-medium text--primary"
                      >Fecha:</span
                    >
                    <v-menu
                      v-model="issuedDateMenu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          solo
                          hide-details
                          v-model="computedDateFormatted"
                          label="Fecha"
                          prepend-inner-icon="mdi-calendar"
                          class="mt-2"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date"
                        no-title
                        @input="issuedDateMenu = false"
                        :min="
                          new Date(
                            Date.now() - new Date().getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .substr(0, 10)
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-card-text>

                  <v-divider class="mx-4"></v-divider>

                  <v-card-text>
                    <span class="subheading">Seleccione una hora</span>

                    <v-chip-group
                      v-model="selection"
                      active-class="primary--text text--darken-2"
                    >
                      <v-chip v-for="size in sizes" :key="size" :value="size">
                        {{ size }}
                      </v-chip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="8">
            <v-chip-group
              mandatory
              color="error"
              column
              center-active
              v-model="priority"
            >
              <v-chip
                v-for="priority in serviceRequestPriorities"
                :key="priority.id"
                filter
                outlined
              >
                {{ priority.display }}
              </v-chip>
            </v-chip-group>

            <v-divider class="my-4" />

            <v-row no-gutters>
              <v-col cols="6">
                <BaseAutocomplete
                  dense
                  outlined
                  v-model="serviceRequest.location_id"
                  :items="locations"
                  flat
                  placeholder="Seleccione:"
                  item-value="id"
                  item-text="name"
                  label="Ubicación"
                  @input="$v.serviceRequest.location_id.$touch()"
                  @blur="$v.serviceRequest.location_id.$touch()"
                  :error-messages="locationErrors"
                ></BaseAutocomplete>
              </v-col>
              <v-col cols="1"></v-col>
              <v-col cols="5">
                <BaseAutocomplete
                  dense
                  outlined
                  v-model="serviceRequest.performer_id"
                  :items="practitioners"
                  flat
                  placeholder="Seleccione:"
                  item-value="id"
                  item-text="name"
                  label="Profesional solicitante"
                  @input="$v.serviceRequest.performer_id.$touch()"
                  @blur="$v.serviceRequest.performer_id.$touch()"
                  :error-messages="performerErrors"
                ></BaseAutocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="serviceRequest.diagnosis"
                  dense
                  outlined
                  label="Diagnóstico"
                  @input="$v.serviceRequest.diagnosis.$touch()"
                  @blur="$v.serviceRequest.diagnosis.$touch()"
                  :error-messages="diagnosisErrors"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="serviceRequest.note"
                  dense
                  outlined
                  label="Observaciones"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mt-3">
      <v-card-title>
        <v-subheader class="font-weight-bold text-uppercase"
          >Selección de exámenes</v-subheader
        >
        <v-spacer />
        <v-btn @click="handleOpenAdvancedSelecionDialog" color="primary"
          >Selección avanzada
        </v-btn>
      </v-card-title>

      <v-toolbar elevation="0" tile color="transparent">
        <v-spacer />
        <BaseAutocomplete
          hide-no-data
          hide-details
          v-model="selectedSpecimenCode"
          :items="specimenCodes"
          dense
          flat
          placeholder="Seleccione:"
          label="Tipo muestra"
        ></BaseAutocomplete>

        <BaseAutocomplete
          hide-no-data
          hide-details
          :items="observations"
          v-model="selectedObservation"
          flat
          dense
          placeholder="Seleccione:"
          item-value="id"
          item-text="name"
          label="Exámenes"
          prepend-icon="mdi-magnify"
          @change="test"
          class="ml-3"
        ></BaseAutocomplete>
        <v-spacer />
      </v-toolbar>
      <v-row justify="center">
        <v-col cols="10">
          <span
            class="subheading font-weight-medium text--primary text-uppercase"
            >Seleccionados: {{ defaultObservations.length }}</span
          >
          <v-card-text
            class="overflow-y-auto"
            :style="{ 'max-height': '500px' }"
          >
            <v-card elevation="3">
              <v-slide-y-transition class="py-0" group tag="v-list">
                <template v-for="(observation, i) in defaultObservations">
                  <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>
                  <v-list-item :key="observation.id">
                    <v-list-item-avatar width="100">
                      <span class="body-1 font-weight-light">{{
                        observation.loinc_num
                      }}</span>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ observation.core_name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ observation.specimen_code
                        }}<v-icon
                          @click="
                            handleFindObservationServiceRequestInfo(observation)
                          "
                          class="ml-2"
                          color="primary"
                          >mdi-information
                        </v-icon></v-list-item-subtitle
                      >
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-icon
                        @click="deleteObservation(observation)"
                        v-if="observation.id"
                        left
                      >
                        mdi-delete
                      </v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-slide-y-transition>
            </v-card>
          </v-card-text>
        </v-col>
      </v-row>

      <v-card-actions
        ><v-spacer /><v-btn
          @click="handleCancelServiceRequest"
          text
          color="secondary"
          >Cancelar</v-btn
        ><v-btn
          :loading="createServiceRequestLoadingButton"
          @click="handleCreateServiceRequest"
          color="primary"
          >Crear solicitud</v-btn
        ></v-card-actions
      >
    </v-card>

    <v-dialog v-model="advancedSelectionDialog">
      <v-card>
        <v-card-text style="height: 800px">
          <v-subheader class="text-uppercase headline font-weight-bold"
            >Selección avanzada de exámenes</v-subheader
          >

          <v-row>
            <v-col cols="8">
              <v-toolbar dark color="primary">
                <BaseAutocomplete
                  solo-inverted
                  hide-no-data
                  hide-details
                  v-model="selectedSpecimenCode"
                  :items="specimenCodes"
                  flat
                  placeholder="Seleccione:"
                  label="Tipo muestra"
                ></BaseAutocomplete>
                <v-spacer />
                <v-text-field
                  solo-inverted
                  hide-no-data
                  hide-details
                  label="Buscar examen"
                  v-model="searchObservation"
                ></v-text-field>
              </v-toolbar>
              <v-card class="overflow-y-auto">
                <v-card-text :style="{ height: '668px' }">
                  <v-row v-if="selectedSpecimenCode === 'TODAS LAS MUESTRAS'">
                    <v-col
                      cols="12"
                      v-for="specimen in specimenCodes"
                      :key="specimen.id"
                    >
                      <v-card
                        class="mt-n2"
                        color="grey lighten-5"
                        elevation="0"
                        v-if="
                          specimen !== 'TODAS LAS MUESTRAS' &&
                          extendedObservation[specimen] !== undefined
                        "
                      >
                        <v-card-text>
                          <v-subheader class="font-weight-bold">{{
                            specimen
                          }}</v-subheader>

                          <v-row class="mt-10">
                            <v-col
                              class="mt-n12"
                              v-for="observation in extendedObservation[
                                specimen
                              ]"
                              :key="observation.id"
                              cols="4"
                            >
                              <v-checkbox
                                dense
                                v-model="selectedObservations"
                                :value="observation.id"
                              >
                                <template v-slot:label
                                  ><span class="body-2">
                                    {{ observation.name }}</span
                                  >
                                </template>
                              </v-checkbox>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                      <v-card
                        class="mt-n2"
                        color="grey lighten-5"
                        elevation="0"
                        v-else-if="specimen !== 'TODAS LAS MUESTRAS'"
                      >
                        <v-card-text>
                          <v-subheader class="font-weight-bold">{{
                            specimen
                          }}</v-subheader>
                          <p>
                            No se han encontrado exámenes para este tipo de
                            muestra
                          </p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row v-else>
                    <v-col>
                      <v-card class="mt-3" color="grey lighten-5" elevation="0">
                        <v-card-text>
                          <v-subheader class="font-weight-bold">{{
                            selectedSpecimenCode
                          }}</v-subheader>
                          <v-row class="mt-10">
                            <v-col
                              class="mt-n12"
                              v-for="observation in extendedObservation[
                                selectedSpecimenCode
                              ]"
                              :key="observation.id"
                              cols="4"
                            >
                              <v-checkbox
                                dense
                                v-model="selectedObservations"
                                :value="observation.id"
                              >
                                <template v-slot:label
                                  ><span class="body-2">
                                    {{ observation.name }}</span
                                  >
                                </template>
                              </v-checkbox>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card
                elevation="0"
                class="mt-n10"
                :style="{
                  position: 'sticky',
                  top: '10px',
                }"
              >
                <v-toolbar elevation="0">
                  <v-spacer></v-spacer>
                  <v-btn
                    small
                    depressed
                    color="primary"
                    @click="advancedSelectionDialog = false"
                    class="mr-n6 mt-n8"
                    ><v-icon left>mdi-close</v-icon> cerrar</v-btn
                  ></v-toolbar
                >

                <v-card class="mt-n7">
                  <v-toolbar color="primary" dark flat tile>
                    <v-toolbar-title>Exámenes seleccionados</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-toolbar-title>
                      Total:

                      {{
                        observationAdvancedSelection.numberOfSelectedObservations
                      }}
                    </v-toolbar-title>
                  </v-toolbar>
                  <v-virtual-scroll
                    :items="detailObservation"
                    :item-height="50"
                    height="670"
                  >
                    <template v-slot:default="{ item, index }">
                      <v-list-item dense link>
                        <v-list-item-avatar>
                          {{ index + 1 }}
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="item.name"
                          ></v-list-item-title>
                          <v-list-item-subtitle>
                            {{ item.loinc_num }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon
                            @click="deleteObservation(item)"
                            color="secondary"
                          >
                            mdi-close-box
                          </v-icon>
                        </v-list-item-action>
                      </v-list-item>
                    </template>
                  </v-virtual-scroll>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog scrollable v-model="infoButton">
      <v-card>
        <v-card-title
          ><v-spacer /><v-btn
            color="primary"
            depressed
            @click="infoButton = false"
            >Cerrar</v-btn
          ></v-card-title
        >
        <v-card-text>
          <section class="white lighten-1">
            <div class="py-12"></div>

            <v-container class="text-center">
              <h2 class="display-2 font-weight-bold mb-3">SIEL</h2>
              <h2 class="display-1 font-weight-light mb-3">
                Sistema de información de exámenes de laboratorio
              </h2>

              <v-responsive class="mx-auto mb-12" width="56">
                <v-divider class="mb-1"></v-divider>

                <v-divider></v-divider>
              </v-responsive>
            </v-container>
          </section>
          <section>
            <v-container class="align-start grey lighten-3">
              <h2 class="display-1 font-weight-bold mb-3">{{ name }}</h2>
              <div class="d-flex align-start">
                <h2 class="headline font-weight-bold mb-3 mr-3 primary--text">
                  LOINC
                  <v-icon color="primary" class="mt-n3 ml-n2"
                    >mdi-registered-trademark</v-icon
                  >
                  :
                </h2>

                <h2 class="headline font-weight-bold mb-3 mr-3">
                  {{ loinc.loinc_num }}
                </h2>
                <h2 class="headline font-weight-medium mb-3">
                  {{ loinc.name }}
                </h2>
                <v-btn
                  class="mt-n2"
                  :href="`https://loinc.org/${loinc.loinc_num}/`"
                  target="_blank"
                  depressed
                  icon
                >
                  <v-icon color="orange darken-4"> mdi-open-in-new </v-icon>
                </v-btn>
              </div>

              <v-row>
                <v-col cols="12" md="4"> </v-col>
              </v-row>
            </v-container>
            <div class="py-3"></div>
          </section>
          <section>
            <div class="py-3"></div>
            <v-container class="align-start">
              <h2 class="headline font-weight-bold mb-3 mr-3 primary--text">
                INFORMACIÓN GENERAL
              </h2>
              <div class="primary" style="height: 2px"></div>
              <v-card flat>
                <v-card-title class="headlinefont-weight-medium text-uppercase">
                  Utilidad clínica
                </v-card-title>
                <v-card-text
                  style="text-align: justify; text-justify: inter-word"
                  v-text="clinicalInformation"
                  class="subtitle-1"
                >
                </v-card-text>
                <v-card-title class="headlinefont-weight-medium text-uppercase">
                  Recepción, procesamiento y tiempo de respuesta
                </v-card-title>
                <v-row>
                  <v-col cols="12" md="4" class="text-center">
                    <v-card class="py-12 px-4" color="grey lighten-5" flat>
                      <v-theme-provider dark>
                        <div>
                          <v-avatar color="primary" size="88">
                            <v-icon large>mdi-check</v-icon>
                          </v-avatar>
                        </div>
                      </v-theme-provider>

                      <v-card-title
                        class="justify-center font-weight-black text-uppercase"
                        >Recepción</v-card-title
                      >

                      <v-card-text class="subtitle-1"
                        >Las muestras se recepcionan en dependencias de nuestro
                        laboratorio
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4" class="text-center">
                    <v-card class="py-12 px-4" color="grey lighten-5" flat>
                      <v-theme-provider dark>
                        <div>
                          <v-avatar color="primary" size="88">
                            <v-icon large>mdi-biohazard</v-icon>
                          </v-avatar>
                        </div>
                      </v-theme-provider>

                      <v-card-title
                        class="justify-center font-weight-black text-uppercase"
                        >Procesamiento</v-card-title
                      >

                      <v-card-text class="subtitle-1"
                        >Procesamiento analítico en horario<br />
                        <v-chip dark color="orange darken-4" class="mt-3"
                          ><span class="font-weight-bold">{{
                            processTime
                          }}</span></v-chip
                        >
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4" class="text-center">
                    <v-card class="py-12 px-4" color="grey lighten-5" flat>
                      <v-theme-provider dark>
                        <div>
                          <v-avatar color="primary" size="88">
                            <v-icon large> mdi-clock</v-icon>
                          </v-avatar>
                        </div>
                      </v-theme-provider>

                      <v-card-title
                        class="justify-center font-weight-black text-uppercase"
                        >Tiempo de respuesta</v-card-title
                      >

                      <v-card-text class="subtitle-1"
                        >El tiempo de respuesta es de <br />
                        <v-chip dark color="orange darken-4" class="mt-3"
                          ><span class="font-weight-bold"
                            >1 DÍA HÁBIL</span
                          ></v-chip
                        >
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
            <div class="py-3"></div>
          </section>
          <section>
            <v-responsive class="mx-auto mb-12" width="56">
              <v-divider class="mb-1"></v-divider>

              <v-divider></v-divider>
            </v-responsive>
            <div class="py-3"></div>
            <v-container class="align-start">
              <h2 class="headline font-weight-bold mb-3 mr-3 primary--text">
                MUESTRA
              </h2>
              <div class="primary" style="height: 2px"></div>
              <v-card color="transparent" flat>
                <v-card-title class="headlinefont-weight-medium text-uppercase">
                  TIPO MUESTRA Y CONTENEDOR
                </v-card-title>
                <v-card-text class="subtitle-1">
                  <v-simple-table class="grey lighten-5">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <th class="text-left">TIPO MUESTRA</th>
                          <td class="text-left">:</td>
                          <td class="text-left">{{ specimen }}</td>
                        </tr>

                        <tr>
                          <th class="text-left">CONTENEDOR</th>
                          <td class="text-left">:</td>
                          <td class="text-left">{{ container }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table></v-card-text
                >
                <v-card-title class="headlinefont-weight-medium text-uppercase">
                  CONDICIONES DE TOMA DE MUESTRA
                </v-card-title>
                <v-card-text class="subtitle-1">
                  Paciente en ayunas
                </v-card-text>
              </v-card>
            </v-container>
            <div class="py-12"></div>
          </section>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500" v-model="dialogResponseCreateServiceRequest">
      <v-card class="pt-3 text-center">
        <v-card-text>
          <v-icon color="success" size="56">mdi-file-check-outline</v-icon>
        </v-card-text>
        <v-card-text class="justify-center headline">
          Se ha creado una solicitud confidencial</v-card-text
        >

        <v-card-actions class="justify-center"
          ><v-btn @click="handleViewPdf" color="secondary"
            >Imprimir solicitud confidencial</v-btn
          ><v-btn @click="handleNextRequest" color="primary"
            >Continuar</v-btn
          ></v-card-actions
        >
      </v-card>
    </v-dialog>

    <v-fab-transition>
      <v-btn
        v-if="isScrolling"
        color="primary"
        fab
        large
        dark
        bottom
        right
        fixed
        @click="$vuetify.goTo('#main-header')"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </v-fab-transition>

    <BaseSnackbar
      :custom-message="messageSnackbar"
      type="error"
      v-model="openWarningMessage"
    />
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getTimes, groupBy } from "../../helpers/Functions";
import moment from "moment";
import Patient from "../../models/Patient";

import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { validationMessage } from "../../helpers/ValidationMessage";
import { ConfidentialStatusEnum } from "../../enums/confidential-status.enum";

export default {
  name: "CreateServiceRequest",

  mixins: [validationMixin],

  validations: {
    serviceRequest: {
      patient_id: { required },
      location_id: { required },
      performer_id: { required },
      diagnosis: { required },
      observations: {
        required,
        $each: {
          service_request_observation_code_id: { required },
        },
      },
    },
  },

  data: (vm) => ({
    createServiceRequestLoadingButton: false,
    infoButton: false,
    messageSnackbar: "Faltan datos obligatorios",
    openWarningMessage: false,
    dialogResponseCreateServiceRequest: false,
    serviceRequest: {
      patient: {
        name: "",
        telecom: [],
        identifier: "",
        birthdate: "",
        age: "",
        insurance: "",
      },
      confidentialRequest: null,
      diagnosis: "",
      is_confidential: false,
      note: "",
      patient_id: "",
      location_id: null,
      performer_id: null,
      occurrence: "",
      service_request_priority_id: null,
      isReady: false,
      observations: [],
      not_confidential_observations: [],
      confidential_observations: [],
      not_confidential_specimens: [],
      confidential_specimens: [],
    },

    selectedObservationServiceRequest: null,

    defaultModel: new Patient(),
    priority: "",
    selectedSpecimenCode: "TODAS LAS MUESTRAS",
    selectedObservations: [],
    selectedConfidentialObservations: [],
    selectedNotConfidentialObservations: [],
    selectedSpecimens: [],
    selectedConfidentialSpecimens: [],
    selectedNotConfidentialSpecimens: [],
    searchObservation: "",
    advancedSelectionDialog: false,
    selectedObservation: "",
    scrollTop: 0,
    issuedDateMenu: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    selection: "",
    sizes: [],
  }),

  watch: {
    advancedSelectionDialog() {
      this.selectedSpecimenCode = "TODAS LAS MUESTRAS";
    },

    defaultObservations() {
      const groupedObservationByContainer = groupBy(
        this.defaultObservations,
        "container_id"
      );
      this.selectedSpecimens = Object.keys(groupedObservationByContainer).map(
        (container) => {
          return {
            container_id: parseInt(container),
            specimen_code_id:
              groupedObservationByContainer[container][0].specimen_id,
            patient_id: this.serviceRequest.patient_id,
          };
        }
      );

      //filtro de exámenes confidenciales para crear una solicitud exclusiva
      this.selectedConfidentialObservations = this.defaultObservations.filter(
        (observation) =>
          observation.isConfidential === ConfidentialStatusEnum.TRUE
      );

      const groupedConfidentialObservationByContainer = groupBy(
        this.selectedConfidentialObservations,
        "container_id"
      );

      //filtro de muestras confidenciales para crear una solicitud exclusiva
      this.selectedConfidentialSpecimens = Object.keys(
        groupedConfidentialObservationByContainer
      ).map((container) => {
        return {
          container_id: parseInt(container),
          specimen_code_id:
            groupedConfidentialObservationByContainer[container][0].specimen_id,
          patient_id: this.serviceRequest.patient_id,
        };
      });

      //filtro de exámenes no confidenciales para crear una solicitud exclusiva
      this.selectedNotConfidentialObservations =
        this.defaultObservations.filter(
          (observation) =>
            observation.isConfidential === ConfidentialStatusEnum.FALSE
        );

      const groupedNotConfidentialObservationByContainer = groupBy(
        this.selectedNotConfidentialObservations,
        "container_id"
      );

      //filtro de muestras no confidenciales para crear una solicitud exclusiva
      this.selectedNotConfidentialSpecimens = Object.keys(
        groupedNotConfidentialObservationByContainer
      ).map((container) => {
        return {
          container_id: parseInt(container),
          specimen_code_id:
            groupedNotConfidentialObservationByContainer[container][0]
              .specimen_id,
          patient_id: this.serviceRequest.patient_id,
        };
      });
    },

    date() {
      const currentDate = moment().format("YYYY-MM-DD");
      const selectedDate = moment(this.date).format("YYYY-MM-DD");

      if (currentDate === selectedDate) {
        this.sizes = getTimes(moment().format("HH"));
      } else {
        this.sizes = getTimes("00");
      }
    },
  },

  mounted() {
    if (!this.patient) {
      this.$router.push({ name: "findPatient" });
    } else {
      this.serviceRequest.patient.name = this.patient.name[0];
      this.serviceRequest.patient.birthdate = this.patient.birthdate;
      this.serviceRequest.patient_id = this.patient.id;
      this.serviceRequest.patient.identifier = this.patient.identifier[0];
      this.serviceRequest.patient.telecom = this.patient.telecom;

      const currentDate = moment();
      const momentBirthDatePatient = moment(this.patient.birthdate);

      this.serviceRequest.patient.age = currentDate.diff(
        momentBirthDatePatient,
        "years"
      ); // 1

      this.selection = currentDate.format("HH");

      this.priority = this.serviceRequestPriorities.findIndex(
        (priority) => priority.display === "RUTINA"
      );

      this.sizes = getTimes(moment().format("HH"));
    }
    this.getLocations();
    this.getPractitioners();
    this.getObservations();
    this.getSpecimenCodes();
    this.getServiceRequestStatuses();
  },
  beforeDestroy() {
    this.setPatientSelected(this.defaultModel);
  },

  filters: {
    transformDates(date) {
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    },
  },
  computed: {
    ...mapGetters({
      _locations: "location/locations",
      _practitioners: "practitioner/practitioners",
      _observations: "observationServiceRequest/observationServiceRequests",
      _specimenCodes: "specimenCode/specimens",
      _serviceRequestPriorities: "serviceRequest/serviceRequestPriorities",
      patient: "serviceRequest/patient",
      isServiceRequestCreatedByAppointment:
        "serviceRequest/isServiceRequestCreatedByAppointment",
      selectedAppointment: "serviceRequest/selectedAppointment",
      isScrolling: "isScrolling",
    }),

    locationErrors() {
      const errors = [];
      if (!this.$v.serviceRequest.location_id.$dirty) return errors;
      !this.$v.serviceRequest.location_id.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    performerErrors() {
      const errors = [];
      if (!this.$v.serviceRequest.performer_id.$dirty) return errors;
      !this.$v.serviceRequest.performer_id.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    diagnosisErrors() {
      const errors = [];
      if (!this.$v.serviceRequest.diagnosis.$dirty) return errors;
      !this.$v.serviceRequest.diagnosis.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    observationsErrors() {
      const errors = [];
      if (!this.$v.serviceRequest.observations.$dirty) return errors;
      !this.$v.serviceRequest.observations.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    name() {
      if (!this.selectedObservationServiceRequest) return "";
      return this.selectedObservationServiceRequest.name;
    },

    loinc() {
      if (!this.selectedObservationServiceRequest) return "";
      return this.selectedObservationServiceRequest._embedded.loinc;
    },
    clinicalInformation() {
      if (!this.selectedObservationServiceRequest) return "";
      return this.selectedObservationServiceRequest.clinical_information;
    },

    processTime() {
      if (!this.selectedObservationServiceRequest) return "";
      return this.selectedObservationServiceRequest._embedded.processTime.name;
    },

    specimen() {
      if (!this.selectedObservationServiceRequest) return "";
      return this.selectedObservationServiceRequest._embedded.specimenCode
        .display;
    },

    container() {
      if (!this.selectedObservationServiceRequest) return "";
      return this.selectedObservationServiceRequest._embedded.container.name;
    },

    computedDateFormatted() {
      return this.formatDate(this.date);
    },

    locations() {
      return this._locations.collection;
    },
    practitioners() {
      if (this._practitioners.length === 0) return [];
      return this._practitioners.collection.map((practitioner) => {
        return {
          id: practitioner.id,
          name: `${practitioner.rut} - ${practitioner.given} ${practitioner.family}`,
        };
      });
    },

    serviceRequestPriorities() {
      if (this._serviceRequestPriorities.length === 0) return [];
      return this._serviceRequestPriorities.collection;
    },

    observations() {
      if (this._observations.length === 0) return [];
      return this._observations.collection
        .map((observation) => {
          return {
            id: observation.id,
            name: `(${observation.loinc_num}) ${observation.name}`,
            specimen_code: observation.specimen_code,
          };
        })
        .filter((observation) => {
          console.log(observation);
          if (this.selectedSpecimenCode === "TODAS LAS MUESTRAS")
            return (
              observation && !this.selectedObservations.includes(observation.id)
            );
          return (
            observation.specimen_code === this.selectedSpecimenCode &&
            !this.selectedObservations.includes(observation.id)
          );
        });
    },

    defaultObservations() {
      if (this._observations.length === 0) return [];

      const defaultObservations = [];

      this._observations.collection.forEach((observation) => {
        if (this.selectedObservations.includes(observation.id)) {
          defaultObservations.unshift(observation);
        }
      });

      return defaultObservations;
    },

    extendedObservation() {
      if (this._observations.length === 0) return [];

      const observation = this._observations.collection
        .map((observation) => {
          return {
            id: observation.id,
            name: `(${observation.loinc_num}) ${observation.core_name}`,
            specimen_code: observation.specimen_code,
          };
        })
        .filter((observation) => {
          if (this.selectedSpecimenCode === "TODAS LAS MUESTRAS")
            return (
              observation &&
              (observation.name || "")
                .toLowerCase()
                .indexOf((this.searchObservation || "").toLowerCase()) > -1
            );
          return (
            observation.specimen_code === this.selectedSpecimenCode &&
            (observation.name || "")
              .toLowerCase()
              .indexOf((this.searchObservation || "").toLowerCase()) > -1
          );
        });

      return groupBy(observation, "specimen_code");
    },

    detailObservation() {
      if (this._observations.length === 0) return [];
      return this._observations.collection.filter((observation) => {
        return this.selectedObservations.some((selected) => {
          return observation.id === selected;
        });
      });
    },

    observationAdvancedSelection() {
      if (this._observations.length === 0) return [];
      const observations = this._observations.collection.filter(
        (observation) => {
          return this.selectedObservations.some((selected) => {
            return observation.id === selected;
          });
        }
      );

      const groupedObservations = groupBy(observations, "specimen_code");

      const samples = Object.keys(groupedObservations);

      return {
        numberOfSelectedObservations: observations.length,
        detail: samples.map((sample) => {
          return {
            name: sample,
            children: groupedObservations[sample].map((observation) =>
              Object.assign(observation, { divider: true })
            ),
          };
        }),
      };
    },

    specimenCodes() {
      if (this._specimenCodes.length === 0) return [];

      const specimens = this._specimenCodes.collection.map(
        (specimen) => `${specimen.display}`
      );

      specimens.unshift("TODAS LAS MUESTRAS");
      return specimens;
    },
  },

  methods: {
    ...mapActions({
      getLocations: "location/getItems",
      getPractitioners: "practitioner/getItems",
      getObservations: "observationServiceRequest/getItems",
      getSpecimenCodes: "specimenCode/getItems",
      getServiceRequestStatuses: "serviceRequest/getServiceRequestPriorities",
      create: "serviceRequest/postItem",
      setPatientSelected: "serviceRequest/setPatient",
      findObservationServiceRequest: "observationServiceRequest/showItem",
      viewPdf: "serviceRequest/viewPdf",
    }),

    handleNextRequest() {
      this.resetFormServiceRequest();
    },

    async handleViewPdf() {
      const response = await this.viewPdf(this.confidentialRequest);

      console.log(response);

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.href = url;
      link.setAttribute("target", "_blank");
      link.setAttribute("title", "prueba.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      this.confidentialRequest = null;
      this.resetFormServiceRequest();
    },

    async handleFindObservationServiceRequestInfo(item) {
      const { data } = await this.findObservationServiceRequest(
        item._links.self.href
      );

      this.selectedObservationServiceRequest = data;
      this.infoButton = true;
    },

    handleCancelServiceRequest() {
      this.resetFormServiceRequest();
    },

    resetFormServiceRequest() {
      this.setPatientSelected(null);

      if (this.isServiceRequestCreatedByAppointment) {
        this.$router.push({ name: "schedules" });
      } else {
        this.$router.push({ name: "findPatient" });
      }
    },

    async handleCreateServiceRequest() {
      this.createServiceRequestLoadingButton = true;
      /*
      if (this.selectedObservations.length !== 0) {
        this.serviceRequest.observations = this.selectedObservations.map(
          (observation) => {
            return {
              service_request_observation_code_id: parseInt(observation),
            };
          }
        );
      } else {
        this.serviceRequest.observations = [];
      }
      console.log(this.serviceRequest.observations);

      this.serviceRequest.specimens = this.selectedSpecimens;
       */

      if (this.selectedObservations.length !== 0) {
        //se agregan todos los examenes para efectos de validación. Tiene que existir al menos un examen seleccionado
        this.serviceRequest.observations = this.selectedObservations.map(
          (observation) => ({
            service_request_observation_code_id: parseInt(observation),
          })
        );

        //se agregan los exámenes no confidenciales
        this.serviceRequest.not_confidential_observations =
          this.selectedNotConfidentialObservations.map(
            (notConfidentialObservation) => ({
              service_request_observation_code_id: parseInt(
                notConfidentialObservation.id
              ),
            })
          );

        //se agregan los exámenes confidenciales
        this.serviceRequest.confidential_observations =
          this.selectedConfidentialObservations.map(
            (confidentialObservation) => ({
              service_request_observation_code_id: parseInt(
                confidentialObservation.id
              ),
            })
          );
        //se agregan las muestras confidenciales
        this.serviceRequest.confidential_specimens =
          this.selectedConfidentialSpecimens;

        //se agregan las muestras no confidenciales.
        this.serviceRequest.not_confidential_specimens =
          this.selectedNotConfidentialSpecimens;
      } else {
        this.serviceRequest.observations = [];
      }

      this.$v.$touch();

      if (this.$v.$invalid) {
        if (this.observationsErrors.length === 0) {
          this.messageSnackbar = "Faltan datos obligatorios";
        } else {
          this.messageSnackbar = "Debe seleccionar al menos un examen.";
        }

        this.openWarningMessage = true;
        this.createServiceRequestLoadingButton = false;
      } else {
        if (!this.selection) {
          this.selection = moment().format("HH");
        }

        const date = moment(this.date).format("YYYY-MM-DD");
        this.serviceRequest.occurrence = `${date} ${this.selection}:00:00`;
        this.serviceRequest.service_request_priority_id =
          this.serviceRequestPriorities[this.priority].id;

        const { note, ...rest } = this.serviceRequest;
        let payload = this.serviceRequest;
        if (!note) {
          payload = rest;
        }

        const { data } = await this.create(payload);

        if ("confidential" in data) {
          this.confidentialRequest = data.confidential;
          this.dialogResponseCreateServiceRequest = true;
        } else {
          //
        }
        this.createServiceRequestLoadingButton = false;
      }
    },

    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },

    onScroll(e) {
      this.scrollTop = e.target.scrollTop;
    },

    handleOpenAdvancedSelecionDialog() {
      this.advancedSelectionDialog = true;
    },

    test(observation) {
      this.selectedObservations.push(observation);
      this.selectedObservation = "";
    },

    deleteObservation(observation) {
      const index = this.selectedObservations.indexOf(observation.id);

      this.selectedObservations.splice(index, 1);

      this.selectedObservation = 0;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
