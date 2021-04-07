import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import bcrypt from 'bcryptjs';

@Entity("clinics")
export default class Clinic {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  company_name: string;

  @Column()
  fantasy_name: string;

  @Column()
  cnpj: string;

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
}
