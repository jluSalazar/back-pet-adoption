import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Pet } from './entities/pet.entity';
import { Adoption } from './entities/adoption.entity';
import { UsersService } from './services/users.service';
import { PetsService } from './services/pets.service';
import { AdoptionsService } from './services/adoptions.service';
import { UsersController } from './controllers/users.controller';
import { PetsController } from './controllers/pets.controller';
import { AdoptionsController } from './controllers/adoptions.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [User, Pet, Adoption],
        synchronize: false, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Pet, Adoption]),
  ],
  controllers: [UsersController, PetsController, AdoptionsController],
  providers: [UsersService, PetsService, AdoptionsService],
})
export class AppModule {}
