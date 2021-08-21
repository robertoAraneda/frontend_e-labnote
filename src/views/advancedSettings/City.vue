<template>
  <v-container>
    <BaseHeaderModule
      title="Módulo de comunas"
      subtitle="En este módulo podrás gestionar las comunas."
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
      <template slot="searchButton">
        <BaseAcceptButton
          small
          @click="openDialog"
          v-if="canCreate"
        />
      </template>
      <template slot="select">
        <BaseAutocomplete
          v-model="selectedState"
          placeholder="Seleccione:"
          :items="states"
          item-value="code"
          item-text="name"
          label="Regiones"
          single-line
          hide-details
          @remove="remove"
        />
      </template>
    </BaseDatatable>

    <BaseDialog
      :dialog="dialog"
      :form-title="formTitle"
      @close="closeDialog"
      @save="save"
    >
      <template slot="body">
        <BaseTextfield
          v-model="editedItem.code"
          label="Código"
          @input="$v.editedItem.code.$touch()"
          @blur="$v.editedItem.code.$touch()"
          :error-messages="codeErrors"
        />
        <BaseTextfield
          v-model="editedItem.name"
          label="Nombre"
          @input="$v.editedItem.name.$touch()"
          @blur="$v.editedItem.name.$touch()"
          :error-messages="nameErrors"
        />
        <BaseAutocomplete
          v-model="editedItem.state_code"
          placeholder="Seleccione:"
          :items="states"
          item-value="code"
          item-text="name"
          label="Región"
          @input="$v.editedItem.state_code.$touch()"
          @blur="$v.editedItem.state_code.$touch()"
          :error-messages="stateErrors"
        />
        <v-radio-group v-model="editedItem.active" row>
          <template v-slot:label>
            <div class="black--text text-subtitle-1">Estado:</div>
          </template>
          <v-spacer />
          <v-radio label="Inactivo" :value="false"></v-radio>
          <v-radio label="Activo" :value="true"></v-radio>
        </v-radio-group>
      </template>
    </BaseDialog>

    <BaseSnackbar v-model="snackbar" :type="type" />

    <BaseConfirmDelete
      @closeDelete="closeDeleteDialog"
      @deleteItemConfirm="deleteItemConfirm()"
      :dialog-delete="dialogDelete"
    />
  </v-container>
</template>

<script>
import { CityHeaders } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { findIndex } from "../../helpers/Functions";
import City from "../../models/City";


export default {
  name: "City",

  mixins: [validationMixin],

  validations: {
    editedItem: {
      code: { required },
      name: { required },
      state_code: {required},
      active: { required },
    },
  },

  data: () => ({
    dialog: false,
    editedItem: new City(),
    editedIndex: -1,
    defaultItem: new City(),
    snackbar: false,
    headers: CityHeaders,
    dialogDelete: false,
    type: SnackbarType.SUCCESS,
    selectedState: null,
  }),

  async mounted() {
    await this.index();
    await this.getStates();
  },

  computed: {
    ...mapGetters({
      cities: "city/cities",
      namedPermissions: "auth/namedPermissions",
      citiesByState: "state/citiesByState",
      _states: "state/states",
    }),

    states() {
      if (!this._states) return [];
      return this._states.collection
    },

    items() {
      if (!this.cities) return [];
      if (!this.selectedState) return this.cities.collection;
      return this.cities.collection.filter(
        (city) => city.state_code === this.selectedState
      );
    },

    formTitle() {
      return this.editedIndex === -1
        ? "Crear comuna"
        : "Editar comuna";
    },

    codeErrors() {
      const errors = [];
      if (!this.$v.editedItem.code.$dirty) return errors;
      !this.$v.editedItem.code.required &&
      errors.push(validationMessage.REQUIRED);
      return errors;
    },

    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
      errors.push(validationMessage.REQUIRED);
      return errors;
    },

    stateErrors() {
      const errors = [];
      if (!this.$v.editedItem.state_code.$dirty) return errors;
      !this.$v.editedItem.state_code.required &&
      errors.push(validationMessage.REQUIRED);
      return errors;
    },

    canCreate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("city.create");
    },

    canUpdate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("city.update");
    },

    canDelete() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("city.delete");
    },

    canShow() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("city.show");
    },
  },

  methods: {
    ...mapActions({
      index: "city/getItems",
      indexPaginate: "city/getPaginatedItems",
      store: "city/postItem",
      update: "city/putItem",
      delete: "city/deleteItem",
      show: "city/showItem",
      changeStatus: "city/changeStatusItem",
      getCitiesByState: "state/getCitiesByState",
      getStates: "state/getItems",
    }),

    remove() {
      this.selectedState = null;
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

    handleEditModel(value) {
      this.fillEditedItem(value);
      this.editedIndex = findIndex(value, this.items);
      this.openDialog();
    },

    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },

    openDialog() {
      this.$v.$reset();
      this.dialog = true;
    },

    closeDeleteDialog() {
      this.dialogDelete = false;
      this.resetForm();
    },

    async fillEditedItem(item) {
      const { status, data } = await this.show(item._links.self.href);

      if (status === 200) {
        this.editedItem = Object.assign({}, data);
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
