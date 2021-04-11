import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Attendance, AttendanceAllRelations } from "../models/Attendance";
import Scheduling from "../models/Scheduling";
import exportView from "../views/export_view";
import attendanceView from "../views/attendance_view";

export default {
  async index(request: Request, response: Response) {
    const { clinic_id, patient_id } = request.query;
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);

    const skippedItems = page * limit;

    const attendanceRepository = getRepository(AttendanceAllRelations);
    
    const [
      attendances,
      totalCount,
    ] = await attendanceRepository
      .createQueryBuilder("attendances")
      .leftJoinAndSelect("attendances.scheduling", "scheduling")
      .leftJoinAndSelect("scheduling.procedure", "procedure")
      .leftJoinAndSelect("scheduling.professional", "professional")
      .leftJoinAndSelect("professional.person", "pfperson")
      .leftJoinAndSelect("scheduling.patient", "patient")
      .leftJoinAndSelect("patient.person", "ptperson")
      .leftJoinAndSelect("scheduling.health_insurance", "health_insurance")
      .where("attendances.clinic_id = :clinic_id", { clinic_id: clinic_id })
      .andWhere("scheduling.patient_id = :patient_id", {
        patient_id: patient_id,
      })
      .orderBy("scheduling.date_hour")
      .skip(skippedItems)
      .take(limit)
      .getManyAndCount();

    const pageInfo = {
      page,
      limit,
      totalCount,
      attendances: attendanceView.renderMany(attendances),
    };

    return response.json(pageInfo);
  },

  async indexExport(request: Request, response: Response) {
    const { clinic_id, patient_id } = request.query;

    const attendanceRepository = getRepository(AttendanceAllRelations);
    
    const attendances = await attendanceRepository
      .createQueryBuilder("attendances")
      .leftJoinAndSelect("attendances.scheduling", "scheduling")
      .leftJoinAndSelect("scheduling.procedure", "procedure")
      .leftJoinAndSelect("scheduling.professional", "professional")
      .leftJoinAndSelect("professional.person", "pfperson")
      .leftJoinAndSelect("scheduling.patient", "patient")
      .leftJoinAndSelect("patient.person", "ptperson")
      .leftJoinAndSelect("scheduling.health_insurance", "health_insurance")
      .where("attendances.clinic_id = :clinic_id", { clinic_id: clinic_id })
      .andWhere("scheduling.patient_id = :patient_id", {
        patient_id: patient_id,
      })
      .orderBy("scheduling.date_hour")
      .getMany();

    return response.json(exportView.renderManyAttendances(attendances));
  },

  async show(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const { id } = request.params;

    const attendanceRepository = getRepository(AttendanceAllRelations);

    const attendance = await attendanceRepository.findOneOrFail(id, {
      where: { clinic_id: clinic_id },
      relations: ["scheduling", "scheduling.patient", "scheduling.procedure", "scheduling.patient.person"],
    });

    return response.json(attendance);
  },

  async create(request: Request, response: Response) {
    const {
      clinic_id,
      weight,
      blood_pressure,
      blood_type,
      allergies,
      chronic_diseases,
      note,
      prescription,
      scheduling,
    } = request.body;

    const attendanceRepository = getRepository(Attendance);
    const schedulingRepository = getRepository(Scheduling);

    scheduling.scheduling_status = "FINISHED";

    const data = {
      clinic_id,
      weight,
      blood_pressure,
      blood_type,
      allergies,
      chronic_diseases,
      note,
      prescription,
      scheduling,
    };

    const attendance = attendanceRepository.create(data);

    await attendanceRepository.save(attendance);
    await schedulingRepository.save(scheduling);

    return response.status(201).json(attendance);
  },

  async update(request: Request, response: Response) {
    const data = request.body;
    const { id } = request.params;

    delete data.id;

    const attendanceRepository = getRepository(Attendance);

    const attendance = await attendanceRepository.findOneOrFail(id, {
      where: { clinic_id: data.clinic_id }
    });

    if(!attendance){
        return response.status(409).json({message: "Problema ao encontrar atendimento, tente novamento mais tarde!"});
    }
    
    attendance.weight = data.weight;
    attendance.blood_pressure = data.blood_pressure;
    attendance.blood_type = data.blood_type;
    attendance.allergies = data.allergies;
    attendance.chronic_diseases = data.chronic_diseases;
    attendance.note = data.note;
    attendance.prescription = data.prescription;

    const __attendance = await attendanceRepository.save(attendance);

    const dataInfo = {
      status: true,
      message: 'Atendimento atualizado com sucesso!',
      data: __attendance
    };

    return response.status(201).json(dataInfo);
  },
};
