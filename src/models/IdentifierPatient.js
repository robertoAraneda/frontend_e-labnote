export default class IdentifierPatient {
  constructor(
    value = "15654738-7",
    identifier_type_id = 1,
    identifier_use_id = 2
  ) {
    this.value = value;
    this.identifier_type_id = identifier_type_id;
    this.identifier_use_id = identifier_use_id;
  }
}
