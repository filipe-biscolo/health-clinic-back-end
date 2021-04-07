import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Person from "../models/Person";
import { Professional, ProfessionalAllRelations } from "../models/Professional";
import { ProfessionalHealthInsurance, ProfessionalHealthInsuranceBase, ProfessionalHealthInsuranceBasic } from "../models/ProfessionalHealthInsurance";
// import ProfessionalHealthInsurance  from "../models/ProfessionalHealthInsurance";
import professionalView from "../views/professional_view";
import professionalHIView from "../views/professional_hi_view";

export default {
  async index(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);

    const skippedItems = page * limit;
    
    const professionalRepository = getRepository(ProfessionalAllRelations);

    const [professionals, totalCount ] = await professionalRepository.findAndCount(
      {
        relations: ["person", "user", "occupation"],
        where: { clinic_id: clinic_id },
        // order: { person: { name: "ASC" }},
        // order: { person.name: "ASC" },
        order: { person: "ASC" },
        skip: skippedItems,
        take: limit
      }
    );
    
    const pageInfo = {
      page,
      limit,
      totalCount,
      professionals: professionalView.renderMany(professionals)
    }

    return response.json(pageInfo);
  },

  async indexAll(request: Request, response: Response) {
    const { clinic_id } = request.query;
    
    const professionalRepository = getRepository(Professional);

    const professionals = await professionalRepository.find({
      where: { clinic_id: clinic_id },
      relations: ["person"],
    });

    return response.json(professionals);
  },

  async show(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const { id } = request.params;

    const professionalRepository = getRepository(Professional);

    const patient = await professionalRepository.findOneOrFail(id, {
      where: { clinic_id: clinic_id },
      relations: ["user", "person", "health_insurances"],
    });

    return response.json(patient);
  },

  async create(request: Request, response: Response) {
    const {
      occupation_id,
      note,
      admin,
      clinic_id,
      person,
      user,
      health_insurances
    } = request.body;

    const professionalRepository = getRepository(Professional);
    
    const data = {
      occupation_id,
      note,
      admin,
      clinic_id,
      person,
      user,
      health_insurances
    };
    
    const professional = professionalRepository.create(data);

    await professionalRepository.save(professional);

    return response.status(201).json(professional);
  },

  async update(request: Request, response: Response) {
    const data = request.body;
    const { id } = request.params;
    const professionalRepository = getRepository(Professional);

    const professional = await professionalRepository.findOneOrFail(id, {
      where: { clinic_id: data.clinic_id },
      relations: ["person"],
    });

    
    if(!professional){
        return response.status(409).json({message: "Problema ao encontrar profissional, tente novamento mais tarde!"});
    }

    professional.occupation_id = data.occupation_id;
    professional.note = data.note;
    professional.admin = data.admin;
    professional.person = data.person;

    const __professional = await professionalRepository.save(professional);

    const dataInfo = {
      status: true,
      message: 'Profissional atualizado com sucesso!',
      data: __professional
    };

    return response.status(201).json(dataInfo);
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const professionalRepository = getRepository(Professional);
    const personRepository = getRepository(Person);

    const professional = await professionalRepository.findOneOrFail(id, {
      relations: ["person"],
    });

    const person = await personRepository.findOneOrFail(professional.person.id);

    await professionalRepository.remove(professional);
    await personRepository.remove(person);

    return response.json(professional);
  },

  async indexHI(request: Request, response: Response) {
    const professional_id = request.params.id;
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);
    
    const skippedItems = page * limit;
    
    const professionalRepository = getRepository(ProfessionalHealthInsuranceBase);

    const [professionalHIs, totalCount ] = await professionalRepository.findAndCount(
      {
        relations: ["health_insurance"],
        where: { professional_id: professional_id },
        skip: skippedItems,
        take: limit
      }
    );
    
    const pageInfo = {
      page,
      limit,
      totalCount,
      professionalHIs: professionalHIView.renderMany(professionalHIs)
    }

    return response.json(pageInfo);
  },

  async createHI(request: Request, response: Response) {
    const professional = request.body;
    const health_insurance_id = professional.health_insurance_id;
    console.log('health_insurance_id', health_insurance_id)

    const professionalHIRepository = getRepository(ProfessionalHealthInsurance);
    
    const data = {
      health_insurance_id,
      professional
    };
    
    const professionalHI = professionalHIRepository.create(data);

    await professionalHIRepository.save(professionalHI);

    return response.status(201).json(professionalHI);
  },

  async deleteHI(request: Request, response: Response) {
    const { id } = request.params;

    const professionalHIRepository = getRepository(ProfessionalHealthInsuranceBasic);

    const professionalHI = await professionalHIRepository.findOneOrFail(id);

    const __professionalHI = await professionalHIRepository.remove(professionalHI);

    const dataInfo = {
      status: true,
      message: 'Convênio excluido com sucesso!',
      data: __professionalHI
    };

    return response.json(dataInfo);
  },
};
