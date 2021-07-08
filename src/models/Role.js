export default class Role {
  constructor(name = "", guard_name = "api", active = true) {
    this.name = name;
    this.guard_name = guard_name;
    this.active = active;
  }
}
