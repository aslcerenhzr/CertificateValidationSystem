// src/entities/Certificate.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("certificates")
export class Certificate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  studentAddress!: string; // e.g. "0xabc123..."

  @Column()
  issuerAddress!: string;

  @Column()
  ipfsHash!: string;

  @Column()
  docHash!: string; // e.g. keccak256 hash of the doc

  @Column({ type: "bigint" })
  issuedAt!: number; // store timestamp
}
