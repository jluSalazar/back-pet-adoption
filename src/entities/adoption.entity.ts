import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Pet } from './pet.entity';

@Entity('adoptions')
export class Adoption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'petid' })
  petId: string;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ name: 'shelterid', nullable: true })
  shelterId: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  reason: string;

  @ManyToOne(() => Pet, pet => pet.adoptions)
  @JoinColumn({ name: 'petid' })
  pet: Pet;

  @ManyToOne(() => User, user => user.adoptionsAsUser)
  @JoinColumn({ name: 'userid' })
  user: User;

  @ManyToOne(() => User, user => user.adoptionsAsShelter)
  @JoinColumn({ name: 'shelterid' })
  shelter: User;

  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedat' })
  updatedAt: Date;
}
