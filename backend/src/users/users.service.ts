import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findAll(currentUser: User): Promise<User[]> {
    if (currentUser.role !== 'admin') throw new Error('Access Denied');
    return this.userRepository.find();
  }

  async findOne(id: number, currentUser: User): Promise<User> {
    if (currentUser.role !== 'admin') throw new Error('Access Denied');
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, body: Partial<User>, currentUser: User): Promise<any> {
    if (currentUser.role !== 'admin') throw new Error('Access Denied');
    return this.userRepository.update(id, body);
  }

  async remove(id: number, currentUser: User): Promise<any> {
    if (currentUser.role !== 'admin') throw new Error('Access Denied');
    return this.userRepository.delete(id);
  }
}
