import {Professional, ProfessionalAllRelations} from "../models/Professional";

export default {
  render(professional: ProfessionalAllRelations) {
    return {
      id: professional.id,
      name: professional.person?.name,
      phone: professional.person?.phone,
      email: professional.user?.email,
      admin: professional.admin,
      occupation_name: professional.occupation?.name
    };
  },

  renderMany(professionals: ProfessionalAllRelations[]) {
    return professionals.map(professional => this.render(professional));
  },

  rederSchedule(professional: ProfessionalAllRelations){
    return {
      id: professional.id,
      name: professional.person?.name,
      health_insurances: professional.health_insurances
    };
  },

  renderManySchedule(professionals: ProfessionalAllRelations[]){
    return professionals.map(professional => this.rederSchedule(professional));
  }
};
