import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("estado")
export default class State {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({name: 'nome'})
  name: string;

  @Column()
  uf: string;
}
