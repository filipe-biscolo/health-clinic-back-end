import { Request, Response } from "express";
import { getRepository } from "typeorm";
import HealthInsurance from "../models/HealthInsurance";
import exportView from "../views/export_view";

export default {
  async index(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);

    const skippedItems = page * limit;
    
    const hiRepository = getRepository(HealthInsurance);

    const [healthInsurances, totalCount ] = await hiRepository.findAndCount(
      {
        where: { clinic_id: clinic_id },
        order: { name: "ASC" },
        skip: skippedItems,
        take: limit
      }
    );

    const pageInfo = {
      page,
      limit,
      totalCount,
      healthInsurances
    }

    return response.json(pageInfo);
  },

  async indexAll(request: Request, response: Response) {
    const { clinic_id } = request.query;

    const hiRepository = getRepository(HealthInsurance);

    const healthInsurances = await hiRepository.find({
      where: { clinic_id: clinic_id },
    });

    return response.json(healthInsurances);
  },

  async indexExport(request: Request, response: Response) {
    const { clinic_id } = request.query;

    const hiRepository = getRepository(HealthInsurance);

    const healthInsurances = await hiRepository.find({
      where: { clinic_id: clinic_id },
    });

    return response.json(exportView.renderManyHealthInsurances(healthInsurances));
  },
  
  async show(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const { id } = request.params;

    const hiRepository = getRepository(HealthInsurance);

    const healthInsurance = await hiRepository.findOneOrFail(id, {
      where: { clinic_id: clinic_id },
    });

    return response.json(healthInsurance);
  },

  async create(request: Request, response: Response) {
    const { name, clinic_id } = request.body;

    const hiRepository = getRepository(HealthInsurance);

    const data = {
      name,
      clinic_id,
    };

    const healthInsurance = hiRepository.create(data);

    const __healthInsurance = await hiRepository.save(healthInsurance);

    const dataInfo = {
      status: true,
      message: "Conv??nio criado com sucesso!",
      data: __healthInsurance,
    };

    return response.status(201).json(dataInfo);
  },

  async update(request: Request, response: Response) {
    const { id, name, clinic_id } = request.body;

    const hiRepository = getRepository(HealthInsurance);

    const healthInsurance = await hiRepository.findOneOrFail(id, {
      where: { clinic_id: clinic_id },
    });

    if (!healthInsurance) {
      return response
        .status(409)
        .json({
          message:
            "Problema ao encontrar conv??nio, tente novamento mais tarde!",
        });
    }

    healthInsurance.name = name;

    const __healthInsurance = await hiRepository.save(healthInsurance);

    const dataInfo = {
      status: true,
      message: "Conv??nio atualizado com sucesso!",
      data: __healthInsurance,
    };

    return response.status(201).json(dataInfo);
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    let err;

    const hiRepository = getRepository(HealthInsurance);

    const healthInsurance = await hiRepository.findOneOrFail(id);
    
    try {
      await hiRepository.remove(healthInsurance);
    } catch (error) {
      err = error;
    }

    const dataInfo = {
      status: !err ? true : false,
      message: !err ? "Conv??nio excluido com sucesso!" : "Conv??nio em uso, n??o ?? poss??vel exclu??-lo",
    };

    return response.json(dataInfo);
  },
};
