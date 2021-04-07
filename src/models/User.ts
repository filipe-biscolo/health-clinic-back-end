import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import bcrypt from 'bcryptjs';
import Clinic from "./Clinic";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 200 })
  email: string;

  @Column()
  password: string;

  @Column()
  clinic_id: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
}
