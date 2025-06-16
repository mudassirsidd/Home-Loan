import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    ForbiddenException,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { UserService } from './users.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // adjust path if needed
  
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Req() req: any) {
    console.log(req.user);
    return this.userService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.userService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body, @Req() req: any) {
    return this.userService.update(+id, body, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.userService.remove(+id, req.user);
  }
}
