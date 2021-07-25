export const settings = [
  {
    path: "",
    name: "settings",
    component: () =>
      import(/* webpackChunkName: "base" */ "../views/settings/BaseIndex.vue"),
  },
  {
    path: "examenes",
    component: () =>
      import(
        /* webpackChunkName: "users" */ "../views/settings/observationServiceRequest/Index.vue"
      ),
    children: [
      {
        path: "",
        name: "observationServiceRequests",
        component: () =>
          import(
            /* webpackChunkName: "users" */ "../views/settings/observationServiceRequest/List.vue"
          ),
      },
      {
        path: "crear",
        name: "createObservationServiceRequest",
        component: () =>
          import(
            /* webpackChunkName: "analytes" */ "../views/settings/observationServiceRequest/Create.vue"
          ),
      },
      {
        path: "editar/:slug",
        name: "editObservationServiceRequest",
        component: () =>
          import(
            /* webpackChunkName: "analytes" */ "../views/settings/observationServiceRequest/Edit.vue"
          ),
      },
    ],
  },
  {
    path: "usuarios",
    name: "users",
    component: () =>
      import(/* webpackChunkName: "users" */ "../views/settings/User.vue"),
  },
  {
    path: "area-de-trabajo",
    name: "workareas",
    component: () =>
      import(
        /* webpackChunkName: "workareas" */ "../views/settings/Workarea.vue"
      ),
  },
  {
    path: "disponibilidad",
    name: "availabilities",
    component: () =>
      import(
        /* webpackChunkName: "availabilities" */ "../views/settings/Availability.vue"
        ),
  },
];
