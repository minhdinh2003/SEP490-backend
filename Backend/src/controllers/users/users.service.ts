import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { hash } from 'bcrypt'
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { UserDetail } from 'src/model/dto/user.dto';
import { UserEntity } from 'src/model/entity/user.entity';
import { PageRequest } from 'src/model/request/page.request';
import { ServiceResponse } from 'src/model/response/service.response';
import { PrismaService } from 'src/repo/prisma.service';
import { generateRandomPassword, isEnvDevelopment } from 'src/utils/common.utils';

@Injectable()
export class UsersService extends BaseService<UserEntity, Prisma.UserCreateInput> {
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService)
    }
    //
    async add(entity: UserEntity): Promise<number> {
        const user = await this.prismaService.userRepo.findByEmail(entity.email)
        if (user) {
            throw new HttpException({ message: 'Email đã tồn tại' }, HttpStatus.BAD_REQUEST)
        }
        let passWord = generateRandomPassword(10);
        //if (isEnvDevelopment()) {
        passWord = "12345678";
        //}
        entity.passwordHash = await hash(passWord, 10);
        var result = await this.repository.create(entity, {
            select: {
                id: true
            }
        }, this.getMoreCreateData());
        await this._emailService.sendEmail(entity.email, "Quản trị đã tạo tài khoản cho bạn", "AdminCreateAccountForStudent.html", {
            userName: entity.email,
            passWord: passWord
        })
        return Number(result.id);
    }

    async update(id: number, model: Partial<UserEntity>): Promise<boolean> {
        var user = await this.prismaService.userRepo.findOneWithCondition({
            id: {
                not: id
            },
            email: model.email
        })
        if (user) {
            throw new HttpException({ message: 'Email đã tồn tại' }, HttpStatus.BAD_REQUEST)
        }
        await this.repository.update(id, model, this.getMoreUpdateData());
        return true;
    }

    async getCurrentUser(): Promise<ServiceResponse>{
        var userCurrent = await this.getOneAndReference({
            id: this._authService.getUserID()
        });
        if (!userCurrent){
            throw new HttpException({message: 'User not exist'}, HttpStatus.BAD_REQUEST);
        }
        const result = this._mapperService.mapData(userCurrent, UserEntity, UserDetail);
        return ServiceResponse.onSuccess(result);
    }

    async getNotification(param: PageRequest) {
        return this.prismaService.notificationRepo.getPaging(param, false);
    }

    async updateViewNotification(id: number){
        await this.prismaService.notification.update({
            where: {
                id: id
            },
            data: {
                isViewed: true
            }
        })
        return true;
    }


    

}
