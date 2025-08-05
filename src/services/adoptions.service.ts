import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adoption } from '../entities/adoption.entity';
import { CreateAdoptionDto, UpdateAdoptionDto } from '../dto/adoption.dto';
import { PetsService } from './pets.service';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectRepository(Adoption)
    private readonly adoptionRepository: Repository<Adoption>,
    private readonly petsService: PetsService,
  ) {}

  async findAll(): Promise<Adoption[]> {
    return this.adoptionRepository.find({
      relations: ['pet', 'user', 'shelter'],
    });
  }

  async findOne(id: string): Promise<Adoption> {
    const adoption = await this.adoptionRepository.findOne({
      where: { id },
      relations: ['pet', 'user', 'shelter'],
    });
    if (!adoption) {
      throw new NotFoundException(`Adoption with ID ${id} not found`);
    }
    return adoption;
  }

  async create(userId: string, createAdoptionDto: CreateAdoptionDto): Promise<Adoption> {
    const pet = await this.petsService.findOne(createAdoptionDto.petId);
    if (!pet.isAvailable) {
      throw new Error('Pet is not available for adoption');
    }

    const adoption = this.adoptionRepository.create({
      ...createAdoptionDto,
      userId,
      shelterId: pet.shelterId,
      status: 'pending',
    });

    return await this.adoptionRepository.save(adoption);
  }

  async update(id: string, updateAdoptionDto: UpdateAdoptionDto): Promise<Adoption> {
    const adoption = await this.findOne(id);
    Object.assign(adoption, updateAdoptionDto);

    if (updateAdoptionDto.status === 'completed') {
      const pet = await this.petsService.findOne(adoption.petId);
      await this.petsService.update(pet.id, { isAvailable: false });
    }

    return await this.adoptionRepository.save(adoption);
  }

  async remove(id: string): Promise<void> {
    const adoption = await this.findOne(id);
    await this.adoptionRepository.remove(adoption);
  }

  async findByUser(userId: string): Promise<Adoption[]> {
    return this.adoptionRepository.find({
      where: { userId },
      relations: ['pet', 'user', 'shelter'],
    });
  }

  async findByShelter(shelterId: string): Promise<Adoption[]> {
    return this.adoptionRepository.find({
      where: { shelterId },
      relations: ['pet', 'user', 'shelter'],
    });
  }
}
