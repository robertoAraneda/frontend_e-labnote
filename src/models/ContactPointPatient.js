export default class ContactPointPatient {
  constructor(valueTelecom = "", value = "", use = "", system = "") {
    this.use = use;
    this.valueTelecom = valueTelecom;
    this.value = value;
    this.system = system;
  }
}
