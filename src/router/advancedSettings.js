export const advancedSettings = [
  {
    path: "roles",
    name: "roles",
    component: () =>
      import(
        /* webpackChunkName: "roles" */ "../views/advancedSettings/Role.vue"
      ),
  },
  {
    path: "permisos",
    name: "permissions",
    component: () =>
      import(
        /* webpackChunkName: "permissions" */ "../views/advancedSettings/Permission.vue"
      ),
  },
  {
    path: "laboratorios",
    name: "laboratories",
    component: () =>
      import(
        /* webpackChunkName: "laboratories" */ "../views/advancedSettings/Laboratory.vue"
      ),
  },
  {
    path: "modulos",
    name: "modules",
    component: () =>
      import(
        /* webpackChunkName: "modules" */ "../views/advancedSettings/Module.vue"
      ),
  },
  {
    path: "menus",
    name: "menus",
    component: () =>
      import(
        /* webpackChunkName: "menus" */ "../views/advancedSettings/Menu.vue"
      ),
  },
  {
    path: "examenes",
    component: () =>
      import(
        /* webpackChunkName: "analytes" */ "../views/advancedSettings/analyte/Index.vue"
      ),
    children: [
      {
        path: "",
        name: "analytes",
        component: () =>
          import(
            /* webpackChunkName: "analytes" */ "../views/advancedSettings/analyte/List.vue"
          ),
      },
      {
        path: "crear",
        name: "createAnalyte",
        component: () =>
          import(
            /* webpackChunkName: "analytes" */ "../views/advancedSettings/analyte/Create.vue"
          ),
      },
      {
        path: "editar/:slug",
        name: "editAnalyte",
        component: () =>
          import(
            /* webpackChunkName: "analytes" */ "../views/advancedSettings/analyte/Edit.vue"
          ),
      },
    ],
  },
];
