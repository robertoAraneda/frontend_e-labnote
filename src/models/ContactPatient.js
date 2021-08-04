export default class ContactPatient {
  constructor(
    given = "",
    family = "",
    relationship = "",
    phone = "",
    email = ""
  ) {
    this.given = given;
    this.family = family;
    this.relationship = relationship;
    this.phone = phone;
    this.email = email;
  }
}
