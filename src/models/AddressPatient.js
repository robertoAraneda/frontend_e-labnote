export default class AddressPatient {
  constructor(
    use = "",
    text = "",
    city_code = null,
    state_code = null,
    textAddress = ""
  ) {
    this.use = use;
    this.text = text;
    this.textAddress = textAddress;
    this.city_code = city_code;
    this.state_code = state_code;
  }
}
