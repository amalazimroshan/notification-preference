import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { UserPreference } from './user-preference.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserPreferenceService {
  constructor(
    @InjectModel(UserPreference.name)
    private readonly userPreferenceModel: Model<UserPreference>,
  ) {}

  async create(
    createUserPreferenceDto: CreateUserPreferenceDto,
  ): Promise<UserPreference> {
    const newUserPreference = new this.userPreferenceModel(
      createUserPreferenceDto,
    );
    return newUserPreference.save();
  }

  findAll(): Promise<UserPreference[]> {
    return this.userPreferenceModel.find().exec();
  }

  findOne(id: string): Promise<UserPreference | null> {
    return this.userPreferenceModel.findById(id).exec();
  }

  async update(
    id: string,
    updateUserPreferenceDto: UpdateUserPreferenceDto,
  ): Promise<UserPreference> {
    const updatedPreference = await this.userPreferenceModel.findByIdAndUpdate(
      id,
      updateUserPreferenceDto,
      { new: true },
    );
    if (!updatedPreference) {
      throw new NotFoundException(`UserPreference with id ${id} not found`);
    }
    return updatedPreference;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userPreferenceModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`UserPreference with id ${id} not found`);
    }

    return { message: `UserPreference with id ${id} deleted successfully` };
  }
}
