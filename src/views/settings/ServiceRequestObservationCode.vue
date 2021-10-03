<template>
  <div>
    <BaseHeaderModule
      title="Configuración de prestaciones"
      subtitle="En este módulo podrás crear las prestaciones utilizadas para la creación de solicitud de medios diagnósticos"
    />
    <BaseDatatable
      @deleteItem="handleDeleteModel($event)"
      @editItem="handleEditModel($event)"
      @changeStatus="handleChangeStatus($event)"
      @searchItem="handleShowItem($event)"
      :can-update="canUpdate"
      :can-delete="canDelete"
      :can-show="canShow"
      :items="items"
      :headers="headers"
      sort-by="id"
    >
      <template slot="select">
        <BaseAutocomplete
          v-model="selectedWorkArea"
          placeholder="Seleccione:"
          :items="workareas"
          item-value="id"
          item-text="name"
          label="Área de trabajo"
          single-line
          hide-details
        />
      </template>
      <template slot="searchButton">
        <BaseAcceptButton
          @click="openDialog"
          label="Crear examen"
          v-if="canCreate"
        />
      </template>
    </BaseDatatable>

    <BaseSnackbar v-model="snackbar" :type="type" />

    <BaseConfirmDelete
      @closeDelete="closeDeleteDialog"
      @deleteItemConfirm="deleteItemConfirm()"
      :dialog-delete="dialogDelete"
    />

    <v-dialog
      v-model="observationDialog"
      transition="dialog-top-transition"
      max-width="1200"
    >
      <template v-slot:default="dialog">
        <v-card class="elevation-0">
          <v-toolbar elevation="0" tile color="primary" dark>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-toolbar flat>
              <v-spacer />
              <v-subheader class="text-h4 text-decoration-underline">{{
                name
              }}</v-subheader>
              <v-spacer />
            </v-toolbar>
            <v-row justify="center">
              <v-col cols="7">
                <small>
                  **El nombre del examen se construye de forma automática con la
                  combinación de la prestación base y el tipo de muestra.</small
                >
              </v-col>
            </v-row>

            <v-subheader class="text-h6">LOINC: </v-subheader>
            <v-toolbar flat outlined class="mb-6 blue-grey lighten-5">
              <v-toolbar-items>
                <v-text-field
                  class="mt-3 centered-input text-h6"
                  color="primary"
                  v-model="searchLoinc"
                  placeholder="Buscar por código"
                  @input="$v.searchLoinc.$touch()"
                  @blur="$v.searchLoinc.$touch()"
                  :error-messages="loincErrors"
                ></v-text-field
              ></v-toolbar-items>
              <v-spacer />
              <v-toolbar-title
                class="text-truncate ml-2 text-decoration-underline"
                >{{ longCommonName }}</v-toolbar-title
              >
              <v-spacer />
            </v-toolbar>
            <v-textarea
              outlined
              v-model="clinical_information"
              label="Información clínica"
              @input="$v.clinical_information.$touch()"
              @blur="$v.clinical_information.$touch()"
              :error-messages="clinicalInformationErrors"
            ></v-textarea>

            <v-card outlined elevation="0">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6" lg="6" xl="4">
                    <BaseAutocomplete
                      v-model="selectedAnalytes"
                      :items="analytes"
                      flat
                      placeholder="Seleccione:"
                      item-value="id"
                      item-text="name"
                      label="Prestación base"
                      @remove="selectedAnalytes = null"
                      return-object
                      @change="$v.selectedAnalytes.$touch()"
                      @blur="$v.selectedAnalytes.$touch()"
                      :error-messages="analyteErrors"
                    ></BaseAutocomplete>
                  </v-col>

                  <v-col cols="12" md="6" lg="6" xl="4">
                    <BaseAutocomplete
                      v-model="selectedSpecimens"
                      :items="specimens"
                      flat
                      placeholder="Seleccione:"
                      item-value="id"
                      item-text="display"
                      label="Tipo de muestra"
                      @remove="selectedSpecimens = null"
                      return-object
                      @change="$v.selectedSpecimens.$touch()"
                      @blur="$v.selectedSpecimens.$touch()"
                      :error-messages="specimenErrors"
                    ></BaseAutocomplete>
                  </v-col>

                  <v-col cols="12" md="6" lg="4" xl="3">
                    <BaseAutocomplete
                      v-model="selectedAvailability"
                      :items="availabilities"
                      flat
                      placeholder="Seleccione:"
                      item-value="id"
                      item-text="name"
                      label="Disponibilidad"
                      @remove="selectedAvailability = null"
                      return-object
                      @change="$v.selectedAvailability.$touch()"
                      @blur="$v.selectedAvailability.$touch()"
                      :error-messages="availabilityErrors"
                    ></BaseAutocomplete>
                  </v-col>

                  <v-col cols="12" md="6" lg="4" xl="3">
                    <BaseAutocomplete
                      v-model="selectedMedicalRequestTypes"
                      :items="medicalRequestTypes"
                      flat
                      placeholder="Seleccione:"
                      item-value="id"
                      item-text="name"
                      label="Tipo de solicitud médica"
                      @remove="selectedMedicalRequestTypes = null"
                      return-object
                      @change="$v.selectedMedicalRequestTypes.$touch()"
                      @blur="$v.selectedMedicalRequestTypes.$touch()"
                      :error-messages="medicalRequestTypeErrors"
                    ></BaseAutocomplete>
                  </v-col>

                  <v-col cols="12" md="6" lg="4" xl="3">
                    <BaseAutocomplete
                      v-model="selectedProcessTimes"
                      :items="processTimes"
                      flat
                      placeholder="Seleccione:"
                      item-value="id"
                      item-text="name"
                      label="Tiempo de proceso"
                      @remove="selectedProcessTimes = null"
                      return-object
                      @change="$v.selectedProcessTimes.$touch()"
                      @blur="$v.selectedProcessTimes.$touch()"
                      :error-messages="processTimeErrors"
                    ></BaseAutocomplete>
                  </v-col>

                  <v-col cols="12" md="6" lg="4" xl="3">
                    <BaseAutocomplete
                      v-model="selectedLocations"
                      :items="locations"
                      flat
                      placeholder="Seleccione:"
                      item-value="id"
                      item-text="name"
                      label="Ubicación"
                      @remove="selectedWorkarea = null"
                      return-object
                      @change="$v.selectedLocations.$touch()"
                      @blur="$v.selectedLocations.$touch()"
                      :error-messages="locationErrors"
                    ></BaseAutocomplete>
                  </v-col>

                  <v-col cols="12" md="6" lg="6" xl="4">
                    <BaseAutocomplete
                      v-model="selectedContainers"
                      :items="containers"
                      flat
                      placeholder="Seleccione:"
                      item-value="id"
                      item-text="name"
                      label="Tipo de contenedor"
                      @remove="selectedContainers = null"
                      return-object
                      @change="$v.selectedContainers.$touch()"
                      @blur="$v.selectedContainers.$touch()"
                      :error-messages="containerErrors"
                    ></BaseAutocomplete>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <BaseCancelButton label="Cancelar" @click="dialog.value = false" />
            <BaseAcceptButton @click="save" label="Guardar" />
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
import { WorkareaHeaders } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { findIndex, validateLoincCode } from "../../helpers/Functions";
import ObservationServiceRequest from "../../models/ObservationServiceRequest";

export default {
  name: "ServiceRequestObservationCode",

  mixins: [validationMixin],

  validations: {
    searchLoinc: { validateLoincCode },
    selectedAvailability: { required },
    selectedAnalytes: { required },
    selectedContainers: { required },
    selectedSpecimens: { required },
    selectedMedicalRequestTypes: { required },
    selectedProcessTimes: { required },
    selectedLocations: { required },
    clinical_information: { required },
  },

  data: () => ({
    dialog: false,
    editedIndex: -1,
    snackbar: false,
    headers: WorkareaHeaders,
    dialogDelete: false,
    type: SnackbarType.SUCCESS,
    selectedWorkArea: null,
    workareas: [],
    itemToEdit: {},
    observationDialog: false,
    loincs: [],

    isLoading: false,
    searchLoinc: null,
    loinc: null,
    clinical_information: "",
    redirectToList: false,

    editedItem: new ObservationServiceRequest(),
    editedDefault: new ObservationServiceRequest(),

    selectedAvailability: null,
    selectedAnalytes: null,
    selectedContainers: null,
    selectedSpecimens: null,
    selectedMedicalRequestTypes: null,
    selectedProcessTimes: null,
    selectedLocations: null,

    itemsContainers: [],
    itemsMedicalRequestTypes: [],
    itemsProcessTimes: [],
    itemsSpecimens: [],
    itemsAnalytes: [],
    itemsAvailabilities: [],
    itemsLocations: [],
  }),

  async mounted() {
    await this.index();
    await this.handleSelectForm();
    await this.getAvailabilities();
    await this.getLocations();
    await this.getContainers();
    await this.getSpecimens();
    await this.getAnalytes();
    await this.getProcessTimes();
    await this.getMedicalRequestTypes();
  },

  watch: {
    async searchLoinc(val) {
      this.isLoading = true;

      const test = validateLoincCode(val);

      if (test) {
        try {
          const response = await this.findLoincByCodeFHIR(val);

          if (response.status === 404) {
            this.loincs = [{ long_common_name: "Código LOINC no encontrado" }];
          } else {
            this.loincs = [response.data];
            this.editedItem.loinc_num = val;
          }
        } catch (e) {
          console.log(e);
        } finally {
          this.isLoading = false;
        }
      } else {
        this.loincs = [];
      }
    },

    name() {
      this.editedItem.name = this.name;
    },

    selectedAvailability() {
      this.editedItem.availability_id = this.selectedAvailability.id;
    },

    selectedContainers() {
      this.editedItem.container_id = this.selectedContainers.id;
    },

    selectedMedicalRequestTypes() {
      this.editedItem.medical_request_type_id =
        this.selectedMedicalRequestTypes.id;
    },

    selectedAnalytes() {
      this.editedItem.analyte_id = this.selectedAnalytes.id;
    },

    selectedProcessTimes() {
      this.editedItem.process_time_id = this.selectedProcessTimes.id;
    },

    selectedSpecimens() {
      this.editedItem.specimen_code_id = this.selectedSpecimens.id;
    },

    selectedLocations() {
      this.editedItem.location_id = this.selectedLocations.id;
    },

    clinical_information() {
      this.editedItem.clinical_information = this.clinical_information;
    },
  },

  computed: {
    ...mapGetters({
      _workareas: "workarea/workareas",
      _namedPermissions: "auth/namedPermissions",
      _observationServiceRequests:
        "observationServiceRequest/observationServiceRequests",
      _availabilities: "availability/availabilities",
      _containers: "container/containers",
      _specimens: "specimen/specimens",
      _analytes: "analyte/analytes",
      _processTimes: "processTime/processTimes",
      _locations: "location/locations",
      _medicalRequestTypes: "medicalRequestType/medicalRequestTypes",
    }),

    name() {
      if (!this.selectedAnalytes || !this.selectedSpecimens) return "";
      return `${this.selectedAnalytes.name}, ${this.selectedSpecimens.display}`.toUpperCase();
    },

    availabilities() {
      if (!this._availabilities) return [];
      return this._availabilities.collection;
    },

    containers() {
      if (!this._containers) return [];
      return this._containers.collection;
    },

    analytes() {
      if (!this._analytes) return [];
      return this._analytes.collection;
    },

    processTimes() {
      if (!this._processTimes) return [];
      return this._processTimes.collection;
    },

    medicalRequestTypes() {
      if (!this._medicalRequestTypes) return [];
      return this._medicalRequestTypes.collection;
    },

    specimens() {
      if (!this._specimens) return [];
      return this._specimens.collection;
    },

    locations() {
      if (!this._locations) return [];
      return this._locations.collection;
    },

    longCommonName() {
      if (this.loincs.length !== 0) return this.loincs[0].long_common_name;
      return "";
    },

    loincErrors() {
      const errors = [];
      if (!this.$v.searchLoinc.$dirty) return errors;
      !this.$v.searchLoinc.validateLoincCode && errors.push("Código inválido");
      return errors;
    },

    clinicalInformationErrors() {
      const errors = [];
      if (!this.$v.clinical_information.$dirty) return errors;
      !this.$v.clinical_information.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    availabilityErrors() {
      const errors = [];
      if (!this.$v.selectedAvailability.$dirty) return errors;
      !this.$v.selectedAvailability.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    analyteErrors() {
      const errors = [];
      if (!this.$v.selectedAnalytes.$dirty) return errors;
      !this.$v.selectedAnalytes.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    specimenErrors() {
      const errors = [];
      if (!this.$v.selectedSpecimens.$dirty) return errors;
      !this.$v.selectedSpecimens.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    medicalRequestTypeErrors() {
      const errors = [];
      if (!this.$v.selectedMedicalRequestTypes.$dirty) return errors;
      !this.$v.selectedMedicalRequestTypes.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    processTimeErrors() {
      const errors = [];
      if (!this.$v.selectedProcessTimes.$dirty) return errors;
      !this.$v.selectedProcessTimes.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    containerErrors() {
      const errors = [];
      if (!this.$v.selectedContainers.$dirty) return errors;
      !this.$v.selectedContainers.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    locationErrors() {
      const errors = [];
      if (!this.$v.selectedLocations.$dirty) return errors;
      !this.$v.selectedLocations.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    items() {
      if (!this._observationServiceRequests) return [];
      if (!this.selectedWorkArea || this.selectedWorkArea === 0)
        return this._observationServiceRequests.collection;
      return this._observationServiceRequests.collection.filter(
        (observationServiceRequest) =>
          observationServiceRequest.workarea.id === this.selectedWorkArea
      );
    },

    formTitle() {
      return this.editedIndex === -1 ? "Crear Prestación" : "Editar Prestación";
    },

    canCreate() {
      if (!this._namedPermissions) return false;
      return this._namedPermissions.includes("workarea.create");
    },

    canUpdate() {
      if (!this._namedPermissions) return false;
      return this._namedPermissions.includes("workarea.update");
    },

    canDelete() {
      if (!this._namedPermissions) return false;
      return this._namedPermissions.includes("workarea.delete");
    },

    canShow() {
      if (!this._namedPermissions) return false;
      return this._namedPermissions.includes("workarea.show");
    },
  },

  methods: {
    ...mapActions({
      findLoincByCode: "loinc/findLoincByCode",
      findLoincByCodeFHIR: "loinc/findLoincByCodeFHIR",
      getAvailabilities: "availability/getItems",
      getLocations: "location/getItems",
      getContainers: "container/getItems",
      getSpecimens: "specimen/getItems",
      getAnalytes: "analyte/getItems",
      getProcessTimes: "processTime/getItems",
      getMedicalRequestTypes: "medicalRequestType/getItems",
      index: "observationServiceRequest/getItems",
      indexPaginate: "observationServiceRequest/getPaginatedItems",
      store: "observationServiceRequest/postItem",
      update: "observationServiceRequest/putItem",
      delete: "observationServiceRequest/deleteItem",
      show: "observationServiceRequest/showItem",
      changeStatus: "observationServiceRequest/changeStatusItem",
      getWorkareas: "workarea/getItems",
      setEditedItem: "observationServiceRequest/setEdit",
    }),

    async handleSelectForm() {
      await this.getWorkareas();

      this.workareas = this._workareas.collection;
    },

    async save() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          let response;
          if (this.editedIndex === -1) {
            response = await this.store(this.editedItem);
          } else {
            response = await this.update(this.editedItem);
          }

          if (response) {
            this.type = SnackbarType.SUCCESS;
          }
        } catch (e) {
          this.type = SnackbarType.ERROR;
          console.log(e);
        } finally {
          this.activateSnackbar();
          this.closeDialog();
          await this.index();
        }
      }
    },

    async handleChangeStatus(item) {
      try {
        const { status } = await this.changeStatus(item);

        if (status === 200) {
          this.type = SnackbarType.SUCCESS;
        }
      } catch (e) {
        this.type = SnackbarType.ERROR;
        console.log(e);
      } finally {
        this.activateSnackbar();
        this.resetForm();
        await this.index();
      }
    },

    async deleteItemConfirm() {
      if (this.editedIndex !== -1) {
        try {
          const { status } = await this.delete(this.editedItem);

          if (status === 204) {
            this.type = SnackbarType.SUCCESS;
          }
        } catch (e) {
          this.type = SnackbarType.ERROR;
          console.log(e);
        } finally {
          this.activateSnackbar();
          this.closeDeleteDialog();
          await this.index();
        }
      }
    },

    async handleShowItem(item) {
      try {
        await this.fillEditedItem(item);
      } catch (e) {
        this.type = SnackbarType.ERROR;
        this.activateSnackbar();
        console.log(e);
      }
    },

    handleDeleteModel(value) {
      this.fillEditedItem(value);
      this.editedIndex = findIndex(value, this.items);
      this.dialogDelete = true;
    },

    async handleEditModel(value) {
      await this.fillEditedItem(value);
      this.editedIndex = findIndex(value, this.items);

      //  console.log("enviando");
      //  await this.setEditedItem(this.editedItem);
      this.openDialog();
    },

    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },

    openDialog() {
      this.$v.$reset();

      // this.$router.push({ name: "createObservationServiceRequest" });
      this.observationDialog = true;
    },

    closeDeleteDialog() {
      this.dialogDelete = false;
      this.resetForm();
    },

    async fillEditedItem(item) {
      const { status, data } = await this.show(item._links.self.href);

      if (status === 200) {
        console.log(data);

        this.selectedAvailability = data._embedded.availability;
        this.selectedContainers = data._embedded.container;
        this.selectedMedicalRequestTypes = data._embedded.medicalRequestType;
        this.selectedAnalytes = data._embedded.analyte;
        this.selectedProcessTimes = data._embedded.processTime;
        this.selectedSpecimens = data._embedded.specimenCode;
        this.selectedLocations = data._embedded.location;
        this.clinical_information = data.clinical_information;
        this.searchLoinc = data._embedded.loinc.loinc_num;
        this.editedItem.id = data.id;
      } else if (status === 403) {
        this.type = SnackbarType.FORBIDDEN;
        this.activateSnackbar();
      } else {
        this.type = SnackbarType.ERROR;
        this.activateSnackbar();
      }
    },

    activateSnackbar() {
      this.snackbar = true;
    },

    resetForm() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
  },
};
</script>

<style scoped></style>
