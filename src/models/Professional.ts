import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Occupation } from "./Occupation";
import { Person, PersonAllRelations } from "./Person";
import { ProfessionalHealthInsurance, ProfessionalHealthInsuranceAllRelations } from "./ProfessionalHealthInsurance";
import User from "./User";

@Entity("professionals")
export class Professional {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  occupation_id: string;

  @Column()
  note: string;

  @Column()
  admin: boolean;

  @Column()
  created_at: Date;

  @Column()
  clinic_id: string;

  @OneToOne(() => User, { cascade: ["insert", "update"] })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToOne(() => Person, { cascade: ["insert", "update"] })
  @JoinColumn({ name: "person_id" })
  person: Person;

  @OneToMany(
    () => ProfessionalHealthInsurance,
    (health_insurance) => health_insurance.professional, { cascade: ["insert", "update"]})
  @JoinColumn({ name: "professional_id" })
  health_insurances: ProfessionalHealthInsurance[];
}

@Entity("professionals")
export class ProfessionalAllRelations {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  note: string;

  @Column()
  admin: boolean;

  @Column()
  created_at: Date;

  @Column()
  clinic_id: string;

  @OneToOne(() => User, { cascade: ["insert", "update"] })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToOne(() => Person, { cascade: ["insert", "update"] })
  @JoinColumn({ name: "person_id" })
  person: Person;

  @OneToOne(() => Occupation)
  @JoinColumn({ name: "occupation_id" })
  occupation: Occupation;

  @OneToMany(
    () => ProfessionalHealthInsurance,
    (health_insurance) => health_insurance.professional, { cascade: ["insert", "update"]})
  @JoinColumn({ name: "professional_id" })
  health_insurances: ProfessionalHealthInsurance[];
}

@Entity("professionals")
export class ProfessionalExport {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  note: string;

  @Column()
  admin: boolean;

  @Column()
  created_at: Date;

  @Column()
  clinic_id: string;

  @OneToOne(() => User, { cascade: ["insert", "update"] })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToOne(() => PersonAllRelations, { cascade: ["insert", "update"] })
  @JoinColumn({ name: "person_id" })
  person: PersonAllRelations;

  @OneToOne(() => Occupation)
  @JoinColumn({ name: "occupation_id" })
  occupation: Occupation;

  @OneToMany(
    () => ProfessionalHealthInsuranceAllRelations,
    (health_insurance) => health_insurance.professional, { cascade: ["insert", "update"]})
  @JoinColumn({ name: "professional_id" })
  health_insurances: ProfessionalHealthInsuranceAllRelations[];
}

@Entity("professionals")
export class ProfessionalBasic {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  note: string;

  @Column()
  admin: boolean;

  @Column()
  created_at: Date;

  @Column()
  clinic_id: string;

  @Column()
  user_id: string;

  @OneToOne(() => Person, { cascade: ["insert", "update"] })
  @JoinColumn({ name: "person_id" })
  person: Person;
  
  @OneToOne(() => Occupation )
  @JoinColumn({ name: "occupation_id" })
  occupation: Occupation;
}
