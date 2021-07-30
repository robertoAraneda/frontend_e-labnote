export default class ContactPatient {
  constructor(
    given = "YOLANDA",
    family = "ESPINOZA",
    relationship = "Madre",
    phone = "+56958639620",
    email = "yolanda@gmail.com"
  ) {
    this.given = given;
    this.family = family;
    this.relationship = relationship;
    this.phone = phone;
    this.email = email;
  }
}
