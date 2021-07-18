export default class Analyte {
  constructor(name = "", is_patient_codable = false, active = true) {
    this.name = name;
    this.is_patient_codable = is_patient_codable;
    this.active = active;
  }
}
