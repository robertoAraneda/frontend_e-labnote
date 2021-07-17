<template>
  <v-container>
    <v-row class="mb-10">
      <v-col cols="12">
        <h2 class="text-subtitle-1 grey--text darken-4">
          En este módulo podrás gestionar los exámenes utilizados en la
          solicitud de medios y página informativa.
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h3 class="text-body-1 black--text">Seleccione un área de trabajo:</h3>
      </v-col>
      <v-col cols="12">
        <BaseAutocomplete
          v-model="selectedWorkArea"
          placeholder="Seleccione:"
          :items="workareas"
          item-value="id"
          item-text="name"
          label="Área de trabajo"
        />
      </v-col>
    </v-row>

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
      title="Áreas de trabajo"
    >
      <template slot="top">
        <BaseAcceptButton
          small
          @click="openDialog"
          label="Crear nueva área de trabajo"
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
import { WorkareaHeaders } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { findIndex } from "../../helpers/Functions";
import Workarea from "../../models/Workarea";

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
    editedItem: new Workarea(),
    editedIndex: -1,
    defaultItem: new Workarea(),
    snackbar: false,
    headers: WorkareaHeaders,
    dialogDelete: false,
    type: SnackbarType.SUCCESS,
    selectedWorkArea: null,
    workareas: [],
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
        ? "Crear área de trabajo"
        : "Editar área de trabajo";
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
      //  this.$v.$reset();

      this.$router.push({ name: "createAnalyte" });

      //this.dialog = true;
    },

    closeDeleteDialog() {
      this.dialogDelete = false;
      this.resetForm();
    },

    async fillEditedItem(item) {
      const { status, data } = await this.show(item._link.self.href);

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
