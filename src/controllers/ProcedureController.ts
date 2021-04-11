import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Procedure from "../models/Procedure";
import exportView from "../views/export_view";

export default {
  async index(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);

    const skippedItems = page * limit;
    
    const procedureRepository = getRepository(Procedure);

    const [procedures, totalCount ] = await procedureRepository.findAndCount(
      {
        where: { clinic_id: clinic_id },
        order: { name: "ASC",  duration: "ASC"},
        skip: skippedItems,
        take: limit
      }
    );

    const pageInfo = {
      page,
      limit,
      totalCount,
      procedures
    }

    return response.json(pageInfo);
  },

  async indexAll(request: Request, response: Response) {
    const { clinic_id } = request.query;
    
    const procedureRepository = getRepository(Procedure);

    const procedures = await procedureRepository.find({
      where: { clinic_id: clinic_id }
    });

    return response.json(procedures);
  },

  async indexExport(request: Request, response: Response) {
    const { clinic_id } = request.query;
    
    const procedureRepository = getRepository(Procedure);

    const procedures = await procedureRepository.find({
      where: { clinic_id: clinic_id }
    });

    return response.json(exportView.renderManyProcedures(procedures));
  },

  async show(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const { id } = request.params;

    const procedureRepository = getRepository(Procedure);

    const procedure = await procedureRepository.findOneOrFail(id, {
      where: { clinic_id: clinic_id }
    });

    return response.json(procedure);
  },

  async create(request: Request, response: Response) {
    const {
      name,
      duration,
      clinic_id
    } = request.body;

    const procedureRepository = getRepository(Procedure);
    
    const data = {
      name,
      duration,
      clinic_id
    };
    
    const procedure = procedureRepository.create(data);

    const __procedure = await procedureRepository.save(procedure);

    const dataInfo = {
      status: true,
      message: 'Procedimento criado com sucesso!',
      data: __procedure
    };

    return response.status(201).json(dataInfo);
  },

  async update(request: Request, response: Response) {
    const {
      id,
      name,
      duration,
      clinic_id
    } = request.body;

    const procedureRepository = getRepository(Procedure);

    const procedure = await procedureRepository.findOneOrFail(id, {
      where: { clinic_id: clinic_id }
    });

    if(!procedure){
        return response.status(409).json({message: "Problema ao encontrar procedimento, tente novamento mais tarde!"});
    }
    
    procedure.name = name;
    procedure.duration = duration;

    const __procedure = await procedureRepository.save(procedure);

    const dataInfo = {
      status: true,
      message: 'Procedimento atualizado com sucesso!',
      data: __procedure
    };

    return response.status(201).json(dataInfo);
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    let err;
    const procedureRepository = getRepository(Procedure);

    const procedure = await procedureRepository.findOneOrFail(id);

    try {
      await procedureRepository.remove(procedure);
    } catch (error) {
      err = error;
    }

    const dataInfo = {
      status: !err ? true : false,
      message: !err ? "Procedimento excluido com sucesso!" : "Convênio em uso, não é possível excluí-lo"
    };

    return response.json(dataInfo);
  },
};
