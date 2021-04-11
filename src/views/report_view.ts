interface ScheduleProcedures {
  procedure_name: string;
  count: number;
}

interface ScheduleHealthInsurances {
  health_insurance_name: string;
  count: number;
}

interface ScheduleProfessionals {
  person_name: string;
  occupation_name: string;
  count: number;
}

interface CreatePatients {
  patient_created_at: string;
  count: number;
}

interface SchedulingStatus {
  schedule_scheduling_status: SchedulingStatusEnum;
  count: number;
}

enum SchedulingStatusEnum {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
  FINISHED = "FINISHED",
}

enum SchedulingStatusDesc {
  SCHEDULED = "Agendado",
  CONFIRMED = "Confirmado",
  CANCELED = "Cancelado",
  FINISHED = "Finalizado",
}

export default {
  renderProcedure(schedule: ScheduleProcedures) {
    return {
      name: schedule.procedure_name,
      value: schedule.count,
    };
  },

  renderProcedureMany(schedules: ScheduleProcedures[]) {
    return schedules.map((schedule) => this.renderProcedure(schedule));
  },

  renderHealthInsurance(schedule: ScheduleHealthInsurances) {
    return {
      name: schedule.health_insurance_name
        ? schedule.health_insurance_name
        : "Particular",
      value: schedule.count,
    };
  },

  renderHealthInsuranceMany(schedules: ScheduleHealthInsurances[]) {
    return schedules.map((schedule) => this.renderHealthInsurance(schedule));
  },

  renderProfessional(schedule: ScheduleProfessionals) {
    return {
      name: `${schedule.person_name} (${schedule.occupation_name})`,
      value: schedule.count,
    };
  },

  renderProfessionalMany(schedules: ScheduleProfessionals[]) {
    return schedules.map((schedule) => this.renderProfessional(schedule));
  },

  renderCreatedPatients(patient: CreatePatients) {
    return {
      name: this.formatDate(patient.patient_created_at),
      value: patient.count,
    };
  },

  renderCreatedPatientsMany(patients: CreatePatients[]) {
    return patients.map((patient) => this.renderCreatedPatients(patient));
  },

  renderSchedulingStatus(schedule: SchedulingStatus) {
    return {
      name: SchedulingStatusDesc[schedule.schedule_scheduling_status],
      value: schedule.count,
    };
  },

  renderSchedulingStatusMany(schedules: SchedulingStatus[]) {
    return schedules.map((schedule) => this.renderSchedulingStatus(schedule));
  },

  formatDate(date: any) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  },
};
