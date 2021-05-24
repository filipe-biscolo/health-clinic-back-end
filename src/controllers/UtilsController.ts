import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Clinic from "../models/Clinic";
import { Occupation } from "../models/Occupation";
import { ProfessionalBasic } from "../models/Professional";

export default {
  async dataConnectedUser(request: Request, response: Response) {
    const { clinic_id } = request.query;
    const { id } = request.params;

    const clinicRepository = getRepository(Clinic);
    const professionalRepository = getRepository(ProfessionalBasic);

    const clinic = await clinicRepository.findOneOrFail({
      where: { id: clinic_id }
    });

    const professional = await professionalRepository.findOneOrFail({
      where: { clinic_id: clinic_id, user_id: id },
      relations: ["person"]
    });

    const dataInfo = {
      status: true,
      message: 'Dados do usuário!',
      data: {
        user_name: professional.person.name,
        clinic_name: clinic.fantasy_name
      }
    };

    return response.json(dataInfo);
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
};
