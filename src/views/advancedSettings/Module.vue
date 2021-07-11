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
      :items="items"
      :headers="headers"
      sort-by="id"
      title="Módulos"
      :extra-buttons="false"
    >
      <template slot="top">
        <BaseAcceptButton
          small
          @click="openDialog"
          label="Crear nuevo módulo"
        />
      </template>
    </BaseDatatable>
    <BaseDialog
      :dialog="dialog"
      :form-title="formTitle"
      @close="dialog = false"
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
        <BaseTextfield
          v-model="editedItem.slug"
          label="Slug"
          disabled
          @input="$v.editedItem.slug.$touch()"
          @blur="$v.editedItem.slug.$touch()"
          v-mask="['+## (#) #### ####']"
          :error-messages="slugErrors"
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
import { required, email } from "vuelidate/lib/validators";
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
      slug: { required },
      icon: { required, email },
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

  mounted() {
    this.index();
  },

  computed: {
    ...mapGetters({
      modules: "module/modules",
      loggedUser: "auth/user",
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
      !this.$v.editedItem.email.email && errors.push(validationMessage.EMAIL);
      return errors;
    },

    slugErrors() {
      const errors = [];
      if (!this.$v.editedItem.slug.$dirty) return errors;
      !this.$v.editedItem.slug.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
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
        const { data } = await this.show(item._link.self.href);

        this.showUserDialog = true;

        await this.fillEditedItem(data);
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
      const { data } = await this.show(item._link.self.href);

      this.editedItem = Object.assign({}, data);
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
