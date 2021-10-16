<template>
  <div>
    <v-row class="mb-10">
      <v-col cols="12">
        <h3 class="text-subtitle-1 black--text">
          En este módulo podrás gestionar los módulos de e-labnote.
        </h3>
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
      title="Módulos"
    >
      <template slot="searchButton">
        <BaseAcceptButton
          small
          @click="openDialog"
          label="Crear nuevo módulo"
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
        <BaseTextfield
          v-model="editedItem.url"
          label="Vue URL"
          @input="$v.editedItem.url.$touch()"
          @blur="$v.editedItem.url.$touch()"
          :error-messages="urlErrors"
        />
        <BaseTextfield
          v-model="editedItem.icon"
          label="Icono"
          @input="$v.editedItem.icon.$touch()"
          @blur="$v.editedItem.icon.$touch()"
          :error-messages="iconErrors"
        />
        <BaseTextfield :value="slugGenerator" label="Slug" disabled />
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
      @closeDelete="dialogDelete = false"
      @deleteItemConfirm="deleteItemConfirm()"
      :dialog-delete="dialogDelete"
    />
  </div>
</template>

<script>
import { ModuleHeaders } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import Module from "../../models/Module";
import { findIndex } from "../../helpers/Functions";
import { mask } from "vue-the-mask";

export default {
  name: "Module",

  directives: {
    mask,
  },

  mixins: [validationMixin],

  validations: {
    editedItem: {
      name: { required },
      icon: { required },
      url: { required },
      active: { required },
    },
  },

  data: () => ({
    dialog: false,
    editedItem: new Module(),
    editedIndex: -1,
    defaultItem: new Module(),
    snackbar: false,
    timeout: 2000,
    headers: ModuleHeaders,
    dialogDelete: false,
    type: "success",
  }),

  async mounted() {
    await this.index();
  },

  computed: {
    ...mapGetters({
      modules: "module/modules",
      loggedUser: "auth/user",
      namedPermissions: "auth/namedPermissions",
    }),

    items() {
      if (!this.modules) return [];
      return this.modules.collection;
    },

    formTitle() {
      return this.editedIndex === -1 ? "Crear módulo" : "Editar módulo";
    },

    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    urlErrors() {
      const errors = [];
      if (!this.$v.editedItem.url.$dirty) return errors;
      !this.$v.editedItem.url.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    iconErrors() {
      const errors = [];
      if (!this.$v.editedItem.icon.$dirty) return errors;
      !this.$v.editedItem.icon.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    slugGenerator() {
      let lowercase = this.editedItem.name.toLowerCase();

      lowercase = lowercase.replace(/ó/g, "o");
      lowercase = lowercase.replace(/á/g, "a");
      lowercase = lowercase.replace(/é/g, "e");
      lowercase = lowercase.replace(/í/g, "i");
      lowercase = lowercase.replace(/ú/g, "o");
      lowercase = lowercase.replace(/,/g, "");
      lowercase = lowercase.replace(/\./g, "");

      return lowercase.replace(/ /g, "-");
    },

    canCreate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("module.create");
    },

    canUpdate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("module.update");
    },

    canDelete() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("module.delete");
    },

    canShow() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("module.show");
    },
  },

  methods: {
    ...mapActions({
      index: "module/getItems",
      indexPaginate: "module/getPaginatedItems",
      store: "module/postItem",
      update: "module/putItem",
      delete: "module/deleteItem",
      show: "module/showItem",
      changeStatus: "module/changeStatusItem",
    }),

    async save() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        try {
          let response;
          this.editedItem.slug = this.slugGenerator;
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
        console.log(data);
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
