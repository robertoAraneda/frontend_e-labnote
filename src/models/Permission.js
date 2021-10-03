export default class Permission {
  constructor(
    name = "",
    guard_name = "api",
    model = "",
    action = "",
    description = "",
    active = true
  ) {
    this.guard_name = guard_name;
    this.model = model;
    this.action = action;
    this.name = name;
    this.description = description;
    this.active = active;
  }
}
