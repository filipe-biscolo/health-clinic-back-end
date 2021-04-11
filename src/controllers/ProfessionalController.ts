import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Person } from "../models/Person";
import { Professional, ProfessionalAllRelations, ProfessionalExport } from "../models/Professional";
import { Permissions } from "../models/Occupation";
import { ProfessionalHealthInsurance, ProfessionalHealthInsuranceBase, ProfessionalHealthInsuranceBasic } from "../models/ProfessionalHealthInsurance";
// import ProfessionalHealthInsurance  from "../models/ProfessionalHealthInsurance";
import professionalView from "../views/professional_view";
import professionalHIView from "../views/professional_hi_view";
import exportView from "../views/export_view";
import User from "../models/User";

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

  async indexExport(request: Request, response: Response) {
    const { clinic_id } = request.query;
    
    const professionalRepository = getRepository(ProfessionalExport);

    const professionals =
    await professionalRepository.createQueryBuilder("professionals")
    .leftJoinAndSelect("professionals.user", "user")
    .leftJoinAndSelect("professionals.person", "person")
    .leftJoinAndSelect("person.city", "city")
    .leftJoinAndSelect("person.state", "state")
    .leftJoinAndSelect("professionals.health_insurances", "health_insurances")
    .leftJoinAndSelect("health_insurances.health_insurance", "health_insurance")
    .leftJoinAndSelect("professionals.occupation", "occupation")
    .where("professionals.clinic_id = :clinic_id", { clinic_id: clinic_id })
    .getMany();

    return response.json(exportView.renderManyProfessionals(professionals));
  },

  async indexSchedule(request: Request, response: Response) {
    const { clinic_id } = request.query;
    
    const professionalRepository = getRepository(ProfessionalAllRelations);

    const professionals =
    await professionalRepository.createQueryBuilder("professionals")
    .leftJoinAndSelect("professionals.person", "person")
    .leftJoinAndSelect("professionals.health_insurances", "health_insurances")
    .leftJoinAndSelect("professionals.occupation", "occupation")
    .where("professionals.clinic_id = :clinic_id", { clinic_id: clinic_id })
    .andWhere("occupation.permissions = :permissions", { permissions: Permissions.HP })
    .getMany();
    
    return response.json(professionalView.renderManySchedule(professionals));
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
    const usersRepository = getRepository(User);

    const userExists = await usersRepository.findOne({ where: { email: user.email } });

    if (userExists) {
      return response
        .status(409)
        .json({ message: "Já existe um usuário com esse e-mail cadastrado!", type: "USER" });
    }
    
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
    let err;
    const professionalRepository = getRepository(Professional);
    const personRepository = getRepository(Person);
    const userRepository = getRepository(User);

    const professional = await professionalRepository.findOneOrFail(id, {
      relations: ["person", "user"],
    });

    const person = await personRepository.findOneOrFail(professional.person.id);
    const user = await userRepository.findOneOrFail(professional.user.id);

    try {
      await professionalRepository.remove(professional);
    } catch (error) {
      err = error;
    }

    if(!err) {
      await personRepository.remove(person);
      await userRepository.remove(user);
    }

    const dataInfo = {
      status: !err ? true : false,
      message: !err ? "Profissional excluido com sucesso!" : "Profissional com ligações, não é possível excluí-lo"
    };

    return response.json(dataInfo);
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
    const health_insurance_id = request.query.health_insurance_id as string;

    const professionalHIRepository = getRepository(ProfessionalHealthInsurance);

    const userExists = await professionalHIRepository.findOne({ where: { health_insurance_id, professional: { id: professional.id} } });

    if (userExists) {
      return response
        .status(409)
        .json({ message: "Convênio já está cadastrado para este profissional!" });
    }
    
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
