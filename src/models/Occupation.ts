import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum Permissions {
  HP = "HP", // Profissional da saúde
  SE = "SE", // Secretário
};

@Entity("occupations")
export class Occupation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  clinic_id: string;

  @Column()
  name: string;

  @Column({
    type: "varchar",
    enum: Permissions
  })
  permissions: Permissions;
}
