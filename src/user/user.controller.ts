import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(readonly userService: UserService){}
    @Post('create')
    create(@Body() body) {
        return this.userService.createUser(
            body.email,
            body.password,
        );
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }
}
