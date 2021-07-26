<template>
  <v-container>
    <BaseHeaderModule title="Módulo de tiempos de proceso" subtitle="En este módulo podrás gestionar los tiempos de proceso."/>

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
          label="Crear nuevo tiempo de proceso"
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
import { ProcessTimeHeaders} from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { findIndex } from "../../helpers/Functions";
import ProcessTime from "../../models/ProcessTime";

export default {
  name: "ProcessTime",

  mixins: [validationMixin],

  validations: {
    editedItem: {
      name: { required },
      active: { required },
    },
  },

  data: () => ({
    dialog: false,
    editedItem: new ProcessTime(),
    editedIndex: -1,
    defaultItem: new ProcessTime(),
    snackbar: false,
    headers: ProcessTimeHeaders,
    dialogDelete: false,
    type: SnackbarType.SUCCESS,
  }),

  async mounted() {
    await this.index();
  },

  computed: {
    ...mapGetters({
      processTimes: "processTime/processTimes",
      namedPermissions: "auth/namedPermissions",
    }),

    items() {
      if (!this.processTimes) return [];
      return this.processTimes.collection;
    },

    formTitle() {
      return this.editedIndex === -1
        ? "Crear tiempo de proceso"
        : "Editar tiempo de proceso";
    },

    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
      errors.push(validationMessage.REQUIRED);
      return errors;
    },

    canCreate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("processTime.create");
    },

    canUpdate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("processTime.update");
    },

    canDelete() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("processTime.delete");
    },

    canShow() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("processTime.show");
    },
  },

  methods: {
    ...mapActions({
      index: "processTime/getItems",
      indexPaginate: "processTime/getPaginatedItems",
      store: "processTime/postItem",
      update: "processTime/putItem",
      delete: "processTime/deleteItem",
      show: "processTime/showItem",
      changeStatus: "processTime/changeStatusItem",
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
