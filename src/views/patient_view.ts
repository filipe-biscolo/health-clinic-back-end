import { Patient, PatientAllRelations } from "../models/Patient";

export default {
  render(patient: PatientAllRelations) {
    return {
      id: patient.id,
      name: patient.person?.name,
      sex: patient.person?.sex,
      birth_date: patient.person?.birth_date,
      cpf: patient.person?.cpf,
      phone: patient.person?.phone,
      health_insurance_name: patient?.health_insurance?.name,
    };
  },

  renderMany(patients: PatientAllRelations[]) {
    return patients.map((patient) => this.render(patient));
  }
};
