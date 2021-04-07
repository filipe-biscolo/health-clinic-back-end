import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, BeforeUpdate } from "typeorm";

@Entity("users_forgot")
export default class UserForgot {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  confirmed: boolean;

  @Column()
  code: string;
}
