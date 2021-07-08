export default class User {
  constructor(
    id = "",
    rut = "",
    names = "",
    lastname = "",
    motherLastname = "",
    email = "",
    password = ""
  ) {
    this.id = id;
    this.rut = rut;
    this.names = names;
    this.lastname = lastname;
    this.motherLastname = motherLastname;
    this.email = email;
    this.password = password;
  }
}
