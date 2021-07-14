export default class Module {
  constructor(name = "", icon = "", url = "", slug = "", active = true) {
    this.name = name;
    this.icon = icon;
    this.url = url;
    this.slug = slug;
    this.active = active;
  }
}
