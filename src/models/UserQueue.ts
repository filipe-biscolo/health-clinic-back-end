import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("users_queue")
export default class UserQueue {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 200 })
  email: string;

  @Column()
  confirmed: boolean;

  @Column()
  code: string;
}
