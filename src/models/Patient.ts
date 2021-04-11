import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import HealthInsurance from "./HealthInsurance";
import {Person, PersonAllRelations} from "./Person";

@Entity("patients")
export class Patient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  sus_number: string;

  @Column()
  email: string;

  @Column()
  note: string;

  @Column()
  health_insurance_id: string;

  @Column()
  created_at: Date;

  @Column()
  update_at: Date;

  @Column()
  clinic_id: string;

  @OneToOne(() => Person, { cascade: ['insert', 'update'], onDelete: 'CASCADE'} )
  @JoinColumn({ name: 'person_id'})
  person: Person
}

@Entity("patients")
export class PatientAllRelations {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  sus_number: string;

  @Column()
  email: string;

  @Column()
  note: string;

  @Column()
  created_at: Date;

  @Column()
  update_at: Date;

  @Column()
  clinic_id: string;

  @OneToOne(() => HealthInsurance)
  @JoinColumn({ name: 'health_insurance_id'})
  health_insurance: HealthInsurance;

  @OneToOne(() => PersonAllRelations, { cascade: ['insert', 'update'], onDelete: 'CASCADE'} )
  @JoinColumn({ name: 'person_id'})
  person: PersonAllRelations;
}