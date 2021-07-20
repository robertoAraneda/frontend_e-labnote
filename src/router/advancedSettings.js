export const advancedSettings = [
  {
    path: "",
    name: "advancedSettings",
    component: () =>
      import(
        /* webpackChunkName: "roles" */ "../views/advancedSettings/BaseIndex.vue"
      ),
  },
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
    path: "prestaciones",
    name: "analytes",
    component: () =>
      import(
        /* webpackChunkName: "analytes" */ "../views/advancedSettings/Analyte.vue"
      ),
  },
];
