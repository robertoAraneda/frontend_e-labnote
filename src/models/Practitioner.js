export default class Practitioner {
  constructor(
    given = "",
    family = "",
    email = "",
    active = true,
    rut = "",
    administrative_gender_id = -1,
    phone = ""
  ) {
    this.given = given;
    this.family = family;
    this.email = email;
    this.active = active;
    this.rut = rut;
    this.administrative_gender_id = administrative_gender_id;
    this.phone = phone;
  }
}
