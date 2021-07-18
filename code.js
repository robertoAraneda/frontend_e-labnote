
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
];
}



