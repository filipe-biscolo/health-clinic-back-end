import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Patient } from "../models/Patient";
import {Schedule, ScheduleAllRelations} from "../models/Schedule";
import reportView from "../views/report_view";

export default {
  async procedures(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const date_start = request.query.date_start + "T00:00:00";
    const date_end = request.query.date_end + "T23:59:59";

    const scheduleRepository = getRepository(Schedule);

    const report =  await scheduleRepository.createQueryBuilder('schedule')
    .leftJoinAndSelect('schedule.procedure', 'procedure')
    .addSelect("COUNT(*) AS count")
    .groupBy("schedule.procedure")
    .where('schedule.clinic_id = :clinic_id', { clinic_id })
    .andWhere("schedule.date_hour BETWEEN :begin AND :end", {begin: date_start, end: date_end })
    .getRawMany();

    return response.json(reportView.renderProcedureMany(report));
  },

  async healthInsurances(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const date_start = request.query.date_start + "T00:00:00";
    const date_end = request.query.date_end + "T23:59:59";

    const scheduleRepository = getRepository(Schedule);

    const report =  await scheduleRepository.createQueryBuilder('schedule')
    .leftJoinAndSelect('schedule.health_insurance', 'health_insurance')
    .addSelect("COUNT(*) AS count")
    .groupBy("schedule.health_insurance")
    .where('schedule.clinic_id = :clinic_id', { clinic_id })
    .andWhere("schedule.date_hour BETWEEN :begin AND :end", {begin: date_start, end: date_end })
    .getRawMany();

    let data = reportView.renderHealthInsuranceMany(report);
    let total =  0;
    data.forEach(i => total += Number(i.value));
    data.map(item => {
      item.value = Math.round((item.value * 100) / total);
    });

    return response.json(data);
  },

  async professionals(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const date_start = request.query.date_start + "T00:00:00";
    const date_end = request.query.date_end + "T23:59:59";

    const scheduleRepository = getRepository(ScheduleAllRelations);

    const report =  await scheduleRepository.createQueryBuilder('schedule')
    // .select("schedule.procedure_id AS procedure")
    .leftJoinAndSelect('schedule.professional', 'professional')
    .leftJoinAndSelect('professional.person', 'person')
    .leftJoinAndSelect('professional.occupation', 'occupation')
    .addSelect("COUNT(*) AS count")
    .groupBy("schedule.professional")
    .where('schedule.clinic_id = :clinic_id', { clinic_id })
    .where('occupation.permissions = :permissions', { permissions: 'HP' })
    .andWhere("schedule.date_hour BETWEEN :begin AND :end", {begin: date_start, end: date_end })
    .getRawMany();

    return response.json(reportView.renderProfessionalMany(report));
  },

  async patients(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const date_start = request.query.date_start + "T00:00:00";
    const date_end = request.query.date_end + "T23:59:59";

    const scheduleRepository = getRepository(Patient);

    const report =  await scheduleRepository.createQueryBuilder('patient')
    .leftJoinAndSelect('patient.person', 'person')
    .addSelect("COUNT(*) AS count")
    .groupBy("DATE(patient.created_at)")
    .where('patient.clinic_id = :clinic_id', { clinic_id })
    .andWhere("patient.created_at BETWEEN :begin AND :end", {begin: date_start, end: date_end })
    .take(15)
    .getRawMany();

    return response.json(reportView.renderCreatedPatientsMany(report));
  },

  async scheduleStatus(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const date_start = request.query.date_start + "T00:00:00";
    const date_end = request.query.date_end + "T23:59:59";

    const scheduleRepository = getRepository(ScheduleAllRelations);

    const report =  await scheduleRepository.createQueryBuilder('schedule')
    .addSelect("COUNT(*) AS count")
    .groupBy("schedule.scheduling_status")
    .where('schedule.clinic_id = :clinic_id', { clinic_id })
    .andWhere("schedule.date_hour BETWEEN :begin AND :end", {begin: date_start, end: date_end })
    .getRawMany();
    
    let data = reportView.renderSchedulingStatusMany(report);
    let total =  0;
    data.forEach(i => total += Number(i.value));
    data.map(item => {
      item.value = Math.round((item.value * 100) / total);
    });
    
    return response.json(data);
  }
};
