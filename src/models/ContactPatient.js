export default class ContactPatient {
  constructor(
    given = "",
    givenContact = "",
    family = "",
    relationship = "",
    phone = "",
    email = ""
  ) {
    this.givenContact = givenContact;
    this.given = given;
    this.family = family;
    this.relationship = relationship;
    this.phone = phone;
    this.email = email;
  }
}
