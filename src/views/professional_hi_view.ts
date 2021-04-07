import { ProfessionalHealthInsuranceBase } from "../models/ProfessionalHealthInsurance";

export default {
  render(professionalHI: ProfessionalHealthInsuranceBase) {
    return {
      id: professionalHI.id,
      name: professionalHI.health_insurance?.name,
      health_insurance_id: professionalHI.health_insurance?.id,
      professional_id: professionalHI.professional_id
    };
  },

  renderMany(professionalHIs: ProfessionalHealthInsuranceBase[]) {
    return professionalHIs.map(professionalHI => this.render(professionalHI));
  }
};
