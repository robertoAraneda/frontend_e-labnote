export default class IdentifierPatient {
  constructor(value = "", identifier_type_id = null, identifier_use_id = null) {
    this.value = value;
    this.identifier_type_id = identifier_type_id;
    this.identifier_use_id = identifier_use_id;
  }
}
