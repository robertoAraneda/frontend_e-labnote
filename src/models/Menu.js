export default class Menu {
  constructor(
    name = "",
    icon = "",
    url = "",
    module_id = "",
    permission_id = "",
    active = true
  ) {
    this.name = name;
    this.module_id = module_id;
    this.url = url;
    this.icon = icon;
    this.permission_id = permission_id;
    this.active = active;
  }
}
