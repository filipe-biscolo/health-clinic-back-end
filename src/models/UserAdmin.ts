import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import bcrypt from 'bcryptjs';
import Clinic from "./Clinic";

@Entity("users")
export default class UserAdmin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Clinic, {
    cascade: ['insert']
  })
  @JoinColumn({ name: 'clinic_id'})
  clinic: Clinic;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
}
