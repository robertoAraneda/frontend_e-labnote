export default class IdentifierPatient {
  constructor(
    value = "",
    identifier_type_id = 1,
    identifier_use_id = null,
    valueRut = "",
    valueOther = ""
  ) {
    this.value = value;
    this.identifier_type_id = identifier_type_id;
    this.identifier_use_id = identifier_use_id;
    this.valueRut = valueRut;
    this.valueOther = valueOther;
  }
}
