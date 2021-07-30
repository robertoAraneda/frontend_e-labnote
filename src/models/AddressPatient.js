export default class AddressPatient {
  constructor(
    use = "Casa",
    text = "Amunategui 890, Departamento 2003",
    city_code = null,
    state_code = null
  ) {
    this.use = use;
    this.text = text;
    this.city_code = city_code;
    this.state_code = state_code;
  }
}
