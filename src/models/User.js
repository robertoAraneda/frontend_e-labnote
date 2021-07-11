export default class User {
  constructor(
    id = "",
    rut = "",
    names = "",
    lastname = "",
    mother_lastname = "",
    email = "",
    phone = "+56",
    password = "elabnote",
    active = true
  ) {
    this.id = id;
    this.rut = rut.toUpperCase();
    this.names = names.toUpperCase();
    this.lastname = lastname.toUpperCase();
    this.mother_lastname = mother_lastname.toUpperCase();
    this.email = email.toUpperCase();
    this.phone = phone;
    this.password = password;
    this.active = active;
  }
}
