// user/user.repository.ts
import { Prisma, PrismaClient, Role } from '@prisma/client';
import { BaseRepository } from './base.repo';
import { UserEntity } from 'src/model/entity/user.entity';

export class UserRepository extends BaseRepository<UserEntity, Prisma.UserCreateInput> {
  constructor(prisma: PrismaClient) {
    super(prisma, prisma.user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOneByField("email", email);
  }

  async getUserByRole(role: Role){
    return this.prisma.user.findMany({
      where: { role },
    });
  }
}
