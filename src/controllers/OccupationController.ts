import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Occupation from "../models/Occupation";

export default {
  async index(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);

    const skippedItems = page * limit;
    
    const occupationRepository = getRepository(Occupation);

    const [occupations, totalCount ] = await occupationRepository.findAndCount(
      {
        where: { clinic_id: clinic_id },
        order: { name: "ASC",  permissions: "ASC"},
        skip: skippedItems,
        take: limit
      }
    );

    const pageInfo = {
      page,
      limit,
      totalCount,
      occupations
    }

    return response.json(pageInfo);
  },

  async indexAll(request: Request, response: Response) {
    const { clinic_id } = request.query;
    
    const occupationRepository = getRepository(Occupation);

    const occupations = await occupationRepository.find({
      where: { clinic_id: clinic_id }
    });

    return response.json(occupations);
  },

  async show(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const { id } = request.params;

    const occupationRepository = getRepository(Occupation);

    const occupation = await occupationRepository.findOneOrFail(id, {
      where: { clinic_id: clinic_id }
    });

    return response.json(occupation);
  },

  async create(request: Request, response: Response) {
    const {
      name,
      permissions,
      clinic_id
    } = request.body;

    const occupationRepository = getRepository(Occupation);
    
    const data = {
      name,
      permissions,
      clinic_id
    };
    
    const occupation = occupationRepository.create(data);

    const __occupation = await occupationRepository.save(occupation);

    const dataInfo = {
      status: true,
      message: 'Cargo criado com sucesso!',
      data: __occupation
    };

    return response.status(201).json(dataInfo);
  },

  async update(request: Request, response: Response) {
    const {
      id,
      name,
      permissions,
      clinic_id
    } = request.body;

    const occupationRepository = getRepository(Occupation);

    const occupation = await occupationRepository.findOneOrFail(id, {
      where: { clinic_id: clinic_id }
    });

    if(!occupation){
        return response.status(409).json({message: "Problema ao encontrar cargo, tente novamento mais tarde!"});
    }
    
    occupation.name = name;
    occupation.permissions = permissions;

    const __occupation = await occupationRepository.save(occupation);

    const dataInfo = {
      status: true,
      message: 'Cargo atualizado com sucesso!',
      data: __occupation
    };

    return response.status(201).json(dataInfo);
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const occupationRepository = getRepository(Occupation);

    const occupation = await occupationRepository.findOneOrFail(id);

    await occupationRepository.remove(occupation);

    const dataInfo = {
      status: true,
      message: 'Cargo excluido com sucesso!'
    };

    return response.json(dataInfo);
  },
};
