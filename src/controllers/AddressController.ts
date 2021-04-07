import { Request, Response } from "express";
import { getRepository } from "typeorm";
import City from "../models/City";
import State from "../models/State";

export default {
    async indexStates(request: Request, response: Response) {
        const stateRepository = getRepository(State);
    
        const states = await stateRepository.find();
    
        return response.json(states);
      },
    
      async showState(request: Request, response: Response) {
        const { id } = request.params;
    
        const stateRepository = getRepository(State);
    
        const patient = await stateRepository.findOneOrFail(id);
    
        return response.json(patient);
      },

      async indexCities(request: Request, response: Response) {
        const { state_id } = request.params;

        const cityRepository = getRepository(City);
    
        const cities = await cityRepository.find({where: { uf: state_id }});
    
        return response.json(cities);
      },

      async showCity(request: Request, response: Response) {
        const { id } = request.params;
    
        const cityRepository = getRepository(City);
    
        const patient = await cityRepository.findOneOrFail(id);
    
        return response.json(patient);
      },
}