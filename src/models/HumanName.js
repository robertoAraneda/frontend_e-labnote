export default class HumanName {
  constructor(
    use = "official",
    given = "",
    father_family = "",
    mother_family = ""
  ) {
    this.use = use;
    this.given = given;
    this.father_family = father_family;
    this.mother_family = mother_family;
  }
}
