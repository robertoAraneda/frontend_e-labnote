export default class ServiceRequestIntent {
  constructor(display = "", code = "", active = true) {
    this.display = display;
    this.code = code;
    this.active = active;
  }
}
