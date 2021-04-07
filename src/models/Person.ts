import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

export enum MaritalStatus {
  SO = "SO", // Solteiro
  CA = "CA", // Casado
  DI = "DI", // Divorciado
  VI = "VI", // Viúvo
  SE = "SE", // Separado
};

export enum Sex {
  M = "M", // Masculino
  F = "F", // Feminino
};

@Entity("persons")
export default class Person {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  cpf: string;

  @Column()
  rg: string;

  @Column()
  birth_date: string;

  @Column({
    type: "varchar",
    enum: Sex
  })
  sex: Sex;

  @Column({
    type: "varchar",
    enum: MaritalStatus
  })
  marital_status: MaritalStatus;

  @Column()
  street: string;

  @Column()
  district: string;

  @Column()
  address_number: string;
  
  @Column()
  city_id: number;
  
  @Column()
  state_id: number;
  
  @Column()
  cep: string;

  @Column()
  phone: string;
  
  @Column()
  phone_aux: string;
}
