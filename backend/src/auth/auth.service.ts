import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      throw new UnauthorizedException('User already exists with this email');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Role assign karna email ke basis pe
    const role = email === 'admin@gmail.com' ? 'admin' : 'user';

    const user = await this.userService.createUser({
      name,
      email,
      password: hashedPassword,
      role, // role bhi yahan pass karna hai
    });

    return { message: 'User registered successfully', userId: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}
