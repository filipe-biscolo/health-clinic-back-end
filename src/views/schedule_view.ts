import Schedule from "../models/Schedule";

export default {
  render(schedule: Schedule) {
    return {
      id: schedule.id,
      clinic_id: schedule.clinic_id,
      scheduling_status: schedule.scheduling_status,
      has_health_insurance: schedule.has_health_insurance,
      health_insurance_name: schedule?.health_insurance?.name,
      date_hour: schedule.date_hour,
      patient_id: schedule.patient.id,
      patient_name: schedule.patient.person.name,
      professional_id: schedule.professional.id,
      professional_name: schedule.professional.person.name,
      user_id: schedule.professional.user.id,
      procedure_name: schedule?.procedure?.name
    };
  },

  renderMany(schedules: Schedule[]) {
    return schedules.map(schedule => this.render(schedule));
  }
};
