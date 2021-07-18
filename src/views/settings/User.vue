<template>
  <v-container>
    <v-row class="mb-10">
      <v-col cols="12">
        <h3 class="text-subtitle-1 black--text">
          En este módulo podrás gestionar los usuarios
        </h3>
      </v-col>
    </v-row>

    <BaseDatatablePaginate
      @deleteItem="handleDeleteModel($event)"
      @editItem="handleEditModel($event)"
      @searchItem="handleShowItem($event)"
      @customMethod="handlePermissions($event)"
      @changeStatus="handleChangeStatus($event)"
      @changePage="handleChangePage($event)"
      :canUpdate="canUpdate"
      :headers="headers"
      :items="items"
      title="Usuarios"
      :loading="isUsersLoading"
      :extra-buttons="false"
      :total="total"
    >
      <template slot="top">
        <BaseAcceptButton
          small
          @click="openDialog"
          label="Crear nuevo usuario"
          v-if="canCreate"
        />
      </template>
    </BaseDatatablePaginate>
    <BaseDialog
      :dialog="dialog"
      :form-title="formTitle"
      @close="closeDialog"
      @save="save"
    >
      <template slot="body">
        <BaseTextfield
          v-model="editedItem.rut"
          label="Rut"
          placeholder="Rut"
          @input="$v.editedItem.rut.$touch()"
          @blur="$v.editedItem.rut.$touch()"
          :error-messages="rutErrors"
          v-mask="[
            '###-#',
            '#.###-#',
            '##.###-#',
            '###.###-#',
            '#.###.###-#',
            '##.###.###-#',
          ]"
        />

        <BaseTextfield
          v-model="editedItem.names"
          label="Nombres"
          placeholder="Nombres"
          @input="$v.editedItem.names.$touch()"
          @blur="$v.editedItem.names.$touch()"
          :error-messages="namesErrors"
        />

        <BaseTextfield
          v-model="editedItem.lastname"
          label="Apellido Paterno"
          placeholder="Apellido Paterno"
          @input="$v.editedItem.lastname.$touch()"
          @blur="$v.editedItem.lastname.$touch()"
          :error-messages="lastnameErrors"
        />

        <BaseTextfield
          v-model="editedItem.mother_lastname"
          label="Apellido Materno"
          placeholder="Apellido Materno"
          @input="$v.editedItem.mother_lastname.$touch()"
          @blur="$v.editedItem.mother_lastname.$touch()"
          :error-messages="motherLastnameErrors"
        />

        <BaseTextfield
          v-model="editedItem.email"
          label="Email"
          placeholder="Email"
          @input="$v.editedItem.email.$touch()"
          @blur="$v.editedItem.email.$touch()"
          :error-messages="emailErrors"
        />

        <BaseTextfield
          v-model="editedItem.phone"
          label="Teléfono"
          placeholder="Teléfono"
          v-mask="['+## (#) ##### ####']"
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
    <UserShowCard
      v-bind="editedItem"
      @close="showUserDialog = false"
      :dialog="showUserDialog"
    />
    <BaseConfirmDelete
      @closeDelete="dialogDelete = false"
      @deleteItemConfirm="deleteItemConfirm()"
      :dialog-delete="dialogDelete"
    />
  </v-container>
</template>

<script>
import { UserHeaders } from "../../helpers/headersDatatable";
import { SnackbarType } from "../../helpers/SnackbarMessages";
import { validationMessage } from "../../helpers/ValidationMessage";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import User from "../../models/User";
import { mask } from "vue-the-mask";
import BaseDatatablePaginate from "../../components/base/BaseDatatablePaginate";
import UserShowCard from "../../components/setting/UserShowCard";

export default {
  name: "User",
  components: { UserShowCard, BaseDatatablePaginate },
  directives: {
    mask,
  },

  mixins: [validationMixin],

  validations: {
    editedItem: {
      names: { required },
      rut: { required },
      lastname: { required },
      mother_lastname: { required },
      email: { required, email },
    },
  },

  data: () => ({
    dialog: false,
    editedItem: new User(),
    editedIndex: -1,
    defaultItem: new User(),
    snackbar: false,
    timeout: 2000,
    headers: UserHeaders,
    dialogDelete: false,
    type: SnackbarType.SUCCESS,
    items: [],
    itemsPerPage: 0,
    page: 1,
    total: 0,
    showUserDialog: false,
  }),

  async mounted() {
    await this.handleChangePage();
  },

  computed: {
    ...mapGetters({
      users: "user/users",
      isUsersLoading: "user/isUsersLoading",
      loggedUser: "auth/user",
      namedPermissions: "auth/namedPermissions",
    }),

    canCreate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("user.create");
    },

    canUpdate() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("user.update");
    },

    canDelete() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("user.delete");
    },

    canShow() {
      if (!this.namedPermissions) return false;
      return this.namedPermissions.includes("user.show");
    },

    formTitle() {
      return this.editedIndex === -1 ? "Crear usuario" : "Editar usuario";
    },

    namesErrors() {
      const errors = [];
      if (!this.$v.editedItem.names.$dirty) return errors;
      !this.$v.editedItem.names.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    lastnameErrors() {
      const errors = [];
      if (!this.$v.editedItem.lastname.$dirty) return errors;
      !this.$v.editedItem.lastname.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },

    motherLastnameErrors() {
      const errors = [];
      if (!this.$v.editedItem.mother_lastname.$dirty) return errors;
      !this.$v.editedItem.mother_lastname.required &&
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

    rutErrors() {
      const errors = [];
      if (!this.$v.editedItem.rut.$dirty) return errors;
      !this.$v.editedItem.rut.required &&
        errors.push(validationMessage.REQUIRED);
      return errors;
    },
  },

  methods: {
    ...mapActions({
      index: "user/getItems",
      indexPaginated: "user/getPaginatedItems",
      store: "user/postItem",
      update: "user/putItem",
      delete: "user/deleteItem",
      show: "user/showItem",
      changeStatus: "user/changeStatusItem",
    }),

    async handleChangePage(page = this.page) {
      const { data } = await this.indexPaginated({ page });

      this.items = data.data.collection;
      this.itemsPerPage = data.meta.per_page;
      this.total = data.meta.last_page;
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
          console.log(e);
          this.type = SnackbarType.ERROR;
        } finally {
          this.activateSnackbar();
          this.resetForm();
          this.closeDialog();
          await this.handleChangePage();
        }
      }
    },

    async handleChangeStatus(item) {
      console.log(item);
      try {
        const { status, data } = await this.changeStatus(item);

        console.log(status);
        if (status === 200) {
          this.type = SnackbarType.SUCCESS;
        } else {
          this.type = SnackbarType.ERROR;
          console.log(data);

          if (data.errors) {
            this.customMessage = Object.values(data.errors).map(
              (error) => error[0]
            )[0];
          } else {
            this.type = SnackbarType.ERROR;
          }
        }
      } catch (e) {
        this.type = SnackbarType.ERROR;
      } finally {
        this.dialogDelete = false;
        this.activateSnackbar();
        this.resetForm();
        await this.handleChangePage();
      }
    },

    async handleShowItem(item) {
      const { data } = await this.show(item._link.self.href);

      this.showUserDialog = true;

      this.fillEditedItem(data);
    },

    handleDeleteModel(value) {
      this.fillEditedItem(value);
      this.editedIndex = this.items.indexOf(value);
      this.dialogDelete = true;
    },

    handleEditModel(value) {
      console.log(value);
      this.fillEditedItem(value);
      this.editedIndex = this.items.indexOf(value);
      this.openDialog();
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
        } finally {
          this.dialogDelete = false;
          this.activateSnackbar();
          this.resetForm();
          await this.handleChangePage({ page: this.page });
        }
      }
    },

    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },

    openDialog() {
      this.$v.$reset();
      this.dialog = true;
    },

    fillEditedItem(value) {
      this.editedItem = { ...value };
    },

    activateSnackbar() {
      this.snackbar = true;
    },

    resetForm() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },

    handlePermissions(value) {
      console.log(value);
    },
  },
};
</script>

<style scoped></style>
