// src/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ default: "student" }) // Possible values: "student", "issuer", "admin"
  role!: string;

  @Column({ unique: true })
  publicAddress!: string;
}
