import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("procedures")
export default class Occupation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  clinic_id: string;

  @Column()
  name: string;

  @Column()
  duration: number;
}
