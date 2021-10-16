export const appointment = [
  {
    path: "",
    name: "appointments",
    component: () =>
      import(
        /* webpackChunkName: "BaseIndex" */ "../views/appointments/BaseIndex.vue"
      ),
  },
  {
    path: "calendario",
    name: "schedules",
    component: () =>
      import(
        /* webpackChunkName: "Schedule" */ "../views/appointments/Schedule.vue"
      ),
  },
  {
    path: "crear-agenda",
    name: "createAppointment",
    component: () =>
      import(
        /* webpackChunkName: "CreateAppointment" */ "../views/appointments/CreateAppointment.vue"
      ),
  },
];
