import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Clinic from "../models/Clinic";

export default {
  async index(request: Request, response: Response) {
    // const { clinic_id } = request.query;
    
    // const patientRepository = getRepository(Patient);

    // const patients = await patientRepository.find({
    //   where: { clinic_id: clinic_id },
    //   relations: ["person"],
    // });

    // return response.json(patients);
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const clinicRepository = getRepository(Clinic);

    const clinic = await clinicRepository.findOneOrFail(id);

    return response.json(clinic);
  },

  async update(request: Request, response: Response) {
    const data = request.body;

    const clinicRepository = getRepository(Clinic);

    const clinic = await clinicRepository.findOneOrFail(data.id);

    if(!clinic){
        return response.status(409).json({message: "Problema ao encontrar clínic, tente novamento mais tarde!"});
    }
    
    clinic.company_name = data.company_name;
    clinic.fantasy_name = data.fantasy_name;
    clinic.cnpj = data.cnpj;
    clinic.street = data.street;
    clinic.district = data.district;
    clinic.address_number = data.address_number;
    clinic.city_id = data.city_id;
    clinic.state_id = data.state_id;
    clinic.cep = data.cep;
    clinic.phone = data.phone;

    const __clinic = await clinicRepository.save(clinic);

    const dataInfo = {
      status: true,
      message: 'Clínica atualizada com sucesso!',
      data: __clinic
    };

    return response.status(201).json(dataInfo);
    // const {
    //   sus_number,
    //   note,
    //   health_insurance,
    //   status,
    //   clinic_id,
    //   person,
    // } = request.body;

    // const patientRepository = getRepository(Patient);
    
    // const data = {
    //   sus_number,
    //   note,
    //   health_insurance,
    //   status,
    //   clinic_id,
    //   person
    // };
    
    // const patient = patientRepository.create(data);

    // await patientRepository.save(patient);

    // return response.status(201).json(patient);
  },

  async signUpdate(request: Request, response: Response) {
    const { id } = request.params;
    const dataClinic = request.body;

    const clinicRepository = getRepository(Clinic);
    
    const clinic = await clinicRepository.findOne({where: {id}});
        
    if(!clinic){
        return response.status(404).json({message: "Clinica não encontrada!"});
    }

    clinic.company_name = dataClinic.company_name;
    clinic.fantasy_name = dataClinic.fantasy_name;
    clinic.cnpj = dataClinic.cnpj;
    clinic.street = dataClinic.street;
    clinic.district = dataClinic.district;
    clinic.address_number = dataClinic.address_number;
    clinic.city_id = dataClinic.city_id;
    clinic.state_id = dataClinic.state_id;
    clinic.cep = dataClinic.cep;
    clinic.phone = dataClinic.phone;

    await clinicRepository.save(clinic);

    const dataInfo = {
      status: true,
      message: 'Clinica atualizada com sucesso!',
      data: {
        clinic
      }
  };

    return response.status(201).json(dataInfo);
  },

  // async delete(request: Request, response: Response) {
  //   const { id } = request.params;

  //   const patientRepository = getRepository(Patient);
  //   const personRepository = getRepository(Person);

  //   const patient = await patientRepository.findOneOrFail(id, {
  //     relations: ["person"],
  //   });

  //   const person = await personRepository.findOneOrFail(patient.person.id);

  //   await patientRepository.remove(patient);
  //   await personRepository.remove(person);

  //   return response.json(patient);
  // },
};
