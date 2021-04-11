import { Request, Response } from "express";
import { Between, getRepository, Not } from "typeorm";
import { Schedule, ScheduleAllRelations } from "../models/Schedule";
import Scheduling from "../models/Scheduling";
import exportView from "../views/export_view";
import scheduleView from "../views/schedule_view";

export default {
  async index(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);
    const date_start = request.query.date_start + "T00:00:00";
    const date_end = request.query.date_end + "T23:59:59";
    const professional_id =
      request.query.professional_id !== "null"
        ? request.query.professional_id
        : null;

    const skippedItems = page * limit;

    const scheduleRepository = getRepository(Schedule);

    let where = {
      clinic_id: clinic_id,
      date_hour: Between(date_start, date_end),
    };
    if (professional_id) {
      (where as any).professional_id = professional_id;
    }

    const [schedule, totalCount] = await scheduleRepository.findAndCount({
      relations: [
        "patient",
        "professional",
        "procedure",
        "health_insurance",
        "patient.person",
        "professional.person",
        "professional.user",
      ],
      where: where,
      order: { date_hour: "ASC" },
      skip: skippedItems,
      take: limit,
    });

    const pageInfo = {
      page,
      limit,
      totalCount,
      schedule: scheduleView.renderMany(schedule),
    };

    return response.json(pageInfo);
  },

  async indexAll(request: Request, response: Response) {
    const { clinic_id } = request.query;

    const scheduleRepository = getRepository(Schedule);

    const schedule = await scheduleRepository.find({
      where: { clinic_id: clinic_id },
      relations: [
        "patient",
        "professional",
        "procedure",
        "health_insurance",
        "patient.person",
        "professional.person",
        "professional.user",
      ],
    });

    return response.json(scheduleView.renderMany(schedule));
  },

  async indexExport(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const date_start = request.query.date_start + "T00:00:00";
    const date_end = request.query.date_end + "T23:59:59";
    const professional_id = request.query.professional_id !== "null" ? request.query.professional_id : null;

    const scheduleRepository = getRepository(ScheduleAllRelations);

    let where = {
      clinic_id: clinic_id,
      date_hour: Between(date_start, date_end),
    };
    if (professional_id) {
      (where as any).professional_id = professional_id;
    }

    const schedule = await scheduleRepository.find({
      relations: [
        "patient",
        "professional",
        "procedure",
        "health_insurance",
        "patient.person",
        "professional.person",
        "professional.user",
        "professional.occupation",
      ],
      where: where,
      order: { date_hour: "ASC" }
    });

    return response.json(exportView.renderManySchedulings(schedule));
  },

  async show(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const { id } = request.params;

    const scheduleRepository = getRepository(Scheduling);

    const scheduling = await scheduleRepository.findOneOrFail(id, {
      where: { clinic_id: clinic_id },
    });

    return response.json(scheduling);
  },

  async showDetail(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const { id } = request.params;

    const scheduleRepository = getRepository(Schedule);

    const scheduling = await scheduleRepository.findOneOrFail(id, {
      where: { clinic_id: clinic_id },
      relations: [
        "patient",
        "professional",
        "procedure",
        "health_insurance",
        "patient.person",
        "professional.person",
        "professional.user",
      ],
    });

    return response.json(scheduling);
  },

  async create(request: Request, response: Response) {
    const {
      clinic_id,
      patient_id,
      professional_id,
      procedure_id,
      health_insurance_id,
      has_health_insurance,
      scheduling_status,
      date_hour,
      date_hour_end,
    } = request.body;

    const schedulingRepository = getRepository(Scheduling);
    const scheduleRepository = getRepository(Schedule);

    let schedule = await scheduleRepository.find({
      where: {
        clinic_id: clinic_id,
        professional_id: professional_id,
        scheduling_status: Not('CANCELED'),
        date_hour: Between(new Date(date_hour).toISOString(), new Date(date_hour_end).toISOString()),
      },
    });

    if (!schedule || schedule.length === 0) {
      schedule = await scheduleRepository.find({
        where: {
          clinic_id: clinic_id,
        professional_id: professional_id,
        scheduling_status: Not('CANCELED'),
        date_hour_end: Between(new Date(date_hour).toISOString(), new Date(date_hour_end).toISOString()),
        },
      });
    }

    if (schedule && schedule.length > 0) {
      return response.status(409).json({ message: "Horário indisponível!" });
    }

    const data = {
      clinic_id,
      patient_id,
      professional_id,
      procedure_id,
      health_insurance_id,
      has_health_insurance,
      scheduling_status,
      date_hour: date_hour.setHours(date_hour.getHours() + 3 ),
      date_hour_end: date_hour_end.setHours(date_hour_end.getHours() + 3 )
    };
    
    const scheduling = schedulingRepository.create(data);

    await schedulingRepository.save(scheduling);

    return response.status(201).json(scheduling);
  },

  async update(request: Request, response: Response) {
    const data = request.body;
    const { id } = request.params;
    
    delete data.id;

    const schedulingRepository = getRepository(Scheduling);

    const scheduling = await schedulingRepository.findOneOrFail(id, {
      where: { clinic_id: data.clinic_id },
    });

    if (!scheduling) {
      return response.status(409).json({
        message:
          "Problema ao encontrar agendamento, tente novamento mais tarde!",
      });
    }

    const scheduleRepository = getRepository(Schedule);
    
    let schedule = await scheduleRepository.find({
      where: {
        id: Not(id),
        clinic_id: data.clinic_id,
        professional_id: data.professional_id,
        date_hour: Between(new Date(data.date_hour).toISOString(), new Date(data.date_hour_end).toISOString()),
      },
    });
    
    if (!schedule || schedule.length === 0) {
      schedule = await scheduleRepository.find({
        where: {
          id: Not(id),
          clinic_id: data.clinic_id,
          professional_id: data.professional_id,
          date_hour_end: Between(new Date(data.date_hour).toISOString(), new Date(data.date_hour_end).toISOString()),
        },
      });
    }
    
    if (schedule && schedule.length > 0) {
      return response.status(409).json({ message: "Horário indisponível!" });
    }

    scheduling.clinic_id = data.clinic_id;
    scheduling.patient_id = data.patient_id;
    scheduling.professional_id = data.professional_id;
    scheduling.procedure_id = data.procedure_id;
    scheduling.health_insurance_id = data.health_insurance_id;
    scheduling.has_health_insurance = data.has_health_insurance;
    scheduling.scheduling_status = data.scheduling_status;
    scheduling.date_hour = new Date(new Date(data.date_hour).toISOString());
    scheduling.date_hour_end = new Date(new Date(data.date_hour_end).toISOString());

    const __scheduling = await schedulingRepository.save(scheduling);

    const dataInfo = {
      status: true,
      message: "Agendamento atualizado com sucesso!",
      data: __scheduling,
    };

    return response.status(201).json(dataInfo);
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const scheduleRepository = getRepository(Schedule);

    const scheduling = await scheduleRepository.findOneOrFail(id);

    await scheduleRepository.remove(scheduling);

    const dataInfo = {
      status: true,
      message: 'Agendamento excluido com sucesso!'
    };

    return response.json(dataInfo);
  },

};
