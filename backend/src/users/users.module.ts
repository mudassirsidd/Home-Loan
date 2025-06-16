import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './users.service';
import { UserController } from './users.controller'; // ✅ import controller
import { AuthModule } from '../auth/auth.module'; // 👈 Import AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController], // ✅ register the controller
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
