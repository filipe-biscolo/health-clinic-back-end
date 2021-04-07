import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import Scheduling from "./Scheduling";

export enum BloodType {
  ABN = "ABN",
  BN = "BN",
  AN = "AN",
  ON = "ON",
  ABP = "ABP",
  BP = "BP",
  AP = "AP",
  OP = "OP",
};

@Entity("attendances")
export default class Attendance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  clinic_id: string;

  @Column()
  weight: number;

  @Column()
  blood_pressure: string;

  @Column({
    type: "varchar",
    enum: BloodType
  })
  blood_type: BloodType;

  @Column()
  allergies: string;

  @Column()
  chronic_diseases: string;

  @Column()
  note: string;

  @Column()
  prescription: string;

  @Column()
  created_at: Date;

  @OneToOne(() => Scheduling)
  @JoinColumn({ name: 'scheduling_id'})
  scheduling: Scheduling
}