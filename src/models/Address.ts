import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("persons")
export default class Address {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
}
