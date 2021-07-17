export const settings = [
  {
    path: "",
    name: "settings",
    component: () =>
      import(/* webpackChunkName: "base" */ "../views/settings/BaseIndex.vue"),
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
];
