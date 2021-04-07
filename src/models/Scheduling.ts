import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("schedule")
export default class Scheduling {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  clinic_id: string;

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

  @Column()
  patient_id: string;

  @Column()
  professional_id: string;

  @Column()
  procedure_id: string;

  @Column()
  health_insurance_id: string;
}