import { AttendanceAllRelations } from './../models/Attendance';

export default {
  render(attendance: AttendanceAllRelations) {
    return {
      id: attendance.id,
      clinic_id: attendance.clinic_id,
      patient_name: attendance.scheduling.patient?.person?.name,
      professional_name: attendance.scheduling?.professional?.person?.name,
      procedure_name: attendance.scheduling?.procedure?.name,
      health_insurance_name: attendance?.scheduling?.health_insurance?.name ? attendance?.scheduling?.health_insurance?.name : 'Particular',
      date_hour: attendance.scheduling?.date_hour,
      date_hour_end_attendance: attendance.created_at
    };
  },

  renderMany(attendances: AttendanceAllRelations[]) {
    return attendances.map(attendance => this.render(attendance));
  }
};
