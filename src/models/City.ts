import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn, ManyToOne } from "typeorm";

@Entity("cidade")
export default class City {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({name: 'nome'})
  name: string;

  @Column()
  uf: number;
}
