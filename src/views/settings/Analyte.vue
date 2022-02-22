<template>
  <v-container>
    <BaseHeaderModule
      title="Mantenedor exámenes base."
      subtitle=" En éste módulo podrás gestionar los recursos base para la creación de exámenes."
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
      <template v-slot:select>
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
      <template v-slot:searchButton>
        <BaseAcceptButton
          @click="openDialog"
          label="Crear nuevo examen base"
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
          v-model="editedItem.name"
          label="Nombre"
          @input="$v.editedItem.name.$touch()"
          @blur="$v.editedItem.name.$touch()"
          :error-messages="nameErrors"
        />
        <v-radio-group v-model="editedItem.is_patient_codable" row>
          <template v-slot:label>
            <div class="">
              <span class="text-body-1 text--primary"
                >¿Demografía paciente codificada?</span
              ><br />
              <span class="text-body-2 text--secondary"
                >(Resguardo de identidad):</span
              >
            </div>
          </template>
          <v-spacer />
          <v-radio label="Si" :value="true"></v-radio>
          <v-radio label="No" :value="false"></v-radio>
        </v-radio-group>
        <v-radio-group v-model="editedItem.active" row>
          <template v-slot:label>
            <div class="text--primary text-body-1">Estado:</div>
          </template>
          <v-spacer />
          <v-radio label="Inactivo" :value="false"></v-radio>
          <v-radio label="Activo" :value="true"></v-radio>
        </v-radio-group>
      </template>
    </BaseDialog>

    <BaseSnackbar
      :custom-message="customMessage"
      v-model="snackbar"
      :type="type"
    />

    <BaseConfirmDelete
      @closeDelete="closeDeleteDialog"
      @deleteItemConfirm="deleteItemConfirm()"
      :dialog-delete="dialogDelete"
    />
  </v-container>
</template>

<script>
import { AnalyteHeaders } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { findIndex } from "../../helpers/Functions";
import Analyte from "../../models/Analyte";

export default {
  name: "Analyte",

  mixins: [validationMixin],

  validations: {
    editedItem: {
      name: { required },
      active: { required },
    },
  },

  data: () => ({
    dialog: false,
    editedItem: new Analyte(),
    editedIndex: -1,
    defaultItem: new Analyte(),
    snackbar: false,
    headers: AnalyteHeaders,
    dialogDelete: false,
    type: SnackbarType.SUCCESS,
    selectedWorkArea: null,
    workareas: [],
    customMessage: "",
  }),

  async mounted() {
    await this.index();
    await this.handleSelectForm();
  },

  computed: {
    ...mapGetters({
      _workareas: "workarea/workareas",
      _namedPermissions: "auth/namedPermissions",
      _analytes: "analyte/analytes",
    }),

    items() {
      if (!this._analytes) return [];
      if (!this.selectedWorkArea || this.selectedWorkArea === 0)
        return this._analytes.collection;
      return this._analytes.collection.filter(
        (analyte) => analyte.workarea.id === this.selectedWorkArea
      );
    },

    formTitle() {
      return this.editedIndex === -1
        ? "Crear base examen"
        : "Editar base examen";
    },

    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
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
      index: "analyte/getItems",
      indexPaginate: "analyte/getPaginatedItems",
      store: "analyte/postItem",
      update: "analyte/putItem",
      delete: "analyte/deleteItem",
      show: "analyte/showItem",
      changeStatus: "analyte/changeStatusItem",
      getWorkareas: "workarea/getItems",
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

      // this.$router.push({ name: "createAnalyte" });
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
