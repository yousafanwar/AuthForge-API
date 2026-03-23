import { Controller, Post, Get, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';

@Controller('user')
export class UserController {
    constructor(readonly userService: UserService) { }
    @Post('create')
    create(@Body() body: CreateUserDto) {
        return this.userService.createUser(
            body.email,
            body.password,
        );
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Post('login')
    async login(@Body() dto: CreateUserDto) {
        const user = await this.userService.validateUser(
            dto.email,
            dto.password,
        );

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
}
