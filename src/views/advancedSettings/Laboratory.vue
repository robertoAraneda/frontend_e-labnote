<template>
  <div>
    <v-row class="mb-10">
      <v-col cols="12">
        <h3 class="text-subtitle-1 black--text">
          En este módulo podrás gestionar los laboratorios asociados a
          e-labnote.
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
      title="Laboratorios"
      :extra-buttons="false"
    >
      <template slot="top">
        <BaseAcceptButton
          small
          @click="openDialog"
          label="Crear nuevo laboratorio"
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
          v-model="editedItem.address"
          label="Dirección"
          @input="$v.editedItem.address.$touch()"
          @blur="$v.editedItem.address.$touch()"
          :error-messages="addressErrors"
        />
        <BaseTextfield
          v-model="editedItem.email"
          label="Correo electrónico"
          @input="$v.editedItem.email.$touch()"
          @blur="$v.editedItem.email.$touch()"
          :error-messages="emailErrors"
        />
        <BaseTextfield
          v-model="editedItem.phone"
          label="Teléfono"
          @input="$v.editedItem.phone.$touch()"
          @blur="$v.editedItem.phone.$touch()"
          v-mask="['+## (#) #### ####']"
          :error-messages="phoneErrors"
        />
        <BaseTextfield
          v-model="editedItem.redirect"
          label="URL"
          @input="$v.editedItem.redirect.$touch()"
          @blur="$v.editedItem.redirect.$touch()"
          :error-messages="redirectErrors"
        />
        <BaseTextfield
          v-model="editedItem.technical_director"
          label="Director técnico"
          @input="$v.editedItem.technical_director.$touch()"
          @blur="$v.editedItem.technical_director.$touch()"
          :error-messages="technicalDirectorErrors"
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
import { LaboratoryHeaders } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import Laboratory from "../../models/Laboratory";
import { findIndex } from "../../helpers/Functions";
import { mask } from "vue-the-mask";

export default {
  name: "Laboratory",

  directives: {
    mask,
  },

  mixins: [validationMixin],

  validations: {
    editedItem: {
      name: { required },
      address: { required },
      email: { required, email },
      phone: { required },
      redirect: { required },
      technical_director: { required },
      active: { required },
    },
  },

  data: () => ({
    dialog: false,
    editedItem: new Laboratory(),
    editedIndex: -1,
    defaultItem: new Laboratory(),
    snackbar: false,
    timeout: 2000,
    headers: LaboratoryHeaders,
    dialogDelete: false,
    type: "success",
  }),

  mounted() {
    this.index();
  },

  computed: {
    ...mapGetters({
      laboratories: "laboratory/laboratories",
      loggedUser: "auth/user",
    }),

    items() {
      if (!this.laboratories) return [];
      return this.laboratories.collection;
    },

    formTitle() {
      return this.editedIndex === -1
        ? "Crear laboratorio"
        : "Editar laboratorio";
    },

    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    addressErrors() {
      const errors = [];
      if (!this.$v.editedItem.address.$dirty) return errors;
      !this.$v.editedItem.address.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    emailErrors() {
      const errors = [];
      if (!this.$v.editedItem.email.$dirty) return errors;
      !this.$v.editedItem.email.required &&
        errors.push(validationMessage.REQUIRED);
      !this.$v.editedItem.email.email && errors.push(validationMessage.EMAIL);
      return errors;
    },

    phoneErrors() {
      const errors = [];
      if (!this.$v.editedItem.phone.$dirty) return errors;
      !this.$v.editedItem.phone.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    redirectErrors() {
      const errors = [];
      if (!this.$v.editedItem.redirect.$dirty) return errors;
      !this.$v.editedItem.redirect.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    technicalDirectorErrors() {
      const errors = [];
      if (!this.$v.editedItem.technical_director.$dirty) return errors;
      !this.$v.editedItem.technical_director.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },
  },

  methods: {
    ...mapActions({
      index: "laboratory/getItems",
      indexPaginate: "laboratory/getPaginatedItems",
      store: "laboratory/postItem",
      update: "laboratory/putItem",
      delete: "laboratory/deleteItem",
      show: "laboratory/showItem",
      changeStatus: "laboratory/changeStatusItem",
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
        const { data } = await this.show(item._links.self.href);

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
      const { data } = await this.show(item._links.self.href);

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
