<template>
  <v-snackbar
    app
    v-bind="$attrs"
    v-on="$listeners"
    color="white"
    v-model="active"
    :timeout="timeout"
    transition="scale-transition"
    :content-class="setClass"
  >
    <div class="d-flex justtify-content-between">
      <v-icon size="30" :color="setColor" dark>{{ setIcon }}</v-icon>
      <v-spacer />
      <span class="ml-3 mr-10 mt-1 black--text text-subtitle-1">{{
        setMessage
      }}</span>
      <v-spacer />
      <v-btn icon @click="active = false">
        <v-icon :color="setColor">mdi-close</v-icon>
      </v-btn>
    </div>
  </v-snackbar>
</template>

<script>
import { SnackbarMessages, SnackbarType } from "../../helpers/SnackbarMessages";

export default {
  name: "BaseSnackbar",

  inheritAttrs: false,

  props: {
    value: Boolean,
    type: String,
    customMessage: String,
  },

  data: () => ({
    timeout: 3000,
  }),

  computed: {
    active: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },

    setMessage() {
      switch (this.type) {
        case "success":
          return SnackbarMessages().SUCCESS;
        case "warning":
          return SnackbarMessages.WARNING;
        case "error":
          if (this.customMessage === "") {
            return SnackbarMessages().ERROR;
          } else {
            return SnackbarMessages(this.customMessage).CUSTOM;
          }
        case "forbidden":
          return SnackbarMessages.FORBIDDEN;
        default:
          return "primary";
      }
    },

    setColor() {
      switch (this.type) {
        case "success":
          return SnackbarType.SUCCESS;
        case "warning":
          return SnackbarType.WARNING;
        case "error":
          return SnackbarType.ERROR;
        case "forbidden":
          return SnackbarType.WARNING;
        default:
          return "primary";
      }
    },
    setClass() {
      switch (this.type) {
        case "success":
          return "success_";
        case "warning":
          return "warning_";
        case "error":
          return "error_";
        case "forbidden":
          return "error_";
        default:
          return "primary";
      }
    },
    setIcon() {
      switch (this.type) {
        case "success":
          return "mdi-check-circle";
        case "warning":
          return "mdi-alert-circle";
        case "error":
          return "mdi-alert";
        case "forbidden":
          return "mdi-alert";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped>
.v-application--is-ltr .v-snack__action {
  margin-right: 0;
}

.success_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #4caf50;
  border-left-style: solid;
  /* background-color: white; */
}

.error_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #ff5252;
  border-left-style: solid;
  /* background-color: white; */
}

.info_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #2196f3;
  border-left-style: solid;
  /* background-color: white; */
}

.warning_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #fb8c00; /*#ffc107;*/
  border-left-style: solid;
  /* background-color: white; */
}
</style>
