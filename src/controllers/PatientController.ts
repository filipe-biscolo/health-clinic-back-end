import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Patient, PatientAllRelations} from "../models/Patient";
import * as Yup from "yup";
import Person from "../models/Person";

import patientView from "../views/patient_view";

export default {
  async index(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);

    const skippedItems = page * limit;
    
    const patientRepository = getRepository(PatientAllRelations);

    const [patients, totalCount ] = await patientRepository.findAndCount(
      {
        relations: ["person", "health_insurance"],
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
      patients: patientView.renderMany(patients)
    }

    return response.json(pageInfo);
  },

  async indexAll(request: Request, response: Response) {
    const { clinic_id } = request.query;
    
    const patientRepository = getRepository(Patient);

    const patients = await patientRepository.find({
      where: { clinic_id: clinic_id },
      relations: ["person"],
    });

    return response.json(patients);
  },

  // async indexPaginate(request: Request, response: Response) {
  //   const { clinic_id } = request.query;
  //   const page = Number(request.query.page);
  //   const limit = Number(request.query.limit);
    
  //   const patientRepository = getRepository(Patient);

  //   const [patients, count ] = await patientRepository.findAndCount(
  //     {
  //       relations: ["person"],
  //       where: { clinic_id: clinic_id },
  //       skip: page,
  //       take: limit
  //     }
  //   );

  //   let patients = await patientRepository.createQueryBuilder('user')
  //   .where({ clinic_id: clinic_id })
  //   .relation(Person, 'person')
  //   .paginate();

  //   return response.json(patients);
  // },

  async show(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const { id } = request.params;

    const patientRepository = getRepository(Patient);

    const patient = await patientRepository.findOneOrFail(id, {
      where: { clinic_id: clinic_id },
      relations: ["person"],
    });

    return response.json(patient);
  },

  async create(request: Request, response: Response) {
    const {
      email,
      health_insurance_id,
      note,
      sus_number,
      person,
      clinic_id
    } = request.body;

    const patientRepository = getRepository(Patient);

    const data = {
      email,
      health_insurance_id,
      note,
      sus_number,
      person,
      clinic_id
    }
    
    const patient = patientRepository.create(data);

    await patientRepository.save(patient);

    return response.status(201).json(patient);
  },

  async update(request: Request, response: Response) {
    const data = request.body;
    const { id } = request.params;

    delete data.id;

    const patientRepository = getRepository(Patient);

    const patient = await patientRepository.findOneOrFail(id, {
      where: { clinic_id: data.clinic_id }
    });

    if(!patient){
        return response.status(409).json({message: "Problema ao encontrar paciente, tente novamento mais tarde!"});
    }
    
    patient.email = data.email;
    patient.health_insurance_id = data.health_insurance_id;
    patient.note = data.note;
    patient.sus_number = data.sus_number;
    patient.person = data.person;

    const __patient = await patientRepository.save(patient);

    const dataInfo = {
      status: true,
      message: 'Paciente atualizado com sucesso!',
      data: __patient
    };

    return response.status(201).json(dataInfo);
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const patientRepository = getRepository(Patient);
    const personRepository = getRepository(Person);

    const patient = await patientRepository.findOneOrFail(id, {
      relations: ["person"],
    });

    const person = await personRepository.findOneOrFail(patient.person.id);

    await patientRepository.remove(patient);
    await personRepository.remove(person);

    return response.json(patient);
  },
};
