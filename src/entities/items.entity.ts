import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { SchedulePrices } from "./schedulePrices.entity";

@Entity("products")
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  name: string;

  @Column()
  url: string;

  @Column()
  price: string;

  @Column()
  unit: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => SchedulePrices, (s) => s.product)
  prices: SchedulePrices[];
}
