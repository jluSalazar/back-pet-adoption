import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Pet } from './pet.entity';
import { Adoption } from './adoption.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'firstname' })
  firstName: string;

  @Column({ name: 'lastname' })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ name: 'zipcode', nullable: true })
  zipCode: string;

  @Column({ default: 'user' })
  role: 'admin' | 'user' | 'shelter';

  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedat' })
  updatedAt: Date;

  @OneToMany(() => Pet, pet => pet.shelter)
  pets: Pet[];

  @OneToMany(() => Adoption, adoption => adoption.user)
  adoptionsAsUser: Adoption[];

  @OneToMany(() => Adoption, adoption => adoption.shelter)
  adoptionsAsShelter: Adoption[];
}
