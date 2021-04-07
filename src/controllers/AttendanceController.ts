import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Attendance from "../models/Attendance";
import Scheduling from "../models/Scheduling";


export default {
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
        scheduling
    } = request.body;

    const attendanceRepository = getRepository(Attendance);
    const schedulingRepository = getRepository(Scheduling);
    
    scheduling.scheduling_status = 'FINISHED';

    const data = {
        clinic_id,
        weight,
        blood_pressure,
        blood_type,
        allergies,
        chronic_diseases,
        note,
        prescription,
        scheduling
    }
    
    const attendance = attendanceRepository.create(data);
    
    await attendanceRepository.save(attendance);
    await schedulingRepository.save(scheduling);

    return response.status(201).json(attendance);
  },

}