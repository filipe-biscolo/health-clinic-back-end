import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("health_insurances")
export default class HealthInsurance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  clinic_id: string;

  @Column()
  name: string;

  @Column()
  created_at: Date;
}
