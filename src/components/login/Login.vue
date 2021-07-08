<template>
  <div>
    <v-card elevation="0" min-height="87vh">
      <v-card-text>
        <v-row justify="center" class="mt-10">
          <v-col cols="10" sm="8" md="8" lg="7">
            <v-row class="d-flex justify-space-around flex-column">
              <p class="subtitle font-weight-bold mb-10 mx-auto">
                Ingresa con tu usuario
              </p>
              <v-text-field
                v-model="editedModel.rut"
                outlined
                type="text"
                label="Rut"
                class="mb-3 mt-6"
                @input="$v.editedModel.rut.$touch()"
                @blur="$v.editedModel.rut.$touch()"
                :error-messages="rutErrors"
                v-mask="[
                  '###-#',
                  '#.###-#',
                  '##.###-#',
                  '###.###-#',
                  '#.###.###-#',
                  '##.###.###-#',
                ]"
              ></v-text-field>
              <v-text-field
                v-model="editedModel.password"
                class="mb-3"
                outlined
                type="password"
                label="Contraseña"
                @input="$v.editedModel.password.$touch()"
                @blur="$v.editedModel.password.$touch()"
                :error-messages="passwordErrors"
              ></v-text-field>
              <v-btn
                @click="handleLogin()"
                rounded
                color="primary"
                block
                id="sendButton"
                class="mb-6"
                >Ingresar</v-btn
              >
              <a href="#" class="mb-6">¿Olvidaste tu contraseña?</a>
              <v-alert
                class="mt-6"
                border="left"
                colored-border
                type="warning"
                elevation="2"
              >
                Si tienes problemas para ingresar comunícate con tu
                administrador
              </v-alert>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import User from "../../models/User";
import { mask } from "vue-the-mask";
import { mapActions } from "vuex";
export default {
  directives: {
    mask,
  },
  mixins: [validationMixin],
  validations: {
    editedModel: {
      password: { required },
      rut: { required },
    },
  },
  data: () => ({
    defaultModel: new User(),
    editedModel: new User(),
    snackbar: false,
    text: "RUT y/o contraseñas incorrectas",
    timeout: 2000,
  }),
  computed: {
    passwordErrors() {
      const errors = [];
      if (!this.$v.editedModel.password.$dirty) return errors;
      !this.$v.editedModel.password.required &&
        errors.push("La contraseña es requerida.");
      return errors;
    },
    rutErrors() {
      const errors = [];
      if (!this.$v.editedModel.rut.$dirty) return errors;
      !this.$v.editedModel.rut.required && errors.push("El RUT es requerido.");
      return errors;
    },
  },
  methods: {
    ...mapActions({
      login: "auth/login",
      attempt: "auth/attempt",
    }),

    async handleLogin() {
      let { success, token } = await this.login(this.editedModel);

      if (success) {
        let { success } = await this.attempt(token);

        if (success) {
          this.$router.push({ name: "Modules" });
        }
      } else {
        this.snackbar = true;
        console.log("false");
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
