<template>
  <div>
    <v-card class="elevation-0">
      <v-subheader class="text-h6">Crear examen</v-subheader>

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
                  :items="itemsAnalytes"
                  @focus="querySelectionsAnalyte('')"
                  :loading="loadingAnalytes"
                  :search-input.sync="searchAnalytes"
                  flat
                  cache-items
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
                  :items="itemsSpecimens"
                  @focus="querySelectionsSpecimen('')"
                  :loading="loadingSpecimens"
                  :search-input.sync="searchSpecimens"
                  flat
                  cache-items
                  placeholder="Seleccione:"
                  item-value="id"
                  item-text="name"
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
                  :items="itemsAvailabilities"
                  @focus="querySelectionsAvailability('')"
                  :loading="loadingAvailability"
                  :search-input.sync="searchAvailability"
                  flat
                  cache-items
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
                  :items="itemsMedicalRequestTypes"
                  @focus="querySelectionsMedicalRequestType('')"
                  :loading="loadingMedicalRequestTypes"
                  :search-input.sync="searchMedicalRequestTypes"
                  flat
                  cache-items
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
                  :items="itemsProcessTimes"
                  @focus="querySelectionsProcessTime('')"
                  :loading="loadingProcessTimes"
                  :search-input.sync="searchProcessTimes"
                  flat
                  cache-items
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
                  v-model="selectedWorkareas"
                  :items="itemsWorkareas"
                  @focus="querySelectionsWorkarea('')"
                  :loading="loadingWorkareas"
                  :search-input.sync="searchWorkareas"
                  flat
                  cache-items
                  placeholder="Seleccione:"
                  item-value="id"
                  item-text="name"
                  label="Área de trabajo"
                  @remove="selectedWorkarea = null"
                  return-object
                  @change="$v.selectedWorkareas.$touch()"
                  @blur="$v.selectedWorkareas.$touch()"
                  :error-messages="workareaErrors"
                ></BaseAutocomplete>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="4">
                <BaseAutocomplete
                  v-model="selectedContainers"
                  :items="itemsContainers"
                  @focus="querySelectionsContainer('')"
                  :loading="loadingContainers"
                  :search-input.sync="searchContainers"
                  flat
                  cache-items
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
        <BaseCancelButton label="Cancelar" />
        <BaseAcceptButton @click="save" label="Guardar" />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { validateLoincCode } from "../../../helpers/Functions";
import { mapActions, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import ObservationServiceRequest from "../../../models/ObservationServiceRequest";
import { validationMessage } from "../../../helpers/ValidationMessage";

export default {
  name: "Create",

  mixins: [validationMixin],

  validations: {
    searchLoinc: { validateLoincCode },
    selectedAvailability: { required },
    selectedAnalytes: { required },
    selectedContainers: { required },
    selectedSpecimens: { required },
    selectedMedicalRequestTypes: { required },
    selectedProcessTimes: { required },
    selectedWorkareas: { required },
    clinical_information: { required },
  },

  data: () => ({
    isLoading: false,
    items: [],
    searchLoinc: null,
    loinc: null,
    clinical_information: "",

    editedItem: new ObservationServiceRequest(),
    editedDefault: new ObservationServiceRequest(),

    loadingAvailability: false,
    loadingAnalytes: false,
    loadingContainers: false,
    loadingSpecimens: false,
    loadingMedicalRequestTypes: false,
    loadingProcessTimes: false,
    loadingWorkareas: false,

    selectedAvailability: null,
    selectedAnalytes: null,
    selectedContainers: null,
    selectedSpecimens: null,
    selectedMedicalRequestTypes: null,
    selectedProcessTimes: null,
    selectedWorkareas: null,

    searchMedicalRequestTypes: null,
    searchSpecimens: null,
    searchContainers: null,
    searchAnalytes: null,
    searchAvailability: null,
    searchProcessTimes: null,
    searchWorkareas: null,

    itemsContainers: [],
    itemsMedicalRequestTypes: [],
    itemsProcessTimes: [],
    itemsSpecimens: [],
    itemsAnalytes: [],
    itemsAvailabilities: [],
    itemsWorkareas: [],
  }),

  watch: {
    async searchLoinc(val) {
      this.isLoading = true;

      const test = validateLoincCode(val);

      if (test) {
        try {
          const response = await this.findLoincByCode(val);

          if (response.status === 404) {
            this.items = [{ long_common_name: "Código LOINC no encontrado" }];
          } else {
            this.items = [response.data];
            this.editedItem.loinc_num = val;
          }
        } catch (e) {
          console.log(e);
        } finally {
          this.isLoading = false;
        }
      } else {
        this.items = [];
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
      this.editedItem.specimen_id = this.selectedSpecimens.id;
    },

    selectedWorkareas() {
      this.editedItem.workarea_id = this.selectedWorkareas.id;
    },

    clinical_information() {
      this.editedItem.clinical_information = this.clinical_information;
    },

    searchAvailability(val) {
      val &&
        val !== this.selectedAvailability &&
        this.querySelectionsAvailability(val);
    },

    searchContainers(val) {
      val &&
        val !== this.selectedContainers &&
        this.querySelectionsContainer(val);
    },

    searchAnalytes(val) {
      val && val !== this.selectedAnalytes && this.querySelectionsAnalyte(val);
    },

    searchProcessTimes(val) {
      val &&
        val !== this.selectedProcessTimes &&
        this.querySelectionsProcessTime(val);
    },

    searchMedicalRequestTypes(val) {
      val &&
        val !== this.selectedMedicalRequestTypes &&
        this.querySelectionsMedicalRequestType(val);
    },

    searchSpecimens(val) {
      val &&
        val !== this.selectedSpecimens &&
        this.querySelectionsSpecimen(val);
    },

    searchWorkarea(val) {
      val && val !== this.selectedWorkarea && this.querySelectionsWorkarea(val);
    },
  },

  computed: {
    ...mapGetters({
      _availabilities: "availability/availabilities",
      _containers: "container/containers",
      _specimens: "specimen/specimens",
      _analytes: "analyte/analytes",
      _processTimes: "processTime/processTimes",
      _workareas: "workarea/workareas",
      _medicalRequestTypes: "medicalRequestType/medicalRequestTypes",
      _editedItem: "observationServiceRequest/editObservationServiceRequest",
    }),

    name() {
      if (!this.selectedAnalytes || !this.selectedSpecimens) return "";
      return `${this.selectedAnalytes.name}, ${this.selectedSpecimens.name}`.toUpperCase();
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

    workareas() {
      if (!this._workareas) return [];
      return this._workareas.collection;
    },

    loincs() {
      return this.items;
    },

    longCommonName() {
      if (this.items.length !== 0) return this.items[0].long_common_name;
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

    workareaErrors() {
      const errors = [];
      if (!this.$v.selectedWorkareas.$dirty) return errors;
      !this.$v.selectedWorkareas.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },
  },

  methods: {
    ...mapActions({
      findLoincByCode: "loinc/findLoincByCode",
      getAvailabilities: "availability/getItems",
      getWorkareas: "workarea/getItems",
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
    }),

    async save() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          await this.store(this.editedItem);
        } catch (e) {
          console.log(e);
        } finally {
          console.log("fin");
        }
      }
      console.log(this.editedItem);
    },

    async querySelectionsAvailability(v) {
      this.loadingAvailability = true;
      // Simulated ajax query
      await this.getAvailabilities();

      this.itemsAvailabilities = this.availabilities.filter((availability) => {
        return (
          (availability.name || "")
            .toLowerCase()
            .indexOf((v || "").toLowerCase()) > -1
        );
      });
      this.loadingAvailability = false;
    },

    async querySelectionsSpecimen(v) {
      this.loadingSpecimens = true;
      // Simulated ajax query
      await this.getSpecimens();

      this.itemsSpecimens = this.specimens.filter((specimen) => {
        return (
          (specimen.name || "").toLowerCase().indexOf((v || "").toLowerCase()) >
          -1
        );
      });
      this.loadingSpecimens = false;
    },

    async querySelectionsAnalyte(v) {
      this.loadingAnalytes = true;
      // Simulated ajax query
      await this.getAnalytes();

      this.itemsAnalytes = this.analytes.filter((analyte) => {
        return (
          (analyte.name || "").toLowerCase().indexOf((v || "").toLowerCase()) >
          -1
        );
      });
      this.loadingAnalytes = false;
    },

    async querySelectionsContainer(v) {
      this.loadingContainers = true;
      // Simulated ajax query
      await this.getContainers();

      this.itemsContainers = this.containers.filter((container) => {
        return (
          (container.name || "")
            .toLowerCase()
            .indexOf((v || "").toLowerCase()) > -1
        );
      });
      this.loadingContainers = false;
    },

    async querySelectionsMedicalRequestType(v) {
      this.loadingMedicalRequestTypes = true;
      // Simulated ajax query
      await this.getMedicalRequestTypes();

      this.itemsMedicalRequestTypes = this.medicalRequestTypes.filter(
        (medicalRequestType) => {
          return (
            (medicalRequestType.name || "")
              .toLowerCase()
              .indexOf((v || "").toLowerCase()) > -1
          );
        }
      );
      this.loadingMedicalRequestTypes = false;
    },

    async querySelectionsProcessTime(v) {
      this.loadingProcessTimes = true;
      // Simulated ajax query
      await this.getProcessTimes();

      this.itemsProcessTimes = this.processTimes.filter((processTime) => {
        return (
          (processTime.name || "")
            .toLowerCase()
            .indexOf((v || "").toLowerCase()) > -1
        );
      });
      this.loadingProcessTimes = false;
    },

    async querySelectionsWorkarea(v) {
      this.loadingWorkareas = true;
      // Simulated ajax query
      await this.getWorkareas();

      this.itemsWorkareas = this.workareas.filter((workarea) => {
        return (
          (workarea.name || "").toLowerCase().indexOf((v || "").toLowerCase()) >
          -1
        );
      });
      this.loadingWorkareas = false;
    },
  },
};
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>
