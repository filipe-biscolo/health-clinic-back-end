import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import HealthInsurance from "./HealthInsurance";
import {Professional} from "./Professional";

@Entity("professional_health_insurances")
export class ProfessionalHealthInsuranceBasic {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  health_insurance_id: string;

  @Column()
  professional_id: string;
}

@Entity("professional_health_insurances")
export class ProfessionalHealthInsurance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  health_insurance_id: string;

  @ManyToOne(() => Professional, (professional) => professional.health_insurances)
  @JoinColumn({ name: "professional_id" })
  professional: Professional;
}

@Entity("professional_health_insurances")
export class ProfessionalHealthInsuranceAllRelations {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => HealthInsurance)
  @JoinColumn({ name: 'health_insurance_id'})
  health_insurance: HealthInsurance;

  @ManyToOne(() => Professional, (professional) => professional.health_insurances)
  @JoinColumn({ name: "professional_id" })
  professional: Professional;
}

@Entity("professional_health_insurances")
export class ProfessionalHealthInsuranceBase {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  professional_id: string;
  
  @OneToOne(() => HealthInsurance)
  @JoinColumn({ name: 'health_insurance_id'})
  health_insurance: HealthInsurance;
}
