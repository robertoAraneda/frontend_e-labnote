import IdentifierPatient from "./IdentifierPatient";
import HumanName from "./HumanName";
import ContactPointPatient from "./ContactPointPatient";
import AddressPatient from "./AddressPatient";
import ContactPatient from "./ContactPatient";
import AdministrativeGender from "./AdministrativeGender";

export default class Patient {
  constructor(
    birthdate = "1983-12-06",
    active = true,
    gender = new AdministrativeGender(),
    identifier = [new IdentifierPatient()],
    name = new HumanName(),
    telecom = [new ContactPointPatient()],
    address = [new AddressPatient()],
    contact = [new ContactPatient()]
  ) {
    this.identifier = identifier;
    this.active = active;
    this.name = name;
    this.telecom = telecom;
    this.gender = gender;
    this.birthdate = birthdate;
    this.address = address;
    this.contact = contact;
  }
}
