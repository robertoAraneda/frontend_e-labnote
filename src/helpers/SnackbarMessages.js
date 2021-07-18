export const SnackbarMessages = (message) => {
  return {
    ERROR: "Ha ocurrido un error.",
    FORBIDDEN: "No tiene autorización para realizar esta operación.",
    SUCCESS: "Operación realizada con éxito.",
    WARNING: "Mensaje de alerta",
    CUSTOM: message,
  };
};

export const SnackbarType = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  FORBIDDEN: "forbidden",
};
