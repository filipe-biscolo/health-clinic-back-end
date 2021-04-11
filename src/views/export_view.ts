import { AttendanceAllRelations } from "../models/Attendance";
import HealthInsurance from "../models/HealthInsurance";
import Occupation from "../models/Occupation";
import { PatientAllRelations } from "../models/Patient";
import Procedure from "../models/Procedure";
import {
  ProfessionalAllRelations,
  ProfessionalExport,
} from "../models/Professional";
import { ScheduleAllRelations } from "../models/Schedule";

enum Sex {
  M = "Masculino",
  F = "Feminino",
}

enum MaritalStatus {
  SO = "Solteiro",
  CA = "Casado",
  DI = "Divorciado",
  VI = "Viúvo",
  SE = "Separado",
}

enum Permissions {
  HP = "Profissional da saúde",
  SE = "Secretário",
}

enum SchedulingStatus {
  SCHEDULED = "Agendado",
  CONFIRMED = "Confirmado",
  CANCELED = "Cancelado",
  FINISHED = "Finalizado",
}

export default {
  renderProcedure(procedure: Procedure) {
    return {
      name: procedure.name,
      duration: `${procedure.duration} minutos`,
    };
  },

  renderManyProcedures(procedures: Procedure[]) {
    return procedures.map((procedure) => this.renderProcedure(procedure));
  },

  renderHealthInsurance(healthInsurance: HealthInsurance) {
    return {
      name: healthInsurance.name,
    };
  },

  renderManyHealthInsurances(healthInsurances: HealthInsurance[]) {
    return healthInsurances.map((healthInsurance) =>
      this.renderHealthInsurance(healthInsurance)
    );
  },

  renderOccupation(occupation: Occupation) {
    return {
      name: occupation.name,
      permissions: occupation.permissions,
    };
  },

  renderOccupations(occupations: Occupation[]) {
    return occupations.map((occupation) => this.renderOccupation(occupation));
  },

  renderProfessional(professional: ProfessionalExport) {
    return {
      name: professional.person?.name,
      email: professional.user?.email,
      admin: professional.admin ? "Sim" : "Não",
      cpf: this.cpf(professional.person?.cpf),
      rg: professional.person?.rg,
      birth_date: this.birthDate(professional.person?.birth_date),
      sex: Sex[professional.person?.sex],
      marital_status: MaritalStatus[professional.person?.marital_status],
      street: professional.person?.street,
      district: professional.person?.district,
      address_number: professional.person?.address_number,
      city_name: professional.person?.city?.name,
      state_name: professional.person?.state?.name,
      cep: professional.person?.cep,
      phone: this.phone(professional.person?.phone),
      phone_aux: this.phone(professional.person?.phone_aux),
      occupation_name: professional.occupation.name,
      occupation_permissions: Permissions[professional.occupation.permissions],
      health_insurances: this.arrayToString(professional.health_insurances),
      note: professional.note,
    };
  },

  renderManyProfessionals(professionals: ProfessionalExport[]) {
    return professionals.map((professional) =>
      this.renderProfessional(professional)
    );
  },

  renderPatient(patient: PatientAllRelations) {
    return {
      name: patient.person?.name,
      email: patient.email,
      cpf: this.cpf(patient.person?.cpf),
      rg: patient.person?.rg,
      birth_date: this.birthDate(patient.person?.birth_date),
      sex: Sex[patient.person?.sex],
      marital_status: MaritalStatus[patient.person?.marital_status],
      street: patient.person?.street,
      district: patient.person?.district,
      address_number: patient.person?.address_number,
      city_name: patient.person?.city?.name,
      state_name: patient.person?.state?.name,
      cep: patient.person?.cep,
      phone: this.phone(patient.person?.phone),
      phone_aux: this.phone(patient.person?.phone_aux),
      health_insurance: patient.health_insurance?.name,
      note: patient.note,
    };
  },

  renderManyPatients(patients: PatientAllRelations[]) {
    return patients.map((patient) =>
      this.renderPatient(patient)
    );
  },
  
  renderScheduling(scheduling: ScheduleAllRelations) {
    return {
      scheduling_status: SchedulingStatus[scheduling.scheduling_status],
      has_health_insurance: scheduling.has_health_insurance ? 'Sim': 'Não',
      health_insurance_name: scheduling?.health_insurance?.name ? scheduling?.health_insurance?.name : 'Particular',
      date_hour: this.dateHour(scheduling.date_hour),
      date_hour_end: this.dateHour(scheduling.date_hour_end),
      patient_name: scheduling.patient.person.name,
      professional_name: scheduling.professional.person.name,
      procedure_name: scheduling?.procedure?.name
    };
  },

  renderManySchedulings(schedulings: ScheduleAllRelations[]) {
    return schedulings.map(scheduling => this.renderScheduling(scheduling));
  },

  renderAttendance(attendance: AttendanceAllRelations) {
    return {
      patient_name: attendance.scheduling.patient?.person?.name,
      professional_name: attendance.scheduling?.professional?.person?.name,
      procedure_name: attendance.scheduling?.procedure?.name,
      health_insurance_name: attendance?.scheduling?.health_insurance?.name ? attendance?.scheduling?.health_insurance?.name : 'Particular',
      date_hour: this.dateHour(attendance.scheduling?.date_hour),
      date_hour_end_attendance: this.dateHour(attendance.created_at)
    };
  },

  renderManyAttendances(attendances: AttendanceAllRelations[]) {
    return attendances.map(attendance => this.renderAttendance(attendance));
  },

  arrayToString(array: any) {
    var texts = array.map((el: any) => el.health_insurance.name);
    return texts.toString();
  },

  phone(value: string) {
    let phone = value ? value.replace(/\D/g, "") : "";

    if (phone && phone.length === 11) {
      return phone.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (phone && phone.length === 10) {
      return phone.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
  },

  cpf(value: string) {
    if (value) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
    }
  },

  birthDate(value: string) {
    if (value) {
      return new Date(value+'T00:00').toLocaleDateString('pt-br');
    }
  },

  dateHour(value: Date) {
    if (value) {
      return new Date(value).toLocaleString('pt-br');
    }
  },
};
