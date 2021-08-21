<template>
  <v-container>
    <BaseHeaderModule
      title="Módulo de tipos de ubicación"
      subtitle="En este módulo podrás gestionar los tipos de ubicación."
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
    </BaseDatatable>

    <BaseDialog
      :dialog="dialog"
      :form-title="formTitle"
      @close="closeDialog"
      @save="save"
    >
      <template slot="body">
        <BaseTextfield
          v-model="editedItem.display"
          label="Nombre"
          @input="$v.editedItem.display.$touch()"
          @blur="$v.editedItem.display.$touch()"
          :error-messages="displayErrors"
        />
        <BaseTextfield
          v-model="editedItem.code"
          label="Código"
          @input="$v.editedItem.code.$touch()"
          @blur="$v.editedItem.code.$touch()"
          :error-messages="codeErrors"
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
import { LocationTypeHeaders } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { findIndex } from "../../helpers/Functions";
import LocationType from "../../models/LocationType";

export default {
  name: "LocationType",

  mixins: [validationMixin],

  validations: {
    editedItem: {
      display: { required },
      code: { required },
      active: { required },
    },
  },

  data: () => ({
    dialog: false,
    editedItem: new LocationType(),
    editedIndex: -1,
    defaultItem: new LocationType(),
    snackbar: false,
    headers: LocationTypeHeaders,
    dialogDelete: false,
    type: SnackbarType.SUCCESS,
  }),

  async mounted() {
    await this.index();
  },

  computed: {
    ...mapGetters({
      locationTypes: "locationType/locationTypes",
      namedPermissions: "auth/namedPermissions",
    }),

    items() {
      if (!this.locationTypes) return [];
      return this.locationTypes.collection;
    },

    formTitle() {
      return this.editedIndex === -1
        ? "Crear tipo de ubicación"
        : "Editar tipo de ubicación";
    },

    displayErrors() {
      const errors = [];
      if (!this.$v.editedItem.display.$dirty) return errors;
      !this.$v.editedItem.display.required &&
      errors.push(validationMessage.REQUIRED);
      return errors;
    },

    codeErrors() {
      const errors = [];
      if (!this.$v.editedItem.code.$dirty) return errors;
      !this.$v.editedItem.code.required &&
      errors.push(validationMessage.REQUIRED);
      return errors;
    },

    canCreate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("locationType.create");
    },

    canUpdate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("locationType.update");
    },

    canDelete() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("locationType.delete");
    },

    canShow() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("locationType.show");
    },
  },

  methods: {
    ...mapActions({
      index: "locationType/getItems",
      indexPaginate: "locationType/getPaginatedItems",
      store: "locationType/postItem",
      update: "locationType/putItem",
      delete: "locationType/deleteItem",
      show: "locationType/showItem",
      changeStatus: "locationType/changeStatusItem",
    }),


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