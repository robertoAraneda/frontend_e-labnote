export default class User {
  constructor(
    id = "",
    email = "",
    name = "",
    address = "",
    phone = "+56",
    redirect = "",
    active = true,
    technical_director = ""
  ) {
    this.id = id;
    this.name = name.toUpperCase();
    this.email = email.toUpperCase();
    this.address = address.toUpperCase();
    this.phone = phone.toUpperCase();
    this.redirect = redirect;
    this.email = email.toUpperCase();
    this.technical_director = technical_director.toUpperCase();
    this.active = active;
  }
}
