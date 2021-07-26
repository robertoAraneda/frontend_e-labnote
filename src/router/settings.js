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
        path: "editar/:slug",
        name: "editObservationServiceRequest",
        component: () =>
          import(
            /* webpackChunkName: "edit" */ "../views/settings/observationServiceRequest/Edit.vue"
          ),
      },
      {
        path: "crear",
        name: "createObservationServiceRequest",
        component: () =>
          import(
            /* webpackChunkName: "create" */ "../views/settings/observationServiceRequest/Create.vue"
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
  {
    path: "tiempo-de-proceso",
    name: "processTime",
    component: () =>
      import(
        /* webpackChunkName: "processTime" */ "../views/settings/ProcessTime.vue"
        ),
  },
  {
    path: "tiempo-de-respuesta",
    name: "responseTime",
    component: () =>
      import(
        /* webpackChunkName: "responseTime" */ "../views/settings/ResponseTime.vue"
        ),
  },
];
