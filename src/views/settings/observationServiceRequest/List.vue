<template>
  <div>
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
      :link-to-edit="itemToEdit"
      :use-slug-route="true"
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
  </div>
</template>

<script>
import { WorkareaHeaders } from "../../../helpers/headersDatatable";
import { SnackbarType } from "../../../helpers/SnackbarMessages";
import { validationMessage } from "../../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { findIndex } from "../../../helpers/Functions";
import Workarea from "../../../models/Workarea";

export default {
  name: "List",

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
    itemToEdit: {},
  }),

  async mounted() {
    await this.index();
    await this.handleSelectForm();
  },

  computed: {
    ...mapGetters({
      _workareas: "workarea/workareas",
      _namedPermissions: "auth/namedPermissions",
      _observationServiceRequests:
        "observationServiceRequest/observationServiceRequests",
    }),

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
      // this.editedIndex = findIndex(value, this.items);

      console.log("enviando");
      await this.setEditedItem(this.editedItem);
      //  this.openDialog();
    },

    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },

    openDialog() {
      //  this.$v.$reset();

      this.$router.push({ name: "createObservationServiceRequest" });

      //this.dialog = true;
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
