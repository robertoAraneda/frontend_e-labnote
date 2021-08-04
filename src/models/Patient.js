import IdentifierPatient from "./IdentifierPatient";
import HumanName from "./HumanName";
import ContactPointPatient from "./ContactPointPatient";
import AddressPatient from "./AddressPatient";
import ContactPatient from "./ContactPatient";

export default class Patient {
  constructor(
    birthdate = "",
    active = true,
    administrative_gender_id = null,
    identifier = [new IdentifierPatient()],
    name = [new HumanName()],
    telecom = [new ContactPointPatient()],
    address = [new AddressPatient()],
    contact = [new ContactPatient()]
  ) {
    this.identifier = identifier;
    this.active = active;
    this.name = name;
    this.telecom = telecom;
    this.administrative_gender_id = administrative_gender_id;
    this.birthdate = birthdate;
    this.address = address;
    this.contact = contact;
  }
}
