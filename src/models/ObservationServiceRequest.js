export default class ObservationServiceRequest {
  constructor(
    name = "",
    clinical_information = "",
    active = true,
    loinc_num = null,
    availability_id = null,
    analyte_id = null,
    specimen_id = null,
    medical_request_type_id = null,
    process_time_id = null,
    container_id = null,
    workarea_id = null,
    laboratory_id = 1
  ) {
    this.name = name;
    this.clinical_information = clinical_information;
    this.loinc_num = loinc_num;
    this.availability_id = availability_id;
    this.analyte_id = analyte_id;
    this.specimen_id = specimen_id;
    this.medical_request_type_id = medical_request_type_id;
    this.process_time_id = process_time_id;
    this.container_id = container_id;
    this.workarea_id = workarea_id;
    this.laboratory_id = laboratory_id;
    this.active = active;
  }
}
