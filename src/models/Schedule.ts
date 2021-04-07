import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import HealthInsurance from "./HealthInsurance";
import {Patient} from "./Patient";
import Procedure from "./Procedure";
import {Professional} from "./Professional";

@Entity("schedule")
export default class Schedule {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  clinic_id: string;

  @Column()
  professional_id: string;

  @Column()
  scheduling_status: string;

  @Column()
  has_health_insurance: boolean;

  @Column()
  date_hour: Date;

  @Column()
  date_hour_end: Date;

  @Column()
  created_at: Date;

  @Column()
  update_at: Date;

  @OneToOne(() => Patient)
  @JoinColumn({ name: 'patient_id'})
  patient: Patient

  @OneToOne(() => Professional)
  @JoinColumn({ name: 'professional_id'})
  professional: Professional

  @OneToOne(() => Procedure)
  @JoinColumn({ name: 'procedure_id'})
  procedure: Procedure

  @OneToOne(() => HealthInsurance)
  @JoinColumn({ name: 'health_insurance_id'})
  health_insurance: HealthInsurance

}