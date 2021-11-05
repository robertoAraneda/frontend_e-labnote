<template>
  <v-container>
    <BaseHeaderModule
      title="Módulo de profesionales"
      subtitle="En este módulo podrás gestionar los profesionales que pueden generar una solicitud de examen."
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
          label="Crear nuevo profesional"
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
          v-model="editedItem.rut"
          label="RUN"
          @input="$v.editedItem.rut.$touch()"
          @blur="$v.editedItem.rut.$touch()"
          :error-messages="rutErrors"
        />
        <BaseTextfield
          v-model="editedItem.given"
          label="Nombre"
          @input="$v.editedItem.given.$touch()"
          @blur="$v.editedItem.given.$touch()"
          :error-messages="givenErrors"
        />
        <BaseTextfield
          v-model="editedItem.family"
          label="Apellidos"
          @input="$v.editedItem.family.$touch()"
          @blur="$v.editedItem.family.$touch()"
          :error-messages="familyErrors"
        />

        <v-select
          outlined
          dense
          :items="administrativeGenders"
          item-text="display"
          item-value="id"
          v-model="editedItem.administrative_gender_id"
          label="Genero"
          @input="$v.editedItem.administrative_gender_id.$touch()"
          @blur="$v.editedItem.administrative_gender_id.$touch()"
          :error-messages="administrativeGenderErrors"
        />
        <BaseTextfield
          v-model="editedItem.phone"
          label="Teléfono"
          @input="$v.editedItem.phone.$touch()"
          @blur="$v.editedItem.phone.$touch()"
          :error-messages="phoneErrors"
        />

        <BaseTextfield
          v-model="editedItem.email"
          label="Email"
          @input="$v.editedItem.email.$touch()"
          @blur="$v.editedItem.email.$touch()"
          :error-messages="emailErrors"
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
import { PractitionerHeaders as headers } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { findIndex } from "../../helpers/Functions";
import Practitioner from "../../models/Practitioner";

export default {
  name: "Practitioner",

  mixins: [validationMixin],

  validations: {
    editedItem: {
      rut: { required },
      given: { required },
      family: { required },
      phone: { required },
      administrative_gender_id: { required },
      email: { email },
      active: { required },
    },
  },

  data: () => ({
    dialog: false,
    editedItem: new Practitioner(),
    editedIndex: -1,
    defaultItem: new Practitioner(),
    snackbar: false,
    headers,
    dialogDelete: false,
    type: SnackbarType.SUCCESS,
  }),

  async mounted() {
    if (!this.items) await this.index();
    if (!this.administrativeGenders) await this.getAdministrativeGender();
  },

  computed: {
    ...mapGetters({
      practitioners: "practitioner/practitioners",
      _administrativeGenders: "administrativeGender/administrativeGenders",
      namedPermissions: "auth/namedPermissions",
    }),

    administrativeGenders() {
      if (!this._administrativeGenders) return [];
      return this._administrativeGenders.collection;
    },

    items() {
      if (!this.practitioners) return [];
      return this.practitioners.collection;
    },

    formTitle() {
      return this.editedIndex === -1
        ? "Crear profesional"
        : "Editar profesional";
    },

    givenErrors() {
      const errors = [];
      if (!this.$v.editedItem.given.$dirty) return errors;
      !this.$v.editedItem.given.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    familyErrors() {
      const errors = [];
      if (!this.$v.editedItem.family.$dirty) return errors;
      !this.$v.editedItem.family.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    emailErrors() {
      const errors = [];
      if (!this.$v.editedItem.email.$dirty) return errors;
      !this.$v.editedItem.email.email && errors.push(validationMessage.EMAIL);
      return errors;
    },

    administrativeGenderErrors() {
      const errors = [];
      if (!this.$v.editedItem.administrative_gender_id.$dirty) return errors;
      !this.$v.editedItem.administrative_gender_id.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    rutErrors() {
      const errors = [];
      if (!this.$v.editedItem.rut.$dirty) return errors;
      !this.$v.editedItem.rut.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    phoneErrors() {
      const errors = [];
      if (!this.$v.editedItem.phone.$dirty) return errors;
      !this.$v.editedItem.phone.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    canCreate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("practitioner.create");
    },

    canUpdate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("practitioner.update");
    },

    canDelete() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("practitioner.delete");
    },

    canShow() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("practitioner.show");
    },
  },

  methods: {
    ...mapActions({
      index: "practitioner/getItems",
      indexPaginate: "practitioner/getPaginatedItems",
      store: "practitioner/postItem",
      update: "practitioner/putItem",
      delete: "practitioner/deleteItem",
      show: "practitioner/showItem",
      changeStatus: "practitioner/changeStatusItem",
      getAdministrativeGender: "administrativeGender/getItems",
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
