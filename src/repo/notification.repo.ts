import { Notification } from './../model/entity/notification.entity';
// user/user.repository.ts
import { Prisma, PrismaClient, Role } from '@prisma/client';
import { BaseRepository } from './base.repo';

export class NotificationRepository extends BaseRepository<Notification, Prisma.NotificationCreateInput> {
  constructor(prisma: PrismaClient) {
    super(prisma, prisma.notification);
  }

}
